from rest_framework import serializers
from .models import Cargo, Truck, Booking


class CargoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cargo
        fields = ['id', 'pickup_location', 'dropoff_location', 'weight_kg', 'description', 'created_at', 'status', 'owner']
        read_only_fields = ['owner', 'status']


class TruckSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = Truck
        fields = ['id', 'owner', 'owner_name', 'vehicle_type', 'capacity_kg', 'current_location', 'is_available', 'created_at']
        read_only_fields = ['owner']


class BookingSerializer(serializers.ModelSerializer):
    truck_owner_name = serializers.CharField(source='truck.owner.username', read_only=True)
    truck_type = serializers.CharField(source='truck.vehicle_type', read_only=True)
    truck_capacity = serializers.DecimalField(source='truck.capacity_kg', max_digits=10, decimal_places=2, read_only=True)
    truck_location = serializers.CharField(source='truck.current_location', read_only=True)
    cargo_owner_name = serializers.CharField(source='cargo_owner.username', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'cargo_owner', 'cargo_owner_name', 'truck', 'truck_owner_name',
            'truck_type', 'truck_capacity', 'truck_location',
            'cargo', 'pickup_location', 'dropoff_location', 'weight_kg',
            'cargo_description', 'notes', 'status', 'price',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['cargo_owner', 'status', 'created_at', 'updated_at']


class BookingCreateSerializer(serializers.ModelSerializer):
    """Simplified serializer for creating a booking from the frontend."""
    truck_owner_name = serializers.CharField(source='truck.owner.username', read_only=True)
    truck_type = serializers.CharField(source='truck.vehicle_type', read_only=True)
    truck_capacity = serializers.DecimalField(source='truck.capacity_kg', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'truck', 'truck_owner_name', 'truck_type', 'truck_capacity',
            'pickup_location', 'dropoff_location', 'weight_kg',
            'cargo_description', 'notes', 'status', 'price',
            'created_at'
        ]
        read_only_fields = ['cargo_owner', 'status', 'created_at']
