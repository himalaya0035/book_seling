from django.contrib.auth.models import User
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
    # contact_number = models.

    def __str__(self):
        return self.user.username


post_save.connect(auto_prof_create, sender=User)
post_delete.connect(auto_user_delete, sender=Profile)
# p1 = Profile.user.get_favourite
"""
contact

"""