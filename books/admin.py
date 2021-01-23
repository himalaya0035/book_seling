from django.contrib import admin

from .models import Book, Author, Genre, Deal

admin.site.register((Book, Author, Deal))


class GenreAdmin(admin.ModelAdmin):

    def has_add_permission(self, request):
        return False


class GenreAdmin2(admin.ModelAdmin):

    def has_add_permission(self, request):
        return True


admin.site.register(Genre, GenreAdmin)
# admin.site.register(Genre, GenreAdmin2)
