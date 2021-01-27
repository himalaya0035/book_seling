from django.db.models import Sum, F, OuterRef

from orders.models import ProductOrderOrCart


def remove_out_of_stock_products():
    ProductOrderOrCart.objects.annotate(available_stock=Sum('deal__quantity')).filter(
        available_stock__lt=F('quantity')).update(
        quantity=ProductOrderOrCart.objects.filter(id=OuterRef('id')).annotate(
            available_stock=Sum('deal__quantity')).values('available_stock')[:1])
