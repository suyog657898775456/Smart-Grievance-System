from rest_framework import serializers
from django.contrib.gis.geos import Point
from apps.grievances.models import Grievance
import requests # पत्त्यासाठी याची गरज लागू शकते

# ======================================================
# 📝 Main Grievance Serializer (With Address Logic)
# ======================================================

class GrievanceSerializer(serializers.ModelSerializer):
    latitude = serializers.FloatField(source="location.y", read_only=True)
    longitude = serializers.FloatField(source="location.x", read_only=True)
    citizen_name = serializers.SerializerMethodField()
    # 📍 पत्ता दाखवण्यासाठी नवीन फील्ड
    formatted_address = serializers.SerializerMethodField()

    class Meta:
        model = Grievance
        fields = [
            "id", "title", "description", "image", 
            "department", "priority", "latitude", "longitude", 
            "status", "created_at", "citizen_name", "formatted_address"
        ]
        read_only_fields = ["department", "priority", "status", "created_at"]
        

    def get_citizen_name(self, obj):
        # युजरचे नाव मिळवणे
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username

    def get_formatted_address(self, obj):
        # ही पद्धत Latitude/Longitude वरून पत्ता तयार करेल (Front-end ला Google link पाठवेल)
        return f"https://www.google.com/maps?q=${obj.location.y},{obj.location.x}"

    def create(self, validated_data):
        # तक्रार तयार करताना Latitude/Longitude मधून Point तयार करणे
        request = self.context.get("request")
        lat = request.data.get("latitude")
        lon = request.data.get("longitude")
        if lat and lon:
            validated_data["location"] = Point(float(lon), float(lat))
        return Grievance.objects.create(**validated_data)


# ======================================================
# 🔄 Status Update Serializer (Security & In-Progress Fix)
# ======================================================

class GrievanceStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grievance
        fields = ["status"]

    def validate(self, data):
        # ✅ १. Resolved तक्रार पुन्हा अपडेट होऊ नये
        if self.instance.status == 'resolved':
            raise serializers.ValidationError("ही तक्रार आधीच Resolved झाली आहे, स्टेटस बदलता येणार नाही.")
        
        # ✅ २. Frontend कडून आलेला 'In Progress' बरोबर मॅप करणे
        status = data.get('status', '').lower()
        if status == 'in progress':
            data['status'] = 'in_progress'
            
        return data