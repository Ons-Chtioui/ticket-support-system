# tickets/admin.py
from django.contrib import admin
from .models import Ticket

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'createdBy', 'createdAt')
    list_filter = ('status', 'category')
    search_fields = ('title', 'description')