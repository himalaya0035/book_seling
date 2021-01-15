from rest_framework import serializers

from books.models import Book, Deal
from books.serializers import BookIconSerializer
from .models import Bookmark


class CartProductSerializer(serializers.ModelSerializer):
    product_data = serializers.SerializerMethodField()
    quantity = serializers.IntegerField()

    class Meta:
        model = Deal
        fields = ['id', 'product_data', 'quantity']

    def get_product_data(self, instance, *args, **kwargs):
        product_id = instance.product_id
        return BookIconSerializer(Book.objects.get(ISBN=product_id)).data


class BookmarkBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['ISBN', 'cover_image', 'rating', 'name']


class BookMarkListSerializer(serializers.ModelSerializer):
    book = BookmarkBookSerializer(many=True)

    class Meta:
        model = Bookmark
        fields = ['book']
