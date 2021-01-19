from django.urls import path
from . import views

urlpatterns = [
    path('login', views.Login.as_view()),
    path('register', views.Register.as_view()),
    path('logout', views.Logout.as_view()),
    path('profiles/<int:pk>', views.RetrieveProfileView.as_view()),
    path('del', views.DeleteProfile.as_view())
]
