from django.contrib import admin

# Register your models here.
from django.contrib.auth.models import User

from accounts.models import Profile

admin.site.register(Profile)
# admin.site.unregister(User)