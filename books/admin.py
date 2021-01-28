from django.contrib import admin

from .models import Book, Author, Genre, Deal

admin.site.register((Author, Deal))


class GenreAdmin(admin.ModelAdmin):

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


class BookAdmin(admin.ModelAdmin):
    exclude = ['created_by']

    def save_model(self, request, obj, form, change):
        obj.created_by = request.user
        super(BookAdmin, self).save_model(request, obj, form, change)


admin.site.register(Genre, GenreAdmin)
admin.site.register(Book, BookAdmin)
