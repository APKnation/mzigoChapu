from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Cargo
from .serializers import CargoSerializer

class CargoViewSet(viewsets.ModelViewSet):
    queryset = Cargo.objects.all().order_by('-created_at')
    serializer_class = CargoSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
