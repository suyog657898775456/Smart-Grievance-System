

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.grievances.models import Grievance


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.grievances.models import Grievance


class OfficerDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        department_name = request.user.department  # already string

        grievances = Grievance.objects.filter(
            department__iexact=department_name
        )

        return Response({
            "total": grievances.count(),
            "pending": grievances.filter(status="pending").count(),
            "in_progress": grievances.filter(status="in_progress").count(),
            "resolved": grievances.filter(status="resolved").count(),
        })
