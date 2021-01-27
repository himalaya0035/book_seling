from rest_framework import serializers

from accounts.models import Profile
from books.models import Book, Deal
from books.serializers import BookIconSerializer
from .models import Bookmark, ProductOrderOrCart


class CartProductSerializer(serializers.ModelSerializer):
    deal_data = serializers.SerializerMethodField('get_deal_data')
    deal_id = serializers.IntegerField()
    quantity = serializers.IntegerField(read_only=True)
    available_stock = serializers.IntegerField(required=False, read_only=True)

    class Meta:
        model = ProductOrderOrCart
        fields = ['id', 'deal_data', 'quantity', 'deal_id', 'available_stock']

    def get_deal_data(self, instance: ProductOrderOrCart, *args, **kwargs):
        return BookIconSerializer(instance.deal.product, remove_fields=['lowest_price']).data


class BookListSerializer(serializers.ModelSerializer):
    author_names = serializers.SerializerMethodField()
    lowest_price = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ['ISBN', 'cover_image', 'rating', 'name', 'author_names', 'lowest_price']

    def get_author_names(self, instance: Book, *args, **kwargs):
        return instance.author.all().values_list('name', flat=True)

    def get_lowest_price(self, instance: Book, *args, **kwargs):
        lowest_price = instance.all_deals.filter(quantity__gt=0).values('price', 'id', 'quantity').order_by(
            'price').first()
        return lowest_price


class DealSerializer(serializers.ModelSerializer):
    seller = serializers.SerializerMethodField()

    class Meta:
        model = Deal
        fields = ['id', 'seller', 'price']

    def get_seller(self, instance: Deal, *args, **kwargs):
        profile: Profile = instance.seller.user.profile
        return {'rating': profile.rating, 'firm_name': profile.firm_name}
