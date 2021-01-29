from rest_framework import serializers

from accounts.models import Profile
from books.models import Book, Deal
from books.serializers import BookIconSerializer
from .models import Bookmark, ProductOrderOrCart


class BookListSerializer(serializers.ModelSerializer):
    author_names = serializers.SerializerMethodField()
    lowest_price = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):

        remove_fields = kwargs.pop('remove_fields', None)
        super(BookListSerializer, self).__init__(*args, **kwargs)
        if remove_fields:
            for remove_field in remove_fields:
                self.fields.pop(remove_field)

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


class CartProductSerializer(serializers.ModelSerializer):
    book_data = serializers.SerializerMethodField()
    deal_price = serializers.SerializerMethodField()

    class Meta:
        model = ProductOrderOrCart
        fields = ['book_data', 'quantity', 'deal', 'deal_price']

    def get_book_data(self, instance: ProductOrderOrCart, *args, **kwargs):
        book_obj = instance.deal.product
        return BookListSerializer(book_obj, remove_fields=['lowest_price']).data

    def get_deal_price(self, instance: ProductOrderOrCart, *args, **kwargs):
        return instance.deal.price
