from rest_framework import serializers
from .models import Cargo

class CargoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cargo
        fields = ['id', 'pickup_location', 'dropoff_location', 'weight_kg', 'description', 'created_at', 'status', 'owner']
        read_only_fields = ['id', 'created_at', 'status', 'owner']
