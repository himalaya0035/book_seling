from django.core.cache import cache
from django.db.models import Count
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status
from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListCreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.serializers import BookListSerializer
from .models import Book, Author, Genre
from .permissions import UpdateDeleteObjectPermission
from .serializers import AuthorSerializer, BookSerializer, GenreSerializer, BookIconSerializer


# todo caching

class BookListView(ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookListSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['name', 'author__name', 'genre__name', 'ISBN',
                        'author__id']
    search_fields = ['name', 'author__name', 'genre__name']


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

    @method_decorator(cache_page(60 * 15))
    def dispatch(self, request, *args, **kwargs):
        super(GenreRetrieveView, self).dispatch(request, *args, **kwargs)


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

            # data = Book.objects.filter(genre__in=fav_genres).order_by('-sold_quantity').filter(
            #     all_deals__quantity__gt=0).order_by('-rating')[:9]
            data = Book.objects.filter(genre__in=fav_genres).order_by('-sold_quantity').order_by('-rating')[:9]
            data = BookIconSerializer(data, many=True).data

            cache.set(f'{user.id}', data, 60 * 20)
            # cache timeout=20 min

        return Response(data=data, status=status.HTTP_200_OK)


class BestSellerView(ListAPIView):
    serializer_class = BookIconSerializer
    queryset = Book.objects.order_by('-date_created').order_by('-rating')[:9]


class TopAuthors(ListAPIView):
    queryset = Author.objects.annotate(booksWritten=Count('book')).order_by('-booksWritten')[:9]

    def get_serializer(self, *args, **kwargs):
        return AuthorSerializer(*args, **kwargs, remove_fields=['info'])


# class RegisterNewBook(APIView):
#     def post(self, *args, **kwargs):


"""

{
"ISBN":"qwqqer4567",
"name": "Hello Django",
"author": [1,2],
"genre":[1],
"price":"5000"
}

"""


class GetBooksByAuthors(ListAPIView):
    serializer_class = BookIconSerializer

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        return Book.objects.filter(author=pk)


class GetNewReleases(ListAPIView):
    serializer_class = BookIconSerializer
    queryset = Book.objects.order_by('-date_created')[:9]


class GetPopularBooks(ListAPIView):
    serializer_class = BookIconSerializer
    queryset = Book.objects.all().order_by('-sold_quantity')[:9]


class SimilarBookView(ListAPIView):
    serializer_class = BookIconSerializer

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        return Book.objects.filter(genre__book__ISBN=pk)
