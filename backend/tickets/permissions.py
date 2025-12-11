# tickets/permissions.py
from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permission personnalisée :
    - L'Admin peut tout voir.
    - L'User ne peut voir que ses propres objets.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'Admin':
            return True
        return obj.createdBy == request.user