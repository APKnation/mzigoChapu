from rest_framework import serializers
from .models import Cargo, Truck

class CargoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cargo
        fields = ['id', 'pickup_location', 'dropoff_location', 'weight_kg', 'description', 'created_at', 'status', 'owner']
        read_only_fields = ['owner', 'status']

class TruckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Truck
        fields = ['id', 'owner', 'vehicle_type', 'capacity_kg', 'current_location', 'is_available', 'created_at']
        read_only_fields = ['owner']
