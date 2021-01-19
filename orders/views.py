from django.conf import settings
from django.db.models import *
from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from rest_framework.views import APIView

from books.models import Deal, Book
from .models import CartProduct, Bookmark
from .models import Order, OrderedItem
from .serializers import BookMarkListSerializer
from .serializers import CartProductSerializer


class MyThrottle(UserRateThrottle):

    def allow_request(self, request, view):
        if request.user.is_staff:
            return True

    def parse_rate(self, rate):
        return 30, 60


#
class CartListView(ListCreateAPIView):
    if settings.DEBUG:
        throttle_classes = [MyThrottle]
    else:
        throttle_classes = [UserRateThrottle]

    permission_classes = [IsAuthenticated]
    # serializer_class = CartProductSerializer
    serializer_class = CartProductSerializer

    def get_queryset(self, *args, **kwargs):
        profile = self.request.user.profile
        qs = CartProduct.objects.filter(cart__user=profile)
        return qs

    def create(self, request, *args, **kwargs):
        deal_id = request.data['deal_id']
        deal_obj = Deal.objects.filter(id=deal_id).values('quantity').first()
        obj, created = CartProduct.objects.get_or_create(deal_id=deal_id,
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
        cart_products = CartProduct.objects.get(id=cart_product_id, cart__user=request.user.profile)
        print(cart_products)


class BookMarkActionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        bookmark_obj, created = Bookmark.objects.get_or_create(user=request.user.profile)
        book_id = request.data.get('book_id')
        # obj = get_object_or_404(Book, ISBN=book_id)
        # bookmark_obj.book.add(obj)
        qs = bookmark_obj.book.filter(ISBN=book_id)
        print(qs)
        if qs.exists():
            bookmark_obj.book.remove(qs.first())
            return Response(status=status.HTTP_410_GONE)
        else:
            bookmark_obj.book.add(book_id)
            return Response(status=status.HTTP_201_CREATED)

    def get(self, request, *args, **kwargs):
        qs = Bookmark.objects.filter(user=request.user.profile)
        return Response(BookMarkListSerializer(qs, many=True).data, status=status.HTTP_200_OK)


class Checkout(APIView):
    # TODO apply promocode feature
    # TODO remove solf products from others cart
    def post(self, request):
        cart_products_qs = CartProduct.objects.filter(cart__user=request.user.profile).annotate(
            available_stock=Sum('deal__quantity'))

        in_stock = cart_products_qs.filter(available_stock__gte=F('quantity'))
        out_of_stock = cart_products_qs.filter(available_stock__lt=F('quantity'))
        if out_of_stock.exists():
            return Response(data={
                'message': 'There was some issue with some of your products',
                'in_stock_products': CartProductSerializer(in_stock, many=True).data,
                'out_of_stock_products': CartProductSerializer(out_of_stock, many=True).data
            })
        Deal.objects.filter(cartproduct__in=in_stock).update(quantity=F('quantity') - 1)

        total_cost = in_stock.aggregate(total_amount=Sum(F('quantity') * F('deal__price')))['total_amount']

        order_obj = Order.objects.create(user=request.user, total_amount=total_cost, status='pn')

        OrderedItem.objects.bulk_create(
            [OrderedItem(product_id=i.deal.product_id, qty=i.quantity, order=order_obj) for i in in_stock])
        cart_products_qs.delete()
        return Response(status=status.HTTP_201_CREATED)
