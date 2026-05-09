from rest_framework import serializers
from .models import MaintenanceRequest


class MaintenanceRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = MaintenanceRequest

        fields = '__all__'

        read_only_fields = (
            'created_by',
            'created_at',
            'updated_at',
        )