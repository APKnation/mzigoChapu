from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator

# Custom user model with phone number authentication for Tanzanian users
class User(AbstractUser):
    USER_ROLES = [
        ('cargo_owner', 'Cargo Owner / Farmer'),
        ('truck_owner', 'Truck Owner / Driver'),
    ]
    
    # Tanzanian phone number validator
    phone_regex = RegexValidator(
        regex=r'^(\+255|0)[67]\d{8}$',
        message="Phone number must be in Tanzanian format: '0712345678' or '+255712345678'"
    )
    phone_number = models.CharField(validators=[phone_regex], max_length=15, unique=True)
    user_role = models.CharField(max_length=20, choices=USER_ROLES, default='cargo_owner')
    
    def __str__(self):
        return f"{self.username} ({self.phone_number})"