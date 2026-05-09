from django.contrib import admin

from .models import (
    Profile,
    MaintenanceRequest
)


admin.site.register(Profile)
admin.site.register(MaintenanceRequest)