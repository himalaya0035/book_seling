from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import *
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, get_object_or_404, ListAPIView, RetrieveUpdateDestroyAPIView

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_list_or_404

from accounts.tasks import send_email_to_user
from books.models import Deal, Book
from books.serializers import BookSerializer
from .models import Order
from .models import ProductOrderOrCart, Bookmark, Promocode, ShippingAddress
from .serializers import CartProductSerializer, DealSerializer, OrderListSerializer
from .tasks import remove_out_of_stock_products, update_deal_and_book_data


# class MyThrottle(UserRateThrottle):
#
#     def allow_request(self, request, view):
#         if request.user.is_staff:
#             return True
#
#     def parse_rate(self, rate):
#         return 30, 60


class CartListView(ListCreateAPIView):
    # if settings.DEBUG:
    #     throttle_classes = [MyThrottle]
    # else:
    #     throttle_classes = [UserRateThrottle]

    permission_classes = [IsAuthenticated]
    serializer_class = CartProductSerializer

    def get_queryset(self, *args, **kwargs):
        profile = self.request.user.profile
        qs = ProductOrderOrCart.objects.filter(cart__user=profile)
        return qs

    def create(self, request, *args, **kwargs):
        # pro : Profile = self.request.us
        deal_id = request.data['deal_id']
        deal_obj = Deal.objects.filter(id=deal_id).values('quantity').first()
        obj, created = ProductOrderOrCart.objects.get_or_create(deal_id=deal_id,
                                                                cart=self.request.user.profile.cart)

        if obj.quantity + 1 > deal_obj['quantity']:
            return Response(data={
                'message': 'no more product left in this deal'
            }, status=status.HTTP_410_GONE)

        if not created:
            obj.quantity += 1
        obj.save()

        return Response(
            data={
                'message': 'Added to cart'
            }
            , status=status.HTTP_201_CREATED)


#     """
#     qs.annotate(
# ...     name=ExpressionWrapper(
# ...         F('product__name'), output_field=CharField()
# ...     )
# ... )


class RemoveFromCart(APIView):
    # throttle_classes = [MyThrottle]

    def post(self, request, *args, **kwargs):
        pk = kwargs.get('deal_id')
        ProductOrderOrCart.objects.filter(deal_id=pk, cart__user=request.user.profile).delete()
        return Response(status=status.HTTP_200_OK)


class UpdateQty(APIView):

    def post(self, request, *args, **kwargs):
        pk = kwargs.get('deal_id')
        obj: ProductOrderOrCart = get_object_or_404(ProductOrderOrCart, deal_id=pk)

        if obj.quantity - 1 <= 0:
            obj.delete()
        else:
            obj.quantity -= 1
            obj.save()
        return Response(status=status.HTTP_200_OK)


class BookMarkActionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        bookmark_obj, created = Bookmark.objects.get_or_create(user=request.user.profile)
        book_id = request.data.get('book_id')

        if book_id is None or book_id == '':
            return Response(status=status.HTTP_400_BAD_REQUEST)

        qs = bookmark_obj.book.filter(ISBN=book_id)
        if qs.exists():
            bookmark_obj.book.remove(qs.first())
            return Response(status=status.HTTP_200_OK)
        else:
            bookmark_obj.book.add(book_id)
            return Response(status=status.HTTP_201_CREATED)

    def get(self, request, *args, **kwargs):
        qs = Book.objects.filter(bookmark__user=request.user.profile)
        data = BookSerializer(qs, many=True, remove_fields=['genre_names', 'genre', 'author', 'released_date', 'info'])
        return Response(data=data.data)


class GetDealOfBook(ListAPIView):
    serializer_class = DealSerializer

    def get_queryset(self):
        book_id = self.kwargs['pk']
        qs = Deal.objects.filter(product_id=book_id)
        return qs


"""

request payload
{

    "promocode":"",

    "shipping_details":{
        "name":"Priyansh Singh",
        "address":"113 North City Pilibhit Road Bareilly",
        "contact_number":"9412666633",
        "email":"singhpriyansh51001@gmail.com"
    }    
}

"""
from django.db import DatabaseError


class Checkout(APIView):

    def get(self, request, *args, **kwargs):

        data = ProductOrderOrCart.objects.filter(
            cart__user=request.user.profile,
        ).aggregate(total_qty=Sum('quantity'), total_amount=Sum(F('quantity') * F('deal__price')))

        return Response(
            data=data
        )

    def post(self, request):
        promocode = request.data.get('promocode')
        shipping_details = request.data.get('shipping_details')
        discount_percent = 0
        user: User = request.user
        if promocode is not None:
            promocode_obj = get_object_or_404(Promocode, code=promocode)
            discount_percent = promocode_obj.percentage_off

        if shipping_details is None:
            return Response(
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_products_qs: QuerySet[ProductOrderOrCart] = ProductOrderOrCart.objects.filter(
            cart__user=user.profile).annotate(
            available_stock=Sum('deal__quantity'))

        #  available_stock__gte => available_stock >= ProductOrderOrCart.qty

        try:
            with transaction.atomic():
                in_stock: QuerySet[ProductOrderOrCart] = cart_products_qs.filter(
                    available_stock__gte=F('quantity'))
                in_stock.select_for_update()

                if not in_stock.exists():
                    return Response(data={
                        'message': 'Product went out of stock'
                    },status=status.HTTP_400_BAD_REQUEST)

                total_cost = in_stock.aggregate(total_amount=Sum(F('quantity') * F('deal__price')))['total_amount']
                total_cost = total_cost - (total_cost * discount_percent // 100)

                shipping_address_obj, created = ShippingAddress.objects.get_or_create(**shipping_details,
                                                                                      user=request.user)

                order_obj = Order.objects.create(user=request.user, total_amount=total_cost,
                                                 shipping_address=shipping_address_obj)

                for i in in_stock.iterator():
                    i.deal.quantity = F('quantity') - i.quantity
                    i.deal.save()

                update_deal_and_book_data.delay(order_obj.id)
                remove_out_of_stock_products.delay()

                in_stock.update(cart=None, order=order_obj)

                send_email_to_user.delay([user.email], "order placed",
                                         f"Hi {user.first_name} just placed an order")

                return Response(status=status.HTTP_201_CREATED)

        except DatabaseError as e:
            print(e)
            return Response(data={
                'data': 'you missed it'
            })


"""

cover
name 
seller name
qty
shipping address
ttl amt
status

"""


class OrderListView(ListAPIView):
    serializer_class = OrderListSerializer

    def get_queryset(self):
        user: User = self.request.user
        return ProductOrderOrCart.objects.filter(order__user=user)

        # order_obj: QuerySet[Order] = Order.objects.filter(user=user)
        # return order_obj


class PendingOrder(APIView):
    def get(self, request, *args, **kwargs):
        # pending_orders = ProductOrderOrCart.objects.filter(order__status='pn', deal__seller__user=request.user)
        # pending_orders.update(or)
        # status = request.data.get('status')
        profile = request.user.profile
        pending_orders = Order.objects.filter(status='pn', productorderorcart__deal__seller=profile)
        pending_orders.update(status=status)


# todo
"""
pswd change
your orders
"""
