from django.urls import path
from . import views

urlpatterns = [
    path('books/all', views.BookListView.as_view()),
    path('authors/all', views.AuthorListView.as_view()),
    path('genre/all', views.GenreListView.as_view()),
    path('entity/all', views.EntityListView.as_view()),

    # todo
    path('books/<int:pk>', views.BookActionView.as_view()),
    path('authors/<int:pk>', views.AuthorActionView.as_view()),
    path('genre/<str:name>', views.GenreRetrieveView.as_view()),
    # todo testing
    path('entity/<int:pk>', views.EntityActionView.as_view()),

    path('books/recommended', views.GetRecommendedBooks.as_view()),
    path('books/best-sellers', views.BestSellerView.as_view()),
    path('authors/top', views.TopAuthors.as_view()),

    path('authors/<int:pk>/books', views.GetBooksByAuthors.as_view()),
    # path('genre/<int:pk>/books', views.GetBooksByAuthors.as_view()),

    path('books/<int:pk>/entities', views.GetEntityByBook.as_view()),

    path('books/new', views.RegisterNewBook.as_view())

]
