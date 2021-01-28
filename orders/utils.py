from django.db.models import Sum, F, OuterRef, QuerySet

from orders.models import ProductOrderOrCart


def remove_out_of_stock_products():
    ProductOrderOrCart.objects.annotate(available_stock=Sum('deal__quantity')).filter(
        available_stock__lt=F('quantity')).update(
        quantity=ProductOrderOrCart.objects.filter(id=OuterRef('id')).annotate(
            available_stock=Sum('deal__quantity')).values('available_stock')[:1])


def update_deal_and_book_data(qs: QuerySet[ProductOrderOrCart]):
    for i in qs.iterator():
        i.deal.quantity = F('quantity') - i.quantity
        i.deal.save()
        i.deal.product.sold_quantity = F('sold_quantity') + i.quantity
        i.deal.product.save()
        i.save()
