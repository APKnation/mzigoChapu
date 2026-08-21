from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import register
from accounts.utils import CustomTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    # Authentication endpoints - match what frontend expects
    path('api/auth/register/', register, name='register'),
    path('api/auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]