from django.core.cache import cache
from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status
from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListCreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Book, Author, Genre
from .permissions import UpdateDeleteObjectPermission
from .serializers import AuthorSerializer, BookSerializer, GenreSerializer, BookIconSerializer


class BookListView(ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['name', 'author__name', 'genre__name', 'ISBN',
                        'author__id']
    search_fields = ['name', 'author__name', 'genre__name']

    def get_serializer_context(self):
        print(dir(self.request.session))
        context = super(BookListView, self).get_serializer_context()
        context.update({'request': self.request})
        return context

    # @method_decorator(cache_page(60 * 5))
    # def dispatch(self, *args, **kwargs):
    #     return super(BookListView, self).dispatch(*args, **kwargs)


class BookActionView(RetrieveUpdateDestroyAPIView):
    # permission_classes = [UpdateDeleteObjectPermission]
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class AuthorActionView(RetrieveUpdateDestroyAPIView):
    permission_classes = [UpdateDeleteObjectPermission]
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    # lookup_field = 'name'


class AuthorListView(ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['name', 'id', 'info']
    search_fields = ['name', 'info']

    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


class GenreRetrieveView(RetrieveAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    lookup_field = 'name'


class GenreListView(ListAPIView):
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['name']
    search_fields = ['name']

    queryset = Genre.objects.all()
    serializer_class = GenreSerializer


class GetRecommendedBooks(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        data = cache.get(f'{user.id}')

        if data is None:
            fav_genres = user.fav_genres.all()
            # data = Book.objects.filter(genre__in=fav_genres, entity_set__deal_is_active=False).annotate(
            #     dealCount=Count("entity_set__deal_is_active")).filter(entity_set__deal_is_active=True).order_by(
            #     '-dealCount').order_by('-rating')[:12]

            data = Book.objects.filter(genre__in=fav_genres).order_by('-sold_quantity').filter(
                all_deals__quantity__gt=0).order_by('-rating')[:12]

            data = BookSerializer(data, many=True).data

            cache.set(f'{user.id}', data, 60 * 60)
            # cache timeout=1hr

        return Response(data=data, status=status.HTTP_200_OK)


class BestSellerView(ListAPIView):
    serializer_class = BookSerializer
    queryset = Book.objects.order_by('-date_created').order_by('-rating')[:12]


class TopAuthors(ListAPIView):
    serializer_class = AuthorSerializer
    queryset = Author.objects.annotate(booksWritten=Count('book')).order_by('-booksWritten')[:12]


# class RegisterNewBook(APIView):
#     def post(self, *args, **kwargs):
#         request_data = self.request.data
#
#         ISBN = request_data.get('ISBN')
#         qs = Book.objects.filter(ISBN=ISBN)
#         exists = qs.exists()
#
#         if exists:
#             entity_obj = Entity.objects.create(product=qs.first(), created_by=self.request.user.profile,
#                                                price=request_data.pop('price'))
#
#         else:
#             genre_names = request_data.pop('genre_names')
#
#             serialized = BookSerializer(data={**request_data, ISBN: ISBN})
#
#             if serialized.is_valid(raise_exception=False):
#                 book_obj: Book = serialized.save()
#                 serialized_entity = EntitySerializer(
#                     data={**request_data, 'product': book_obj.id, 'created_by': self.request.user.profile.id})
#                 if serialized_entity.is_valid(raise_exception=True):
#                     entity_obj = serialized_entity.save()
#
#                 else:
#                     book_obj.delete()
#                     return Response(status=status.HTTP_400_BAD_REQUEST)
#             else:
#                 return Response(status=status.HTTP_400_BAD_REQUEST)
#
#         return Response(EntitySerializer(entity_obj).data, status=status.HTTP_201_CREATED)


"""

{
"ISBN":"qwqqer4567",
"name": "Hello Django",
"author": [1,2],
"genre":[1],
"price":"5000"
}

"""


# class GetBooksByAuthors(ListAPIView):
#     serializer_class = BookSerializer
#
#     def get_queryset(self):
#         pk = (self.kwargs.get('pk'))
#         author = Author.objects.get(id=pk)
#         return author.book_set
class GetBooksByAuthors(ListAPIView):
    serializer_class = BookIconSerializer

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        return Book.objects.filter(author=pk)
