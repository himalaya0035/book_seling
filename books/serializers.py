from rest_framework import serializers

from .models import Book, Genre, Author, Deal


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

    # def to_representation(self, instance):
    #     ret = super().to_representation(instance)
    #     del ret['favourite_of']
    #     return ret


class BookSerializer(serializers.ModelSerializer):
    # created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())
    # genre = GenreSerializer(source='get_genre_set', many=True)

    def __init__(self, *args, **kwargs):
        remove_fields = kwargs.pop('remove_fields', None)
        super(BookSerializer, self).__init__(*args, **kwargs)
        if remove_fields:
            for remove_field in remove_fields:
                self.fields.pop(remove_field)

    author_details = AuthorSerializer(many=True, source='get_all_authors',
                                      remove_fields=['info', 'created_by', 'image'])

    genre_names = GenreSerializer(many=True, source='get_genre_set')
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
