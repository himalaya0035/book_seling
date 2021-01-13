from django.urls import path
from . import views

urlpatterns = [
    path('all', views.CartListView.as_view()),
    path('add_to_cart', views.AddToCart.as_view())
]
