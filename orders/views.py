from django.db.models import *
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from rest_framework.views import APIView

from books.models import Entity
from .models import Cart, CartProduct
from .serializers import CartProductSerializer


class MyThrottle(UserRateThrottle):

    def allow_request(self, request, view):
        if request.user.is_staff:
            return True

    def parse_rate(self, rate):
        return (45, 60)


class CartListView(ListAPIView):
    throttle_classes = [MyThrottle]
    permission_classes = [IsAuthenticated]
    serializer_class = CartProductSerializer

    def get_queryset(self, *args, **kwargs):
        qs = Entity.objects.values('product').filter(cartproduct__cart__user=self.request.user.profile) \
            .annotate(quantity=Count('product'))
        return qs

    """
    qs.annotate(
...     name=ExpressionWrapper(
...         F('product__name'), output_field=CharField()
...     )
... )
    
    """


class CartActionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        book_id = request.data.get('book_id')
        entity = Entity.objects.filter(product_id=book_id, deal_is_active=True, created_by__user__is_staff=True) \
            .order_by('price').first()

        if entity is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        cart_id = Cart.objects.filter(user=request.user.profile).values('id').first()
        obj: CartProduct = CartProduct.objects.create(cart_id=cart_id.pop('id'))
        obj.product.add(entity)
        obj.save()
        return Response(status=status.HTTP_201_CREATED)

    # def delete(self, request, *args, **kwargs):


class RemoveFromCart(APIView):
    def post(self, request, *args, **kwargs):
        book_id = request.data.get('book_id')

        cart_id = Cart.objects.filter(user=request.user.profile).values('id').first()

        qs = CartProduct.objects.filter(cart_id=cart_id.get('id'), product__product_id=book_id)

        cart_id.get('id')
        if not qs.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)

        qs.first().delete()

        return Response(status=status.HTTP_200_OK)
