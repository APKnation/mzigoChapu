from rest_framework import viewsets, permissions, generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Cargo, Truck, Booking
from .serializers import (
    CargoSerializer, TruckSerializer, BookingSerializer, BookingCreateSerializer
)


class CargoViewSet(viewsets.ModelViewSet):
    queryset = Cargo.objects.all().order_by('-created_at')
    serializer_class = CargoSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PublicCargoListView(generics.ListAPIView):
    queryset = Cargo.objects.filter(status='pending').order_by('-created_at')
    serializer_class = CargoSerializer
    permission_classes = [permissions.AllowAny]


class PublicTruckListView(generics.ListAPIView):
    queryset = Truck.objects.filter(is_available=True).order_by('-created_at')
    serializer_class = TruckSerializer
    permission_classes = [permissions.AllowAny]


class BookingViewSet(viewsets.ModelViewSet):
    """Manage bookings — cargo owners book trucks."""
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role = getattr(user, 'role', None)
        if role == 'truck_owner':
            # Truck owners see bookings made on their trucks
            return Booking.objects.filter(truck__owner=user).order_by('-created_at')
        else:
            # Cargo owners see their own bookings
            return Booking.objects.filter(cargo_owner=user).order_by('-created_at')

    def get_serializer_class(self):
        if self.action == 'create':
            return BookingCreateSerializer
        return BookingSerializer

    def perform_create(self, serializer):
        booking = serializer.save(cargo_owner=self.request.user)
        # Mark truck as unavailable once booked
        truck = booking.truck
        truck.is_available = False
        truck.save()

    def destroy(self, request, *args, **kwargs):
        """Cancel a booking and make the truck available again."""
        booking = self.get_object()
        if booking.status not in ('cancelled', 'completed'):
            booking.status = 'cancelled'
            booking.save()
            truck = booking.truck
            truck.is_available = True
            truck.save()
        return Response({'status': 'booking cancelled'}, status=status.HTTP_200_OK)
