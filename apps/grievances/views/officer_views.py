

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from apps.grievances.models import Grievance
from apps.grievances.serializers import (
    GrievanceSerializer,
    GrievanceStatusUpdateSerializer,
)

# 🔔 Notification Celery task
from apps.notifications.tasks import create_notification


class OfficerGrievanceViewSet(ModelViewSet):
    """
    Officer:
    - View grievances of own department
    - Update status of own department grievances
    """

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # 🔐 safety check
        if not user.is_staff or not user.department:
            return Grievance.objects.none()

        # ✅ CORRECT: FK comparison
        # return Grievance.objects.filter(department=user.department)
        return Grievance.objects.filter(department__iexact=user.department)

    def get_serializer_class(self):
        # PATCH / PUT → status update only
        if self.action in ["partial_update", "update"]:
            return GrievanceStatusUpdateSerializer

        # GET → full grievance view
        return GrievanceSerializer

    # 🔥 Runs AFTER officer updates status
    def perform_update(self, serializer):
        grievance = serializer.save()  # ✅ DB updated

        # 🔔 Notify citizen asynchronously
        create_notification.delay(
            grievance.user.id,
            f"Your grievance #{grievance.id} status changed to {grievance.status}"
        )

    def destroy(self, request, *args, **kwargs):
        raise PermissionDenied("Officers cannot delete grievances")
