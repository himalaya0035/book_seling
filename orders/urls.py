from django.urls import path
from . import views

urlpatterns = [
    path('all', views.CartListView.as_view()),
    # path('add-to-cart', views.AddToCartView.as_view()),
    path('remove-from-cart/<int:deal_id>', views.RemoveFromCart.as_view()),
    path('update-quantity/<int:deal_id>', views.UpdateQty.as_view()),
    path('bookmark', views.BookMarkActionView.as_view()),
    path('checkout', views.Checkout.as_view()),
    # path('deals/<slug:book_id>', views.GetDealOfBook.as_view()),
    path('deals/<slug:pk>', views.GetDealOfBook.as_view()),

]

"""
/api/int

/api 
{
x: 'y'
}

"""