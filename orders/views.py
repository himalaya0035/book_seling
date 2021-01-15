from django.conf import settings
from django.db.models import *
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from rest_framework.views import APIView

from books.models import Book, Deal
from .models import CartProduct, Bookmark
from .serializers import BookMarkListSerializer
from .serializers import CartProductSerializer


class MyThrottle(UserRateThrottle):

    def allow_request(self, request, view):
        if request.user.is_staff:
            return True

    def parse_rate(self, rate):
        return 30, 60


#
class CartListView(ListAPIView):
    if settings.DEBUG:
        throttle_classes = [MyThrottle]
    else:
        throttle_classes = [UserRateThrottle]

    permission_classes = [IsAuthenticated]
    serializer_class = CartProductSerializer

    def get_queryset(self, *args, **kwargs):
        profile = self.request.user.profile
        # Book.objects.filter(cartproduct__cart__user=profile).annotate(quantity=Count('product'))
        return CartProduct.objects.filter(cart__user=profile)


#     """
#     qs.annotate(
# ...     name=ExpressionWrapper(
# ...         F('product__name'), output_field=CharField()
# ...     )
# ... )
#        qs: QuerySet[CartProduct] = CartProduct.objects.filter(cart__user=profile)
#         qs.annotate(available_stock=Sum('product__all_deals__quantity'))
#         qs.filter(available_stock__gte=F('quantity'))
#     """
#
#
class CartActionView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [MyThrottle]

    def post(self, request, *args, **kwargs):
        deal_id = request.data.get('deal_id')

        book_id = Deal.objects.get(id=deal_id).product_id
        obj, created = CartProduct.objects.get_or_create(product_id=book_id, cart=self.request.user.profile.cart)
        # created = True if object didn't existed

        if not created:
            obj.quantity = F('quantity') + 1
            obj.save()

        return Response(status=status.HTTP_201_CREATED)


class RemoveFromCart(APIView):
    throttle_classes = [MyThrottle]

    def post(self, request, *args, **kwargs):
        book_id = request.data.get('book_id')
        qs = CartProduct.objects.filter(cart__user=request.user.profile, product_id=book_id)
        if not qs.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)

        qs.first().delete()

        return Response(status=status.HTTP_200_OK)


class Checkout(APIView):
    def post(self, *args, **kwargs):
        profile = self.request.user.profile
        qs: QuerySet[CartProduct] = CartProduct.objects.filter(cart__user=profile)
        qs.annotate(available_stock=Sum('product__all_deals__quantity'))
        qs.filter(available_stock__gte=F('quantity'))


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


"""
{
"book_id":"5165156156121315131"
}
"""
