from django.urls import path

from . import views

urlpatterns = [
    path('books/all', views.BookListView.as_view()),
    path('authors/all', views.AuthorListView.as_view()),

    path('authors/<int:pk>', views.AuthorActionView.as_view()),
    # todo optimization
    path('books/recommended', views.GetRecommendedBooks.as_view()),
    path('books/best-sellers', views.BestSellerView.as_view()),
    path('authors/top', views.TopAuthors.as_view()),
    # todo optimization
    path('books/new', views.GetNewReleases.as_view()),
    path('books/popular', views.GetPopularBooks.as_view()),

    path('books/<slug:pk>/similar', views.SimilarBookView.as_view()),
    path('books/<slug:pk>', views.BookActionView.as_view()),
    path('genre/<str:name>', views.GenreRetrieveView.as_view()),
]
