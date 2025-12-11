# users/serializers.py
from rest_framework import serializers
from .models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        # 1. On RETIRE 'role' de cette liste pour que l'utilisateur ne puisse pas le choisir
        fields = ['username', 'email', 'password'] 

    def create(self, validated_data):
        # 2. On FORCE le rôle à 'User' ici
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role='User'  # <--- C'est ici que la magie opère
        )
        return user