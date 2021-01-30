from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.signals import post_save, post_delete
from .tasks import send_email_to_user


def auto_prof_create(sender, instance: User, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

        subject = "ThankYou Registering"

        print(instance.email)
        body = f"Hey {instance.first_name} Welcome to BookStore. "

        send_email_to_user.delay([instance.email], subject, body)


def auto_user_delete(sender, instance, *args, **kwargs):
    instance.user.delete()


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.TextField()
    contact_number = models.CharField(max_length=13)

    firm_name = models.CharField(max_length=150, null=True, blank=True)
    bank_account_no = models.PositiveBigIntegerField(null=True, blank=True)
    pan_number = models.PositiveBigIntegerField(null=True, blank=True)
    IFSC = models.CharField(max_length=11, null=True, blank=True)

    is_seller = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)

    def __str__(self):
        return self.user.username

    def clean(self):
        if self.is_seller:
            if self.firm_name is None or self.bank_account_no is None or self.pan_number is None or self.IFSC is None:
                print(vars(self))
                raise ValidationError('firm name / account number / pan number / bank IFSC not found')

    def save(self, *args, **kwargs):

        if self.is_seller:
            if self.firm_name is None or self.bank_account_no is None or self.pan_number is None or self.IFSC is None:
                raise ValidationError('firm name / account number / pan number / bank IFSC not found')

        super(Profile, self).save(*args, **kwargs)


class ProfileProxy(Profile):
    class Meta:
        proxy = True
        verbose_name = 'Pending Validation'


post_save.connect(auto_prof_create, sender=User)
post_delete.connect(auto_user_delete, sender=Profile)


"""

{'user': {'username': 'priyansh2001', 'first_name': 'Priyansh', 'last_name': 'Singh', 'password': 'Fiitjee13', 'fav_genres': ['Business', 'Crime Thriller', 'History', 'Pyschology', 'Self Help']}, 'address': '113 North City Pilibhit Road Bareilly', 'contact_number': '7618166335'}

{'user': {'username': 'priyansh2001', 'first_name': 'Priyansh', 'last_name': 'Singh', 'password': 'Fiitjee13', 'fav_genres': ['Cooking', 'Historical Fiction', 'Physics']}, 'address': '113 North City Pilibhit Road Bareilly', 'contact_number': '7618166335'}

"""