# tickets/models.py
from django.db import models
from django.conf import settings # Pour référencer le modèle User

class Ticket(models.Model):
    # Enums requis [cite: 44, 46]
    CATEGORY_CHOICES = (
        ('Technical', 'Technical'),
        ('Financial', 'Financial'),
        ('Product', 'Product'),
    )
    
    STATUS_CHOICES = (
        ('New', 'New'),
        ('Under Review', 'Under Review'),
        ('Resolved', 'Resolved'),
    )

    title = models.CharField(max_length=200) # [cite: 39]
    description = models.TextField()         # [cite: 41]
    
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES) # [cite: 43]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='New') # [cite: 45]
    
    # Upload via Cloudinary (configuré dans settings.py) [cite: 47, 116]
    attachment = models.FileField(upload_to='attachments/', null=True, blank=True)
    
    # Liens automatiques
    createdBy = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='tickets', on_delete=models.CASCADE) # [cite: 49]
    createdAt = models.DateTimeField(auto_now_add=True) # [cite: 51]

    def __str__(self):
        return f"{self.title} - {self.status}"