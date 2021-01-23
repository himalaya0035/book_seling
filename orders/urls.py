from django.urls import path
from . import views

urlpatterns = [
    path('all', views.CartListView.as_view()),
    # path('add-to-cart', views.AddToCartView.as_view()),
    path('remove-from-cart', views.RemoveFromCart.as_view()),
    path('bookmark', views.BookMarkActionView.as_view()),
    path('checkout', views.Checkout.as_view()),
    path('<int:pk>', views.GetDealOfBook.as_view())
]
