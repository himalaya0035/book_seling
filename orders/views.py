from django.db.models import *
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, get_object_or_404, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from books.models import Deal, Book
from books.serializers import BookSerializer
from .models import Order
from .models import ProductOrderOrCart, Bookmark, Promocode, ShippingAddress
from .serializers import CartProductSerializer, DealSerializer
from .utils import remove_out_of_stock_products


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
        deal_id = request.data['deal_id']
        deal_obj = Deal.objects.filter(id=deal_id).values('quantity').first()
        obj: ProductOrderOrCart = get_object_or_404(ProductOrderOrCart, deal_id=deal_id)

        if obj.quantity - 1 == 0:
            obj.delete()
            return Response(status=status.HTTP_200_OK)

        obj.quantity -= 1
        obj.save()

        if obj.quantity > deal_obj['quantity']:
            return Response(data={
                'message': 'no more product left in this deal'
            }, status=status.HTTP_410_GONE)

        return Response(data={
            'removed from cart'
        }, status=status.HTTP_200_OK)


class BookMarkActionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        bookmark_obj, created = Bookmark.objects.get_or_create(user=request.user.profile)
        book_id = request.data.get('book_id')
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
        "name":"",
        "address":"",
        "contact_number":"",
        "email":""
    }    
}

"""


class Checkout(APIView):
    def post(self, request):
        cart_products_qs = ProductOrderOrCart.objects.filter(cart__user=request.user.profile).annotate(
            available_stock=Sum('deal__quantity'))

        promocode = request.data.get('promocode')
        shipping_details = request.data.get('shipping_details')
        discount_percent = 0
        if promocode is not None:
            promocode_obj = get_object_or_404(Promocode, code=promocode)
            discount_percent = promocode_obj.percentage_off

        in_stock = cart_products_qs.filter(available_stock__gte=F('quantity')).select_related('deal', 'deal__product')
        # out_of_stock = cart_products_qs.filter(available_stock__lt=F('quantity'))
        # if out_of_stock.exists():
        #     return Response(data={
        #         'message': 'There was some issue with some of your products',
        #         'in_stock_products': CartProductSerializer(in_stock, many=True).data,
        #         'out_of_stock_products': CartProductSerializer(out_of_stock, many=True).data
        #     })
        total_cost = in_stock.aggregate(total_amount=Sum(F('quantity') * F('deal__price')))['total_amount']
        total_cost = total_cost - (total_cost * discount_percent // 100)

        shipping_address_obj, created = ShippingAddress.objects.get_or_create(**shipping_details)

        order_obj = Order.objects.create(user=request.user, total_amount=total_cost,
                                         shipping_address=shipping_address_obj)

        in_stock.update(cart=None, order=order_obj)
        for i in in_stock.iterator():
            i.deal.quantity = F('quantity') - i.quantity
            i.deal.save()
            i.deal.product.sold_quantity = F('sold_quantity') + i.quantity
            i.deal.product.save()
            i.save()

        remove_out_of_stock_products()
        return Response(status=status.HTTP_201_CREATED)
