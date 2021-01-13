from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from books.models import Entity
from books.serializers import EntitySerializer
from .models import Cart, CartProduct
from .serializers import CartProductSerializer


class CartListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EntitySerializer

    def get_queryset(self, *args, **kwargs):
        return Entity.objects.filter(cartproduct__cart__user=self.request.user.profile).annotate()

    """
    qs.annotate(
...     name=ExpressionWrapper(
...         F('product__name'), output_field=CharField()
...     )
... )
    
    """

    # def delete(self, request, *args, **kwargs):
    #     cart_obj = Cart.objects.get(user=request.user.profile)
    #     entity_id = request.data.get('entity_id')
    #     cart_product_obj = get_object_or_404('CartProduct', product_id=entity_id, cart=cart_obj)
    #     cart_product_obj.delete()
    #     return Response(status=status.HTTP_200_OK)


class AddToCart(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        book_id = request.data.get('book_id')
        entity = Entity.objects.filter(product_id=book_id, deal_is_active=True, created_by__user__is_staff=True)\
            .order_by('price').first()

        if entity is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        cart_id = Cart.objects.filter(user=request.user.profile).values('id').first()
        obj: CartProduct = CartProduct.objects.create(cart_id=cart_id.pop('id'))
        obj.product.add(entity)
        obj.save()
        return Response(data=CartProductSerializer(obj).data, status=status.HTTP_201_CREATED)
