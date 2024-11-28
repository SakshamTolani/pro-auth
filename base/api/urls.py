from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

# from .views import MyTokenObtainPairView

urlpatterns = [
    path("register/", views.registerUser),
    path("profile/", views.getUserProfile),
    path("change-password/", views.changePassword),
    path("reset-password/", views.resetPassword),
    path("reset-password-confirm/", views.resetConfirmPassword),
    path("validate-reset-roken/", views.validate_reset_token),
    path("token/", views.custom_token_obtain_pair, name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
