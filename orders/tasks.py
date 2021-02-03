from django.db.models import Sum, F, OuterRef

from book_seling.celery import app
from orders.models import ProductOrderOrCart, Order


@app.task
def remove_out_of_stock_products():
    ProductOrderOrCart.objects.annotate(
        available_stock=Sum('deal__quantity')).filter(cart__isnull=False, order__isnull=True,
                                                      available_stock__lt=F('quantity')) \
        .update(
        quantity=ProductOrderOrCart.objects.filter(id=OuterRef('id')).annotate(
            available_stock=Sum('deal__quantity')).values('available_stock')[:1]
    )


@app.task
def update_deal_and_book_data(order_obj_id):
    obj: Order = Order.objects.get(id=order_obj_id)

    for i in obj.productorderorcart_set.iterator():
        i.deal.product.sold_quantity = F('sold_quantity') + i.quantity
        i.deal.product.save()
        i.save()
