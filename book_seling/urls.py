"""book_seling URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import debug_toolbar
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.contrib.auth.decorators import login_required
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from django.urls import path, include
from django.views.decorators.cache import cache_page, cache_control
from django.views.generic import TemplateView

from .decorators import AnonymousRequired, CheckoutValidation

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('books.urls')),
    path('api/accounts/', include('accounts.urls')),
    path('api/cart/', include('orders.urls')),
    path('__debug__/', include(debug_toolbar.urls)),

    path('accounts/reset_password/',
         (auth_views.PasswordResetView.as_view(template_name='passwordReset.html')),
         name="reset_password"),

    path('accounts/reset_password_sent',
         (auth_views.PasswordResetDoneView.as_view(template_name='passwordResetSent.html')),
         name="password_reset_done"),

    path('accounts/reset/<uidb64>/<token>',
         (auth_views.PasswordResetConfirmView.as_view(template_name='setNewPassword.html')),
         name="password_reset_confirm"),

    path('accounts/reset_password_complete',
         (auth_views.PasswordResetCompleteView.as_view(template_name='passwordResetComplete.html')),
         name="password_reset_complete"),

]

urlpatterns += [
    path('login', (AnonymousRequired(TemplateView.as_view(template_name='login.html')))),
    path('signup', AnonymousRequired(TemplateView.as_view(template_name='signup.html'))),
    path('', TemplateView.as_view(template_name='index.html')),
    path('author/<int:pk>', TemplateView.as_view(template_name='author.html')),
    path('book/<slug>', TemplateView.as_view(template_name='book.html')),
    path('genre/<str>/books', TemplateView.as_view(template_name='genre.html')),
    path('profile', login_required(TemplateView.as_view(template_name='profile.html'))),
    path('bookmark', login_required(TemplateView.as_view(template_name='bookmarked.html'))),
    path('cart', login_required(TemplateView.as_view(template_name='cart.html'))),
    path('checkout', login_required(TemplateView.as_view(template_name='checkout.html'))),
    path('accounts/update', login_required(TemplateView.as_view(template_name='accounts.html'))),
    path('confirm-order', login_required(CheckoutValidation(TemplateView.as_view(template_name='confirmOrder.html')))),
    path('order-complete', login_required(TemplateView.as_view(template_name='orderComplete.html'))),
    path('your-orders', login_required(TemplateView.as_view(template_name='orders.html'))),
    path('genre-list', TemplateView.as_view(template_name='genresList.html'))
]

urlpatterns = urlpatterns + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# urlpatterns = urlpatterns + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += staticfiles_urlpatterns()
