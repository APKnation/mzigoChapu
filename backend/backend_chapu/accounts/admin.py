from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'phone_number', 'user_role', 'is_active', 'date_joined')
    list_filter = ('user_role', 'is_active')
    search_fields = ('username', 'phone_number')
    ordering = ('-date_joined',)
    list_per_page = 20

    fieldsets = (
        ('Account', {
            'fields': ('username', 'password')
        }),
        ('Contact', {
            'fields': ('phone_number',)
        }),
        ('Role', {
            'fields': ('user_role',)
        }),
        ('Status', {
            'fields': ('is_active', 'is_staff', 'is_superuser')
        }),
    )

    add_fieldsets = (
        ('New User', {
            'classes': ('wide',),
            'fields': ('username', 'phone_number', 'user_role', 'password1', 'password2'),
        }),
    )