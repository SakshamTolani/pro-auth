from django.db import models
from django.contrib.auth.models import User,AbstractUser
import django.utils.timezone as date
# Create your models here.

class CustomUser(AbstractUser):
    updated_at = models.DateTimeField(auto_now=True)  # Automatically updates on save

    def __str__(self):
        return self.username
    
