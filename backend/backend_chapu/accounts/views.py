from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

# Register new user with phone number
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    phone_number = request.data.get('phone_number')
    password = request.data.get('password')
    user_role = request.data.get('user_role', 'cargo_owner')
    
    # Validate required fields
    if not all([username, phone_number, password]):
        return Response(
            {'error': 'Please fill all required fields'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if phone number already exists
    if User.objects.filter(phone_number=phone_number).exists():
        return Response(
            {'error': 'This phone number is already registered'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create new user
    try:
        user = User.objects.create_user(
            username=username,
            phone_number=phone_number,
            password=password,
            user_role=user_role
        )
        
        # Generate tokens for auto-login after registration
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user_role': user.user_role,
            'message': 'User created successfully'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )