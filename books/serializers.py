from rest_framework import serializers

from .models import Book, Genre, Author, Entity


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
    price = serializers.SerializerMethodField('get_price')

    class Meta:
        model = Book
        fields = ['id', 'genre_names', 'author_details', 'ISBN', 'name', 'genre', 'author', 'cover_image',
                  'released_date', 'info', 'rating', 'price']
        read_only_fields = ['released_date', 'genre_names', 'author_details', 'price']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        del ret['genre']
        del ret['author']
        return ret

    def get_price(self, instance: Book, *args, **kwargs):
        qs = instance.entity_set.filter(deal_is_active=True).values('price').order_by('price')[0]
        return qs['price']


class EntitySerializer(serializers.ModelSerializer):
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())
    name = serializers.SerializerMethodField("get_name")

    class Meta:
        model = Entity
        fields = ['id', 'product', 'created_by', 'price', 'name']

    def get_name(self, instance: Entity, *args, **kwargs):
        name = instance.product.name
        return name
        # return self

    # def is_valid(self, raise_exception=False):
    #     super(EntitySerializer, self).is_valid(raise_exception)
    #     if self.errors == {
    #         'product': {'ISBN': [ErrorDetail(string='book with this ISBN already exists.', code='unique')]}}:
    #         self._errors.pop('product')
    #         self.was_created = True
    #
    #         return True
    #
    # def create(self, validated_data):
    #     product_data = validated_data.pop('product')
    #
    #     if not self.was_created:
    #
    #         genres = product_data.pop('genre')
    #         authors = product_data.pop('author')
    #         book_obj: Book = Book.objects.create(**product_data)
    #
    #         for genre in genres:
    #             book_obj.genre.add(genre)
    #
    #         for author in authors:
    #             book_obj.author.add(author)
    #
    #         entity_obj = Entity.objects.create(**validated_data, product=book_obj)
    #         book_obj.save()
    #         return entity_obj
    #
    #     elif self.was_created:
    #         book_obj = Book.objects.get(ISBN=validated_data.pop('ISBN'))
    #         entity_obj = Entity.objects.create(**validated_data, product=book_obj)
    #
    #         return entity_obj


class BookIconSerializer(serializers.ModelSerializer):
    price = serializers.SerializerMethodField('get_price')

    class Meta:
        model = Book
        fields = ['id', 'cover_image', 'name', 'rating', 'price']

    def get_price(self, instance: Book, *args, **kwargs):
        qs = instance.entity_set.filter(deal_is_active=True).values('price').order_by('price').first()
        return qs['price']
