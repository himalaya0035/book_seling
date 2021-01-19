from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import models
from django.db.models.signals import post_save

from accounts.models import Profile
from books.models import Book, Deal


def auto_cart_create(sender, instance, created, **kwargs):
    if created:
        Cart.objects.create(user=instance)


# class CartManager(models.Manager):
#     @staticmethod
#     def check(objects):
#         for i in objects:
#             i.clean()


class CartProduct(models.Model):
    deal = models.ForeignKey(Deal, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    cart = models.ForeignKey('Cart', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('deal', 'cart')

    def clean(self):
        if self.deal.quantity < self.quantity:
            raise ValidationError('out of stock')


class Cart(models.Model):
    user = models.OneToOneField(Profile, on_delete=models.CASCADE)


class Bookmark(models.Model):
    book = models.ManyToManyField(Book)
    user = models.OneToOneField(Profile, on_delete=models.CASCADE)


class Order(models.Model):
    order_status_choices = (
        ('pn', 'Pending'),
        ('ds', 'Dispatched'),
        ('ou', 'Out For Delivery'),
        ('dl', 'Delivered')
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ordered_on = models.DateTimeField(auto_now_add=True)
    promocode = models.ForeignKey('Promocode', null=True, blank=True, on_delete=models.SET_NULL)
    total_amount = models.PositiveIntegerField()
    status = models.CharField(choices=order_status_choices, max_length=2)


class OrderedItem(models.Model):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.product.sold_quantity += 1
        self.product.save()

    product = models.ForeignKey(Book, on_delete=models.CASCADE)
    qty = models.PositiveIntegerField()
    order = models.ForeignKey(Order, on_delete=models.CASCADE)


class Promocode(models.Model):
    code = models.CharField(max_length=8, primary_key=True)
    min_order_value = models.PositiveIntegerField()
    percentage_off = models.PositiveIntegerField()
    active = models.BooleanField(default=True)


# def auto_sold_qty_updater(sender, instance: OrderedItem, created, **kwargs):
#     if created:
#         print('here')
#         instance.product.sold_quantity += 1
#         instance.product.save()
#

post_save.connect(auto_cart_create, sender=Profile)
# post_save.connect(auto_sold_qty_updater, sender=OrderedItem)
