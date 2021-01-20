from django.contrib import admin

from .models import Book, Author, Genre, Deal

admin.site.register((Book, Author, Deal))


class GenreAdmin(admin.ModelAdmin):

    def has_add_permission(self, request):
        return False


admin.site.register(Genre, GenreAdmin)
