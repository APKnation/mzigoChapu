from django.contrib import admin
from .models import Cargo, Bid

class CargoAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'origin', 'destination', 'status', 'created_at')
    list_filter = ('status', 'origin', 'destination', 'created_at')
    search_fields = ('title', 'description', 'owner__username')
    raw_id_fields = ('owner', 'assigned_driver')
    date_hierarchy = 'created_at'

class BidAdmin(admin.ModelAdmin):
    list_display = ('cargo', 'bidder', 'amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('cargo__title', 'bidder__username')
    raw_id_fields = ('cargo', 'bidder')
    date_hierarchy = 'created_at'

admin.site.register(Cargo, CargoAdmin)
admin.site.register(Bid, BidAdmin)