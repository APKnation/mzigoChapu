from rest_framework import viewsets, permissions, generics
from rest_framework.permissions import IsAuthenticated
from .models import Cargo, Truck
from .serializers import CargoSerializer, TruckSerializer

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
