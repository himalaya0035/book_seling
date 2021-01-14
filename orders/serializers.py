from rest_framework import serializers

from books.models import Entity, Book
from books.serializers import BookIconSerializer


class CartProductSerializer(serializers.ModelSerializer):
    product_data = serializers.SerializerMethodField()
    quantity = serializers.IntegerField()

    class Meta:
        model = Entity
        fields = ['id', 'product_data', 'quantity']

    def get_product_data(self, instance, *args, **kwargs):
        product_id = instance.get('product')
        return BookIconSerializer(Book.objects.get(id=product_id)).data
