

from django.contrib.gis.db import models
from django.conf import settings


class Grievance(models.Model):

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    )

    PRIORITY_CHOICES = (
        ("LOW", "Low"),
        ("MEDIUM", "Medium"),
        ("HIGH", "High"),
        ("CRITICAL", "Critical"),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="grievances")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    # ✅ Department starts as Pending
    department = models.CharField(max_length=100,default="Pending" )
    priority = models.CharField( max_length=10,choices=PRIORITY_CHOICES, default="LOW")

    location = models.PointField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    # 🧠 AI fields
    image = models.ImageField(upload_to="grievances/", null=True, blank=True)

    detected_issue = models.CharField(
        max_length=50,
        null=True,
        blank=True
    )

    ai_confidence = models.FloatField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
