from rest_framework import serializers

from .models import Book, Genre, Author


# todo
class AuthorSerializer(serializers.ModelSerializer):
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())

    def __init__(self, *args, **kwargs):

        remove_fields = kwargs.pop('remove_fields', None)
        super(AuthorSerializer, self).__init__(*args, **kwargs)
        if remove_fields:
            for remove_field in remove_fields:
                self.fields.pop(remove_field)

    class Meta:
        model = Author
        fields = ['id', 'name', 'info', 'created_by', 'image']
        # fields = '__all__'


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['name']


class BookSerializer(serializers.ModelSerializer):

    def __init__(self, *args, **kwargs):
        remove_fields = kwargs.pop('remove_fields', None)
        super(BookSerializer, self).__init__(*args, **kwargs)
        if remove_fields:
            for remove_field in remove_fields:
                self.fields.pop(remove_field)

    author_details = serializers.SerializerMethodField()
    genre_names = serializers.SerializerMethodField()

    lowest_price = serializers.SerializerMethodField('get_lowest_price')

    class Meta:
        model = Book
        fields = ['ISBN', 'name', 'genre_names', 'author_details', 'genre', 'author', 'cover_image',
                  'released_date', 'info', 'rating', 'lowest_price']
        read_only_fields = ['released_date', 'genre_names', 'author_details', 'lowest_price']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        del ret['genre']
        del ret['author']
        return ret

    def get_lowest_price(self, instance: Book, *args, **kwargs):
        lowest_price = instance.all_deals.filter(quantity__gt=0).values('price', 'id', 'quantity').order_by(
            'price').first()
        return lowest_price

    def get_genre_names(self, instance: Book, *args, **kwargs):
        genre_names = instance.genre.all().values_list('name', flat=True)
        return genre_names

    def get_author_details(self, instance: Book, *args, **kwargs):
        author_names = instance.author.all().values_list('name', flat=True)
        return author_names


class BookIconSerializer(serializers.ModelSerializer):
    lowest_price = serializers.SerializerMethodField('get_lowest_price')

    def __init__(self, *args, **kwargs):
        remove_fields = kwargs.pop('remove_fields', None)
        super(BookIconSerializer, self).__init__(*args, **kwargs)
        if remove_fields:
            for remove_field in remove_fields:
                self.fields.pop(remove_field)

    class Meta:
        model = Book
        fields = ['ISBN', 'cover_image', 'name', 'rating', 'lowest_price']

    def get_lowest_price(self, instance: Book, *args, **kwargs):
        lowest_price = instance.all_deals.filter(quantity__gt=0).values('price').order_by('price').first()
        return lowest_price['price']
