from django.contrib import admin
from .models import Cargo, Bid, Truck


@admin.register(Cargo)
class CargoAdmin(admin.ModelAdmin):
    list_display = ('id', 'pickup_location', 'dropoff_location', 'weight_kg', 'status', 'owner', 'created_at')
    list_filter = ('status',)
    search_fields = ('pickup_location', 'dropoff_location', 'owner__username')
    list_per_page = 20
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at', 'owner')

    fieldsets = (
        ('Route', {
            'fields': ('pickup_location', 'dropoff_location')
        }),
        ('Cargo Details', {
            'fields': ('weight_kg', 'description', 'status')
        }),
        ('Ownership', {
            'fields': ('owner', 'assigned_driver')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Truck)
class TruckAdmin(admin.ModelAdmin):
    list_display = ('id', 'vehicle_type', 'capacity_kg', 'current_location', 'is_available', 'owner')
    list_filter = ('is_available',)
    search_fields = ('vehicle_type', 'current_location', 'owner__username')
    list_per_page = 20
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at', 'owner')

    fieldsets = (
        ('Vehicle Info', {
            'fields': ('vehicle_type', 'capacity_kg', 'current_location', 'is_available')
        }),
        ('Ownership', {
            'fields': ('owner',)
        }),
    )


@admin.register(Bid)
class BidAdmin(admin.ModelAdmin):
    list_display = ('id', 'cargo', 'bidder', 'amount', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('bidder__username', 'cargo__pickup_location')
    list_per_page = 20
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'bidder', 'cargo')

    fieldsets = (
        ('Bid Info', {
            'fields': ('cargo', 'bidder', 'amount', 'status')
        }),
        ('Message', {
            'fields': ('message',)
        }),
    )