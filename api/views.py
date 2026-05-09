from django.shortcuts import render
import json

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import MaintenanceRequest
from .serializers import MaintenanceRequestSerializer
from .permissions import CanViewMaintenanceRequest


@require_POST
def login_view(request):

    data = json.loads(request.body)

    username = data.get("username")
    password = data.get("password")

    if username is None or password is None:
        return JsonResponse({
            "detail": "Please provide username and password"
        })

    user = authenticate(
        username=username,
        password=password
    )

    if user is None:
        return JsonResponse({
            "detail": "Invalid credentials"
        }, status=400)

    login(request, user)

    return JsonResponse({
        "detail": "Successfully logged in!"
    })


def logout_view(request):

    if not request.user.is_authenticated:
        return JsonResponse({
            "detail": "You are not logged in!"
        }, status=400)

    logout(request)

    return JsonResponse({
        "detail": "Successfully logged out!"
    })


@ensure_csrf_cookie
def session_view(request):

    if not request.user.is_authenticated:
        return JsonResponse({
            "isAuthenticated": False
        })

    return JsonResponse({
        "isAuthenticated": True
    })


def isauth_view(request):

    if not request.user.is_authenticated:
        return JsonResponse({
            "isAuthenticated": False
        })

    return JsonResponse({
        "isAuthenticated": True,
        "username": request.user.username,
        "role": request.user.profile.role
    })


class MaintenanceRequestViewSet(viewsets.ModelViewSet):

    serializer_class = MaintenanceRequestSerializer

    permission_classes = [
        IsAuthenticated,
        CanViewMaintenanceRequest
    ]

    def get_queryset(self):

        user = self.request.user
        role = user.profile.role

        # Manager sees all requests
        if role == 'manager':
            return MaintenanceRequest.objects.all()

        # Resident sees own requests
        if role == 'resident':
            return MaintenanceRequest.objects.filter(
                created_by=user
            )

        # Staff sees assigned requests
        if role == 'staff':
            return MaintenanceRequest.objects.filter(
                assigned_to=user
            )

        return MaintenanceRequest.objects.none()

    def perform_create(self, serializer):

        serializer.save(
            created_by=self.request.user
        )