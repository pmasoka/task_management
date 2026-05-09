from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views
from .views import MaintenanceRequestViewSet


router = DefaultRouter()

router.register(
    'requests',
    MaintenanceRequestViewSet,
    basename='requests'
)

urlpatterns = [
    path('login/', views.login_view, name='api-login'),
    path('logout/', views.logout_view, name='api-logout'),
    path('session/', views.session_view, name='api-session'),
    path('isauth/', views.isauth_view, name='api-isauth'),

    # DRF Routes
    path('', include(router.urls)),
]