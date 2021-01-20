from django.contrib import admin
from .models import Cart, ProductOrderOrCart, Bookmark, Order, Promocode

admin.site.register((Cart, ProductOrderOrCart, Bookmark, Order, Promocode))
