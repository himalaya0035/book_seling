from rest_framework import serializers

from books.models import Book
from books.serializers import BookIconSerializer
from .models import Bookmark, CartProduct


class CartProductSerializer(serializers.ModelSerializer):
    deal_data = serializers.SerializerMethodField('get_deal_data')
    deal_id = serializers.IntegerField()
    quantity = serializers.IntegerField(read_only=True)
    available_stock = serializers.IntegerField(required=False, read_only=True)

    class Meta:
        model = CartProduct
        fields = ['id', 'deal_data', 'quantity', 'deal_id', 'available_stock']

    def get_deal_data(self, instance: CartProduct, *args, **kwargs):
        return BookIconSerializer(instance.deal.product, remove_fields=['lowest_price']).data

    # def run_validators(self, value):
    #     for validator in copy(self.validators):
    #         if isinstance(validator, validators.UniqueTogetherValidator):
    #             self.validators.remove(validator)
    #     super(CartProductSerializer_2, self).run_validators(value)


class BookmarkBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['ISBN', 'cover_image', 'rating', 'name']


class BookMarkListSerializer(serializers.ModelSerializer):
    book = BookmarkBookSerializer(many=True)

    class Meta:
        model = Bookmark
        fields = ['book']
