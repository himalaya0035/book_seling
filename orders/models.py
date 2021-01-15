from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import models
from django.db.models.signals import post_save
from rest_framework.exceptions import NotFound
from accounts.models import Profile
from books.models import Book


def auto_cart_create(sender, instance, created, **kwargs):
    if created:
        Cart.objects.create(user=instance)


# class CartManager(models.Manager):
#     @staticmethod
#     def check(objects):
#         for i in objects:
#             i.clean()


class CartProduct(models.Model):
    product = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    cart = models.ForeignKey('Cart', on_delete=models.CASCADE)

    # objects = CartManager()

    def clean(self):
        if not self.product.in_stock:
            raise ObjectDoesNotExist('Out of Stock')
        if self.product.available_stock < self.quantity:
            raise ValidationError('Out of Stock')

    # def ac


class Cart(models.Model):
    user = models.OneToOneField(Profile, on_delete=models.CASCADE)

    # def checkout(self):
    #     for i in self.cartproduct_set.all():
    #         active = i.is_available_in_stock()
    #         if not active:
    #             raise NotFound(detail='Deal is no longer available')
    #     else:
    #         return True


class Bookmark(models.Model):
    book = models.ManyToManyField(Book)
    user = models.OneToOneField(Profile, on_delete=models.CASCADE)


post_save.connect(auto_cart_create, sender=Profile)
