from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from django.utils.timezone import now
from datetime import timedelta

from apps.grievances.models import Grievance


class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        grievances = Grievance.objects.all()
        last_30_days = now() - timedelta(days=30)

        department_stats = grievances.values(
            "department"
        ).annotate(count=Count("id"))

        return Response({
            "total": grievances.count(),
            "pending": grievances.filter(status="pending").count(),
            "in_progress": grievances.filter(status="in_progress").count(),
            "resolved": grievances.filter(status="resolved").count(),
            "department_stats": department_stats,
            "last_30_days_count": grievances.filter(
                created_at__gte=last_30_days
            ).count(),
        })
