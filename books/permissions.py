from rest_framework.permissions import BasePermission


class UpdateDeleteObjectPermission(BasePermission):

    def has_object_permission(self, request, view, obj):

        if request.method == 'GET':
            return True

        if request.user.is_authenticated:
            if obj.created_by == request.user:
                return True
        return False


# class CreateObjectPermission(BasePermission):
#
#     def has_permission(self, request, view):
#
#         if request.method == 'GET':
#             # print('get')
#             return True
#
#         if request.user.is_authenticated:
#             return True
#         return False
