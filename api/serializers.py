from rest_framework import serializers
from django.contrib.auth.models import User

from .models import MaintenanceRequest


# =========================
# MAIN REQUEST SERIALIZER
# =========================

class MaintenanceRequestSerializer(serializers.ModelSerializer):

    created_by = serializers.ReadOnlyField(
        source='created_by.username'
    )

    assigned_to = serializers.ReadOnlyField(
        source='assigned_to.username'
    )

    class Meta:

        model = MaintenanceRequest

        fields = [
            'id',
            'title',
            'description',
            'status',
            'priority',
            'created_by',
            'assigned_to',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'status',
            'assigned_to',
            'created_by',
            'created_at',
            'updated_at',
        ]

    def validate_title(self, value):

        if len(value.strip()) < 3:

            raise serializers.ValidationError(
                "Title must be at least 3 characters long."
            )

        return value

    def validate_description(self, value):

        if len(value.strip()) < 10:

            raise serializers.ValidationError(
                "Description must be at least 10 characters long."
            )

        return value


# =========================
# ASSIGNMENT SERIALIZER
# =========================

class AssignmentSerializer(serializers.ModelSerializer):

    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(
            profile__role='staff'
        )
    )

    class Meta:

        model = MaintenanceRequest

        fields = [
            'assigned_to',
        ]

    def validate_assigned_to(self, user):

        if user.profile.role != 'staff':

            raise serializers.ValidationError(
                "Only staff users can be assigned."
            )

        return user


# =========================
# STATUS UPDATE SERIALIZER
# =========================

class StatusUpdateSerializer(serializers.ModelSerializer):

    class Meta:

        model = MaintenanceRequest

        fields = [
            'status',
        ]

    def validate_status(self, value):

        allowed_statuses = [
            'pending',
            'in_progress',
            'completed'
        ]

        if value not in allowed_statuses:

            raise serializers.ValidationError(
                "Invalid status."
            )

        return value