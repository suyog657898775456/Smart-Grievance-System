
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import ValidationError

from apps.grievances.models import Grievance
from apps.grievances.serializers import GrievanceSerializer

# 🔁 AI celery task
from apps.grievances.tasks import run_ai_detection

# 🔔 Notification celery task
from apps.notifications.tasks import create_notification

# 🔍 Duplicate detection utils
from apps.grievances.utils import (
    calculate_text_similarity,
    get_image_hash
)


class GrievanceViewSet(ModelViewSet):
    """
    Citizen:
    - Create grievance
    - View own grievances
    """

    serializer_class = GrievanceSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return Grievance.objects.filter(user=self.request.user)

    def perform_create(self, serializer):

        new_title = self.request.data.get("title", "")
        new_description = self.request.data.get("description", "")
        new_image = self.request.FILES.get("image")

        existing_grievances = Grievance.objects.all()

        for grievance in existing_grievances:

            # 🔹 TEXT SIMILARITY CHECK
            similarity_score = calculate_text_similarity(
                new_title + new_description,
                grievance.title + grievance.description
            )

            if similarity_score > 0.75:
                raise ValidationError({
                    "detail": "Similar complaint already exists (text similarity detected)."
                })

            # 🔹 IMAGE SIMILARITY CHECK
            if new_image and grievance.image:
                new_hash = get_image_hash(new_image)
                old_hash = get_image_hash(grievance.image)

                if new_hash == old_hash:
                    raise ValidationError({
                        "detail": "Similar complaint already exists (image match detected)."
                    })

        # ✅ Save grievance if no duplicate found
        grievance = serializer.save(
            user=self.request.user,
            department="Pending"
        )

        # 🔁 Run AI detection async
        run_ai_detection.delay(grievance.id)

        # 🔔 Notify citizen
        create_notification.delay(
            grievance.user.id,
            f"Your grievance #{grievance.id} is submitted and under AI review."
        )
