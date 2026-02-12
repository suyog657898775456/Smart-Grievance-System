from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from apps.grievances.models import Grievance


class Feedback(models.Model):
    grievance = models.OneToOneField(
        Grievance,
        on_delete=models.CASCADE,
        related_name="feedback",
        blank=True,
        null=True
    )

    rating = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )

    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for {self.grievance.id}"
