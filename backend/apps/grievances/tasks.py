





from celery import shared_task
from apps.grievances.models import Grievance
from apps.departments.models import Department
from common.utils import detect_department, detect_priority


@shared_task
def run_ai_detection(grievance_id):

    # 🔥 Lazy import (prevents circular import)
    from apps.grievances.ai.predictor import predict_image

    grievance = Grievance.objects.get(id=grievance_id)

    combined_text = f"{grievance.title} {grievance.description}"

    # 🔹 TEXT detection
    text_dept = detect_department(combined_text)
    priority = detect_priority(combined_text)

    image_dept = None
    confidence = 0.0

    # 🔹 IMAGE detection
    if grievance.image:
        image_dept, confidence = predict_image(grievance.image.path)

    # 🔥 Hybrid decision logic
    if image_dept and confidence > 0.75:
        final_dept_name = image_dept.strip().capitalize()
    else:
        final_dept_name = text_dept.strip().capitalize()

    print("FINAL_DEPT_NAME:", final_dept_name)

    # 🔹 Match with Department table
    department_obj = Department.objects.filter(
        name__iexact=final_dept_name
    ).first()

    print("DEPARTMENT FOUND:", department_obj)

    # ✅ Replace "Pending" with real department
    if department_obj:
        grievance.department = department_obj.name
    else:
        grievance.department = "General"

    # ✅ Store AI metadata
    grievance.detected_issue = image_dept
    grievance.ai_confidence = confidence

    grievance.priority = priority
    grievance.save()

    print(f"✅ AI Processing Completed for Grievance #{grievance.id}")
