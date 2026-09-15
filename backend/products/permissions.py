from rest_framework.permissions import BasePermission
from rest_framework.permissions import SAFE_METHODS


class ProductPermission(BasePermission):

    def has_permission(self, request, view):

        # User must be authenticated
        if not request.user.is_authenticated:
            return False


        # GET / HEAD / OPTIONS
        # are allowed for authenticated users
        if request.method in SAFE_METHODS:
            return True


        # POST / PUT / PATCH / DELETE
        # only allowed for staff users
        return request.user.is_staff