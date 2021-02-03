from rest_framework import serializers

from accounts.models import Profile
from books.models import Book, Deal
from books.serializers import BookIconSerializer
from .models import Bookmark, ProductOrderOrCart, Order, ShippingAddress


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

    def __init__(self, *args, **kwargs):

        remove_fields = kwargs.pop('remove_fields', None)
        super(DealSerializer, self).__init__(*args, **kwargs)
        if remove_fields:
            for remove_field in remove_fields:
                self.fields.pop(remove_field)

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


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        exclude = ['user']


class OrderListSerializer(serializers.ModelSerializer):
    book_details = serializers.SerializerMethodField()
    order_details = serializers.SerializerMethodField()
    seller_details = serializers.SerializerMethodField()

    class Meta:
        model = ProductOrderOrCart
        fields = ['quantity', 'book_details', 'order_details', 'seller_details']

    def get_book_details(self, instance: ProductOrderOrCart, *args, **kwargs):
        deal: Deal = instance.deal
        price = deal.price
        return {**BookIconSerializer(deal.product, remove_fields=['lowest_price', 'rating']).data, 'price': price}

    def get_order_details(self, instance: ProductOrderOrCart, *args, **kwargs):
        order: Order = instance.order
        return {
            'total_amount': order.total_amount,
            'ordered_on': order.ordered_on,
            'shipping_address': ShippingAddressSerializer(order.shipping_address).data,
            'status': order.status
        }

    def get_seller_details(self, instance: ProductOrderOrCart, *args, **kwargs):
        return DealSerializer(instance.deal, remove_fields=['id']).data
