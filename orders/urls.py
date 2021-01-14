from django.urls import path
from . import views

urlpatterns = [
    path('all', views.CartListView.as_view()),
    path('add-to-cart', views.CartActionView.as_view()),
    path('remove-from-cart', views.RemoveFromCart.as_view())
]
