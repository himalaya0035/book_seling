from django.db import models
from django.db.models.signals import post_save
from rest_framework.exceptions import NotFound

from accounts.models import Profile
from books.models import Entity, Book


def auto_cart_create(sender, instance, created, **kwargs):
    if created:
        Cart.objects.create(user=instance)


class CartProduct(models.Model):
    product = models.ManyToManyField(Book)
    cart = models.ForeignKey('Cart', on_delete=models.CASCADE)
    # quantity = models.PositiveIntegerField()
    # cart = models.ManyToOneRel('Cart', )

    def is_available_in_stock(self):
        return self.product.product.deal_is_active

    # def __str__(self):
    #     return self.product.product.name


class Cart(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)

    def checkout(self):
        for i in self.cartproduct_set:
            active = i.is_available_in_stock()
            if not active:
                raise NotFound(detail='Deal is no longer available')
        else:
            return True


post_save.connect(auto_cart_create, sender=Profile)
