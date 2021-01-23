from django.conf import settings
from django.db.models import *
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, get_object_or_404, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from rest_framework.views import APIView

from books.models import Deal, Book
from books.serializers import BookSerializer
from .models import Order
from .models import ProductOrderOrCart, Bookmark, Promocode
from .serializers import CartProductSerializer, DealSerializer


class MyThrottle(UserRateThrottle):

    def allow_request(self, request, view):
        if request.user.is_staff:
            return True

    def parse_rate(self, rate):
        return 30, 60


class CartListView(ListCreateAPIView):
    if settings.DEBUG:
        throttle_classes = [MyThrottle]
    else:
        throttle_classes = [UserRateThrottle]

    permission_classes = [IsAuthenticated]
    serializer_class = CartProductSerializer

    def get_queryset(self, *args, **kwargs):
        profile = self.request.user.profile
        qs = ProductOrderOrCart.objects.filter(cart__user=profile)
        return qs

    def create(self, request, *args, **kwargs):
        deal_id = request.data['deal_id']
        deal_obj = Deal.objects.filter(id=deal_id).values('quantity').first()
        obj, created = ProductOrderOrCart.objects.get_or_create(deal_id=deal_id,
                                                                cart=self.request.user.profile.cart)
        if not created:
            obj.quantity += 1

        if obj.quantity > deal_obj['quantity']:
            return Response(data={
                'message': 'no more product left in this deal'
            }, status=status.HTTP_410_GONE)

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

# TODO
class RemoveFromCart(APIView):
    throttle_classes = [MyThrottle]

    def post(self, request, *args, **kwargs):
        cart_product_id = request.data.get('cart_product_id')
        cart_products = ProductOrderOrCart.objects.get(id=cart_product_id, cart__user=request.user.profile)
        print(cart_products)


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


class Checkout(APIView):
    def post(self, request):
        cart_products_qs = ProductOrderOrCart.objects.filter(cart__user=request.user.profile).annotate(
            available_stock=Sum('deal__quantity'))

        promocode = request.data.get('promocode')
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
        order_obj = Order.objects.create(user=request.user, total_amount=total_cost)
        in_stock.update(cart=None, order=order_obj)
        for i in in_stock:
            i.deal.quantity = F('quantity') - i.quantity
            i.deal.save()
            i.deal.product.sold_quantity = F('sold_quantity') + i.quantity
            i.deal.product.save()
            i.save()

        ProductOrderOrCart.objects.annotate(available_stock=Sum('deal__quantity')).filter(
            available_stock__lt=F('quantity')).update(
            quantity=ProductOrderOrCart.objects.filter(id=OuterRef('id')).annotate(
                available_stock=Sum('deal__quantity')).values('available_stock')[:1])

        return Response(status=status.HTTP_201_CREATED)
