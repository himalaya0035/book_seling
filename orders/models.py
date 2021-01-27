from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.signals import post_save

from accounts.models import Profile
from books.models import Book, Deal


def auto_cart_create(sender, instance, created, **kwargs):
    if created:
        Cart.objects.create(user=instance)


class ProductOrderOrCart(models.Model):
    deal = models.ForeignKey(Deal, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    cart = models.ForeignKey('Cart', on_delete=models.CASCADE, null=True, blank=True)
    order = models.ForeignKey('Order', null=True, on_delete=models.CASCADE, blank=True)

    class Meta:
        unique_together = ('deal', 'cart')

    def clean(self):
        if self.deal.quantity < self.quantity:
            raise ValidationError('out of stock')

    def save(self, *args, **kwargs):
        if self.order is None and self.cart is None:
            raise ValidationError("order and cart both can't be none")

        if self.order and self.cart:
            raise ValidationError('product cant be in order and cart at same time')
        super(ProductOrderOrCart, self).save(*args, **kwargs)


class Cart(models.Model):
    user = models.OneToOneField(Profile, on_delete=models.CASCADE)


class Bookmark(models.Model):
    book = models.ManyToManyField(Book)
    user = models.OneToOneField(Profile, on_delete=models.CASCADE)


class ShippingAddress(models.Model):
    name = models.CharField(max_length=50)
    address = models.TextField()
    contact_number = models.CharField(max_length=13)
    email = models.EmailField()

    user = models.OneToOneField(User, on_delete=models.CASCADE)


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
    status = models.CharField(choices=order_status_choices, max_length=2, default='pn')
    shipping_address = models.ForeignKey(ShippingAddress, null=True, on_delete=models.SET_NULL)


class Promocode(models.Model):
    code = models.CharField(max_length=8, primary_key=True)
    min_order_value = models.PositiveIntegerField()
    percentage_off = models.PositiveIntegerField()
    active = models.BooleanField(default=True)


post_save.connect(auto_cart_create, sender=Profile)
