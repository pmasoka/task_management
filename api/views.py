from django.contrib.auth import authenticate, login, logout

from rest_framework import status, viewsets

from rest_framework.decorators import action, api_view

from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response

from django.http import JsonResponse

from django.views.decorators.csrf import ensure_csrf_cookie

from .models import MaintenanceRequest

from .permissions import (
    CanViewMaintenanceRequest,
    CanAssignMaintenanceRequest,
    CanUpdateTaskStatus,
)

from .serializers import (
    MaintenanceRequestSerializer,
    AssignmentSerializer,
    StatusUpdateSerializer,
)


# =========================
# CSRF TOKEN VIEW
# =========================

@ensure_csrf_cookie
def get_csrf_token(request):

    return JsonResponse({
        'detail': 'CSRF cookie set'
    })


# =========================
# LOGIN
# =========================

@api_view(['POST'])
def login_view(request):

    username = request.data.get('username')

    password = request.data.get('password')

    user = authenticate(
        request,
        username=username,
        password=password
    )

    if user is not None:

        login(request, user)

        return Response({

            'success': True,

            'username': user.username,

            'role': user.profile.role,
        })

    return Response(
        {

            'success': False,

            'detail': 'Invalid username or password'
        },

        status=status.HTTP_400_BAD_REQUEST
    )


# =========================
# LOGOUT
# =========================

@api_view(['POST'])
def logout_view(request):

    logout(request)

    return Response({
        'success': True
    })


# =========================
# SESSION CHECK
# =========================

@api_view(['GET'])
def session_view(request):

    if request.user.is_authenticated:

        return Response({

            'isAuthenticated': True,

            'username': request.user.username,

            'role': request.user.profile.role
        })

    return Response({
        'isAuthenticated': False
    })


# =========================
# AUTH CHECK
# =========================

@api_view(['GET'])
def isauth_view(request):

    return Response({
        'authenticated': request.user.is_authenticated
    })


# =========================
# MAINTENANCE REQUEST VIEWSET
# =========================

class MaintenanceRequestViewSet(viewsets.ModelViewSet):

    serializer_class = MaintenanceRequestSerializer

    def get_permissions(self):

        if self.action == 'assign':

            permission_classes = [
                IsAuthenticated,
                CanAssignMaintenanceRequest
            ]

        elif self.action == 'update_status':

            permission_classes = [
                IsAuthenticated,
                CanUpdateTaskStatus
            ]

        else:

            permission_classes = [
                IsAuthenticated,
                CanViewMaintenanceRequest
            ]

        return [
            permission()
            for permission in permission_classes
        ]

    def get_queryset(self):

        user = self.request.user

        role = user.profile.role

        if role == 'manager':

            return MaintenanceRequest.objects.all()

        elif role == 'resident':

            return MaintenanceRequest.objects.filter(
                created_by=user
            )

        elif role == 'staff':

            return MaintenanceRequest.objects.filter(
                assigned_to=user
            )

        return MaintenanceRequest.objects.none()

    def get_serializer_class(self):

        if self.action == 'assign':

            return AssignmentSerializer

        elif self.action == 'update_status':

            return StatusUpdateSerializer

        return MaintenanceRequestSerializer

    def perform_create(self, serializer):

        serializer.save(
            created_by=self.request.user
        )

    @action(
        detail=True,
        methods=['patch'],
        url_path='assign',
        permission_classes=[
            IsAuthenticated,
            CanAssignMaintenanceRequest
        ]
    )
    def assign(self, request, pk=None):

        maintenance_request = self.get_object()

        if maintenance_request.status == 'completed':

            return Response(
                {
                    'detail': 'Completed tasks cannot be reassigned.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = AssignmentSerializer(
            maintenance_request,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)

        assigned_user = serializer.validated_data[
            'assigned_to'
        ]

        maintenance_request.assigned_to = assigned_user

        if maintenance_request.status == 'pending':

            maintenance_request.status = 'in_progress'

        maintenance_request.save()

        return Response(
            MaintenanceRequestSerializer(
                maintenance_request
            ).data
        )

    @action(
        detail=True,
        methods=['patch'],
        url_path='update-status',
        permission_classes=[
            IsAuthenticated,
            CanUpdateTaskStatus
        ]
    )
    def update_status(self, request, pk=None):

        maintenance_request = self.get_object()

        role = request.user.profile.role

        if role == 'staff':

            if maintenance_request.assigned_to != request.user:

                return Response(
                    {
                        'detail': 'You can only update assigned tasks.'
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

        elif role == 'resident':

            return Response(
                {
                    'detail': 'Residents cannot update statuses.'
                },
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = StatusUpdateSerializer(
            maintenance_request,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(serializer.data)