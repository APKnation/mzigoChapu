from django.contrib import admin
from .models import Cargo, Bid

class CargoAdmin(admin.ModelAdmin):
    list_display = ('owner', 'pickup_location', 'dropoff_location', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('pickup_location', 'dropoff_location', 'description', 'owner__username')
    raw_id_fields = ('owner', 'assigned_driver')
    date_hierarchy = 'created_at'

class BidAdmin(admin.ModelAdmin):
    list_display = ('cargo', 'bidder', 'amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('cargo__pickup_location', 'cargo__dropoff_location', 'bidder__username')
    raw_id_fields = ('cargo', 'bidder')
    date_hierarchy = 'created_at'

admin.site.register(Cargo, CargoAdmin)
admin.site.register(Bid, BidAdmin)