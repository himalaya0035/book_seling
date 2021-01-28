from django.contrib import admin
from . import models

admin.site.register(
    (
        models.Cart,
        models.ProductOrderOrCart,
        models.Bookmark,
        models.Order,
        models.Promocode,
        models.ShippingAddress
    )
)
