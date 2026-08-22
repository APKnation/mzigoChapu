from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'phone_number', 'user_role', 'is_staff')
    list_filter = ('user_role', 'is_staff', 'is_superuser', 'is_active')
    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {'fields': ('phone_number', 'user_role')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        (None, {'fields': ('phone_number', 'user_role')}),
    )
    search_fields = ('username', 'email', 'phone_number')

admin.site.register(User, UserAdmin)