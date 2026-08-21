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
    
    TANZANIAN_REGIONS = [
        ('dar_es_salaam', 'Dar es Salaam'),
        ('mwanza', 'Mwanza'),
        ('arusha', 'Arusha'),
        ('dodoma', 'Dodoma'),
        ('mbeya', 'Mbeya'),
        ('tanga', 'Tanga'),
        ('zanzibar', 'Zanzibar'),
        ('moshi', 'Moshi'),
        ('irelia', 'Irelia'),
        ('mbay', 'Mbeya'),
        ('kigoma', 'Kigoma'),
        ('shinyanga', 'Shinyanga'),
        # Add more as needed
    ]
    
    # Cargo owner who created the listing
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cargo_listings')
    # Assigned truck driver (once a bid is accepted)
    assigned_driver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_cargo')
    
    # Cargo details
    title = models.CharField(max_length=100)
    description = models.TextField()
    weight = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.1)])  # In tons
    origin = models.CharField(max_length=50, choices=TANZANIAN_REGIONS)
    destination = models.CharField(max_length=50, choices=TANZANIAN_REGIONS)
    pickup_date = models.DateField()
    delivery_deadline = models.DateField()
    budget = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(10000)])  # In TZS
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} from {self.origin} to {self.destination}"

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
        return f"Bid of {self.amount} TZS on {self.cargo.title} by {self.bidder.username}"