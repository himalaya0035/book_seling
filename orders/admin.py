from django.contrib import admin
from .models import Cart, CartProduct, Bookmark, OrderedItem, Order, Promocode

admin.site.register((Cart, CartProduct, Bookmark, OrderedItem, Order, Promocode))
