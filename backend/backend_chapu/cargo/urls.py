from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CargoViewSet, PublicCargoListView, PublicTruckListView, BookingViewSet
)

router = DefaultRouter()
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('public/loads/', PublicCargoListView.as_view(), name='public-loads'),
    path('public/trucks/', PublicTruckListView.as_view(), name='public-trucks'),
    path('', include(router.urls)),
]
