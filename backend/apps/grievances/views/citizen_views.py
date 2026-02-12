



from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from apps.grievances.models import Grievance
from apps.grievances.serializers import GrievanceSerializer

# 🔁 AI celery task
from apps.grievances.tasks import run_ai_detection

# 🔔 Notification celery task
from apps.notifications.tasks import create_notification


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
        grievance = serializer.save(
            user=self.request.user,
            department="Pending"
        )

        run_ai_detection.delay(grievance.id)

        create_notification.delay(
            grievance.user.id,
            f"Your grievance #{grievance.id} is submitted and under AI review."
        )
