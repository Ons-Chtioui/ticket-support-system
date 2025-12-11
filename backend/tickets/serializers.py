# tickets/serializers.py
from rest_framework import serializers
from .models import Ticket
class TicketSerializer(serializers.ModelSerializer):
    createdBy_username = serializers.ReadOnlyField(source='createdBy.username')
    attachment_url = serializers.SerializerMethodField()
    
    attachment = serializers.FileField(write_only=True, required=False)  # <-- AJOUTÉ

    class Meta:
        model = Ticket
        fields = ['id', 'title', 'description', 'category', 'status', 'attachment', 'attachment_url', 'createdBy_username', 'createdAt']
        read_only_fields = ['status', 'createdBy_username', 'createdAt']

    def get_attachment_url(self, obj):
        if obj.attachment:
            return obj.attachment.url
        return None
class TicketStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['status']