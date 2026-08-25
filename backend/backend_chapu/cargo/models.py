from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator

# Main Cargo/Load model for freight listings
class Cargo(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Bids'),
        ('assigned', 'Assigned to Driver'),
        ('in_transit', 'In Transit'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    # Cargo owner who created the listing
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cargo_listings')
    # Assigned truck driver (once a bid is accepted)
    assigned_driver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_cargo')
    
    # Cargo details from frontend
    pickup_location = models.CharField(max_length=255, default='Unknown')
    dropoff_location = models.CharField(max_length=255, default='Unknown')
    weight_kg = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.1)], default=1.0)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Load from {self.pickup_location} to {self.dropoff_location}"

# Bid model for truck owners to place bids on cargo listings
class Bid(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    
    cargo = models.ForeignKey(Cargo, on_delete=models.CASCADE, related_name='bids')
    bidder = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='placed_bids')
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(10000)])  # Bid amount in TZS
    message = models.TextField(blank=True, null=True)  # Optional message to cargo owner
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['cargo', 'bidder']  # One bid per user per cargo
    
    def __str__(self):
        return f"Bid of {self.amount} TZS on [{self.cargo.pickup_location} → {self.cargo.dropoff_location}] by {self.bidder.username}"

# Truck model for truck owners to list their available vehicles
class Truck(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trucks')
    vehicle_type = models.CharField(max_length=100, default='Standard Truck')
    capacity_kg = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.1)])
    current_location = models.CharField(max_length=255, default='Unknown')
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.vehicle_type} ({self.capacity_kg}kg) - {self.owner.username}"