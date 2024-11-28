from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status
from django.db.models import Q
from drf_spectacular.utils import extend_schema
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import MyTokenObtainPairSerializer, UserSerializer
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.core.mail import send_mail
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content
from dotenv import load_dotenv
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from datetime import datetime, timedelta
import os

User = get_user_model()
load_dotenv()

@api_view(["POST"])
def custom_token_obtain_pair(request):
    # Extract username and password from the request data
    username = request.data.get("username")
    password = request.data.get("password")
    emailExists = User.objects.filter(email__iexact=username).exists()
    if emailExists:
        user = authenticate(
            request,
            username=User.objects.get(email__iexact=username).username,
            password=password,
        )
    else:
        user = authenticate(request, username=username, password=password)

    if user is not None:  # If authentication is successful
        # Use the custom serializer to add claims
        serializer = MyTokenObtainPairSerializer()
        refresh = RefreshToken.for_user(user)

        # Add custom claims to the token
        refresh["username"] = user.username
        refresh["firstname"] = user.first_name

        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "username": user.username,
                "firstname": user.first_name,
            }
        )
    else:
        message = {"detail": "Invalid username or password."}
        return Response(
            message,
            status=status.HTTP_401_UNAUTHORIZED,
        )


@extend_schema(request=UserSerializer)
@api_view(["POST"])
def registerUser(request):
    data = request.data
    usernameExist = User.objects.filter(username__iexact=data["username"]).exists()
    emailExist = User.objects.filter(email__iexact=data["email"]).exists()
    if usernameExist:
        message = {"detail": "User with this username already exists."}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    if emailExist:
        message = {"detail": "User with this email already exists."}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    if data.get("name") is None:
        data["name"] = data["first_name"]
    try:
        user = User.objects.create(
            first_name=data["name"],
            username=data["username"],
            email=data["email"],
            password=make_password(data["password"]),
        )
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        message = {"detail": "Some Eror Occured!"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    if user:
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)
    else:
        message = {"detail": "Due to some changes, please login again!"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(["POST"])
def validate_reset_token(request):
    # Create a serializer with the secret key and salt
    auth_s = URLSafeTimedSerializer(settings.SECRET_KEY, salt='reset-password')
    data = request.data
    token = data['token']
    try:
        # Decode the token
        data = auth_s.loads(token)

        # Extract the expiration timestamp
        expiration_timestamp = data.get("exp")
        if not expiration_timestamp:
            return Response({"valid": False, "message": "Invalid token. Expiration timestamp not found."})

        # Check if the token has expired
        if datetime.now().timestamp() > expiration_timestamp:
            return Response({"valid": False, "message": "Token has expired."})

        # Token is valid
        return Response({"valid": True, "data": data}, status=status.HTTP_200_OK)

    except SignatureExpired:
        return Response({"valid": False, "message": "Token has expired."}, status=status.HTTP_400_BAD_REQUEST)
    except BadSignature:
        return Response({"valid": False, "message": "Invalid token signature."}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"valid": False, "message": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(["POST"])
def resetPassword(request):
    data = request.data
    emailExist = User.objects.filter(email__iexact=data["email"]).exists()
    if emailExist:
        user = User.objects.get(email=data["email"])
        # Create a serializer with a secret key and salt
        auth_s = URLSafeTimedSerializer(settings.SECRET_KEY, salt='reset-password')
        
        # Create token with expiration time (30 minutes)
        token = auth_s.dumps({
            'email': data["email"],
            'name': user.first_name,
            'exp': (datetime.now() + timedelta(minutes=30)).timestamp()
        })

        
        content = (
            "Hi " + user.first_name + "\n\n"
            "You received this email because you have requested to reset the password for your Profile-Auth account.\n"
            "To reset your password, please visit the following link (valid for 30 minutes):\n"
            + settings.FRONTEND_URL
            + "/reset/"
            + token
            +"\n\n"
            "If you didn't request this, you can safely ignore this email.\n\n"
            "Cheers,\nThe Profile-Auth Team"
        )
        from_email = settings.DEFAULT_FROM_EMAIL
        to_emails = [data["email"]]
        subject = "Reset password -" + data["email"]

        expiration_time = datetime.now() + timedelta(minutes=30)
        print("BEFORE EMAIL")
        try:
            message = send_mail(
                subject, content, from_email, to_emails, fail_silently=False
            )
        except Exception as e:
            message = {"detail": "Some Eror Occured!"}
            print(e)
            return Response(message, status=status.HTTP_400_BAD_REQUEST)
        msg = {"detail": "Reset Link has been sent"}
        return Response(msg, status=status.HTTP_200_OK)
    else:
        message = {"detail": "User with this email does not exist."}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PUT"])
def resetConfirmPassword(request):
    data = request.data
    auth_s = URLSafeTimedSerializer(settings.SECRET_KEY, salt='reset-password')
    try:
        # Attempt to decrypt and verify the token
        # The max_age is set to 30 minutes (1800 seconds) to match the email link's expiration
        original_data = auth_s.loads(data['token'], max_age=1800)
        
        # Check if new password is provided
        if not data.get("password"):
            message = {"detail": "Enter New Password"}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)
        
        # Find the user by email
        try:
            user = User.objects.get(email=original_data['email'])
        except User.DoesNotExist:
            message = {"detail": "User not found"}
            return Response(message, status=status.HTTP_404_NOT_FOUND)
        
        # Update password
        user.password = make_password(data["password"])
        user.save()
        
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except SignatureExpired:
        # Token has expired
        message = {"detail": "Password reset link has expired. Please request a new link."}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    
    except BadSignature:
        # Token is invalid
        message = {"detail": "Invalid password reset link"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        # Catch any other unexpected errors
        message = {"detail": "An error occurred during password reset"}
        return Response(message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def changePassword(request):
    user = request.user
    data = request.data
    serializer = UserSerializer(user, many=False)
    if data["old_password"] == "":
        message = {"detail": "Enter Old Password"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    if data["old_password"] != "" and data["new_password"]:
        if not check_password(data["old_password"], user.password):
            return Response(
                {"detail": "Old password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.password = make_password(data["new_password"])
        user.save()

    return Response(serializer.data, status=status.HTTP_200_OK)
