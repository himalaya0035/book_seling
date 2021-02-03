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

    def __str__(self):
        return self.deal.product.name


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

    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Order(models.Model):
    order_status_choices = (
        ('Pending', 'Pending'),
        ('Dispatched', 'Dispatched'),
        ('Out For Delivery', 'Out For Delivery'),
        ('Delivered', 'Delivered')
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ordered_on = models.DateTimeField(auto_now_add=True)
    promocode = models.ForeignKey('Promocode', null=True, blank=True, on_delete=models.SET_NULL)
    total_amount = models.PositiveIntegerField()
    status = models.CharField(choices=order_status_choices, max_length=20, default='Pending')
    shipping_address = models.ForeignKey(ShippingAddress, null=True, on_delete=models.SET_NULL)


class Promocode(models.Model):
    code = models.CharField(max_length=8, primary_key=True)
    min_order_value = models.PositiveIntegerField()
    percentage_off = models.PositiveIntegerField()
    active = models.BooleanField(default=True)


post_save.connect(auto_cart_create, sender=Profile)

"""
Hey {{name}},
Thank you for shopping with us.

Order Details:

⏩ Order Total : Rs{{total}}
⏩ Transaction ID : {{transaction_id}}
⏩ Order Items : {{items_no}}

Items Ordered :
    {% for item in items %}
        📝 {{item}}  Rs{{item.price}}  x{{item.quantity}}
    {% endfor %}

Delivery Address : {{address}}

Thank you for being a Shree Himalaya Traders customer 😊. We sincerely appreciate your business and hope you come back soon!


Regards,
Shree Himalaya Traders


order placed

"""
