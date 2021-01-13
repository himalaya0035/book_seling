from django.contrib import admin

from .models import Book, Author, Genre, Entity

# Register your models here.
admin.site.register((Book, Author, Entity))


class GenreAdmin(admin.ModelAdmin):

    def has_add_permission(self, request):
        return False


admin.site.register(Genre, GenreAdmin)
