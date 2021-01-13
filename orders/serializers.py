from rest_framework import serializers
from .models import Profile, Cart, CartProduct, Entity


class CartProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartProduct
        fields = ['product']


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ['cartproduct_set']


# class CreateCartProductSerializer(serializers.ModelSerializer):
#     name = serializers.CharField()
#     price = serializers.IntegerField()

