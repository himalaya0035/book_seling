from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.signals import post_save, post_delete


def auto_prof_create(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


def auto_user_delete(sender, instance, *args, **kwargs):
    instance.user.delete()


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.TextField()
    contact_number = models.CharField(max_length=13)

    firm_name = models.CharField(max_length=30, null=True, blank=True)
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
