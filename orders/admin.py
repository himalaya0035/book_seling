from django.contrib import admin
from . import models
from django.utils.html import format_html
from books.models import Deal


class OrderAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'status', 'total_amount', 'ordered_on', 'user']

    class Meta:
        model = models.Order


class ProductOrderOrCartAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'quantity', 'available_stock', 'sold_quantity', 'deal_link']

    class Meta:
        model = models.ProductOrderOrCart

    def deal_link(self, obj: models.ProductOrderOrCart):
        url = format_html('<a href="/admin/books/deal/{deal_id}">{product_name}</a>', deal_id=obj.deal_id,
                          product_name=obj.deal.product.name)
        return url

    deal_link.allow_tags = True
    deal_link.short_description = 'Deal'

    def available_stock(self, obj: models.ProductOrderOrCart):
        return obj.deal.quantity

    def sold_quantity(self, obj: models.ProductOrderOrCart):
        return obj.deal.product.sold_quantity


admin.site.register(
    (
        models.Cart,
        models.Bookmark,
        models.Promocode,
        models.ShippingAddress
    )
)

admin.site.register(
    models.ProductOrderOrCart,
    ProductOrderOrCartAdmin,
)

admin.site.register(
    models.Order,
    OrderAdmin
)