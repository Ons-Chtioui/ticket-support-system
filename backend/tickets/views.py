from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend

from .models import Ticket
from .serializers import TicketSerializer, TicketStatusUpdateSerializer
from .permissions import IsOwnerOrAdmin
from .pagination import StandardResultsSetPagination

class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    pagination_class = StandardResultsSetPagination
    parser_classes = (MultiPartParser, FormParser, JSONParser)  # <-- Ajout de JSONParser
    
    # Filtres et recherche
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['category', 'status']
    search_fields = ['title', 'createdBy__username']
    ordering_fields = ['createdAt', 'status']
    ordering = ['-createdAt']

    def get_queryset(self):
        user = self.request.user
        is_admin = user.is_staff or getattr(user, 'role', '') == 'Admin'
        if is_admin:
            return Ticket.objects.all()
        return Ticket.objects.filter(createdBy=user)

    def create(self, request, *args, **kwargs):
        user = request.user
        is_admin = user.is_staff or getattr(user, 'role', '') == 'Admin'
        if is_admin:
            return Response(
                {"detail": "Les administrateurs ne peuvent pas créer de tickets."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(createdBy=self.request.user)

    @action(detail=True, methods=['patch'], url_path='status')
    def update_status(self, request, pk=None):
        ticket = self.get_object()
        is_admin = request.user.is_staff or getattr(request.user, 'role', '') == 'Admin'

        if not is_admin:
            return Response(
                {"detail": "Action non autorisée. Droits Admin requis."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = TicketStatusUpdateSerializer(ticket, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
