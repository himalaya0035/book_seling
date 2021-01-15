from django.contrib import admin
from .models import Cart, CartProduct, Bookmark

admin.site.register((Cart, CartProduct, Bookmark))
