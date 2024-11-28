from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        User = get_user_model()
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'date_joined', 'updated_at']

    def get__id(self, obj):
        return obj.id

    def get_isAdmin(self, obj):
        return obj.is_staff
    def get_username(self, obj):
        return obj.username

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email

        return name
    

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["username"] = user.username
        token["firstname"] = user.first_name

        return token

