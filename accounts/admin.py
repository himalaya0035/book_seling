from django.contrib import admin

from accounts.models import Profile, ProfileProxy


class PendingValidationAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        qs = Profile.objects.filter(is_verified=False, is_seller=True)
        return qs


admin.site.register(Profile)
admin.site.register(ProfileProxy, PendingValidationAdmin)
