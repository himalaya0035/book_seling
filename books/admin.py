from django.contrib import admin

from .models import Book, Author, Genre, Deal

admin.site.register((Author))


class GenreAdmin(admin.ModelAdmin):
    search_fields = ['name']

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


class BookAdmin(admin.ModelAdmin):
    exclude = ['created_by']
    list_display = ['__str__', 'rating', 'sold_quantity']
    search_fields = ['name']
    sortable_by = ['price', 'rating', 'released_date', 'sold_quantity']
    list_filter = ['sold_quantity', 'released_date', 'rating']

    def save_model(self, request, obj, form, change):
        obj.created_by = request.user
        super(BookAdmin, self).save_model(request, obj, form, change)


class DealAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'quantity', 'price']
    sortable_by = ['price']
    search_fields = ['product__name']

    class Meta:
        model = Deal


admin.site.register(Genre, GenreAdmin)
admin.site.register(Book, BookAdmin)
admin.site.register(Deal, DealAdmin)
