from rest_framework.permissions import BasePermission


class IsManager(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated and
            request.user.profile.role == 'manager'
        )


class IsStaff(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated and
            request.user.profile.role == 'staff'
        )


class IsResident(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated and
            request.user.profile.role == 'resident'
        )


class CanCreateMaintenanceRequest(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated and
            request.user.profile.role == 'resident'
        )


class CanAssignMaintenanceRequest(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated and
            request.user.profile.role == 'manager'
        )


class CanUpdateTaskStatus(BasePermission):

    def has_object_permission(self, request, view, obj):

        # Managers can update anything
        if request.user.profile.role == 'manager':
            return True

        # Staff can only update tasks assigned to them
        if (
            request.user.profile.role == 'staff' and
            obj.assigned_to == request.user
        ):
            return True

        return False


class CanViewMaintenanceRequest(BasePermission):

    def has_object_permission(self, request, view, obj):

        # Managers can view all requests
        if request.user.profile.role == 'manager':
            return True

        # Residents can only view their own requests
        if (
            request.user.profile.role == 'resident' and
            obj.created_by == request.user
        ):
            return True

        # Staff can only view assigned requests
        if (
            request.user.profile.role == 'staff' and
            obj.assigned_to == request.user
        ):
            return True

        return False