from rest_framework import serializers
from .models import *

class PurposeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purpose
        fields = ["id", "purpose_name", "description"]


class ComplaintTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintType
        fields = ["id", "complaint_type","description"]


class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = ["id", "source_name","description"]



class VisitorSerializer(serializers.ModelSerializer):
    purpose_name = serializers.CharField(source="purpose.purpose_name", read_only=True)

    class Meta:
        model = Visitor
        fields = [
            "id",
            "name",
            "purpose",
            "purpose_name",
            "phone",
            "id_card",
            "visit_to",
            "opd_ipd_staff",
            "number_of_person",
            "date",
            "in_time",
            "out_time",
            "note",
        ]



class ComplainSerializer(serializers.ModelSerializer):
    complain_type_name = serializers.CharField(source="complain_type.complaint_type", read_only=True)
    source_name = serializers.CharField(source="source.source_name", read_only=True)

    class Meta:
        model = Complain
        fields = [
            "id",
            "complain_type",
            "complain_type_name",
            "source",
            "source_name",
            "complain_by",
            "phone",
            "date",
            "description",
            "action_taken",
            "assigned",
            "note",
            "created_by",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_by", "created_at", "updated_at"]




from rest_framework import serializers
from .models import PostalDispatch, PostalReceive


# ================================
# POSTAL DISPATCH SERIALIZER
# ================================
class PostalDispatchSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source="created_by.full_name", read_only=True)

    class Meta:
        model = PostalDispatch
        fields = [
            "id",
            "reference_no",
            "from_title",
            "to_title",
            "address",
            "note",
            "date",
            "created_by",
            "created_by_name",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_by", "created_at", "updated_at"]


# ================================
# POSTAL RECEIVE SERIALIZER
# ================================
class PostalReceiveSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source="created_by.full_name", read_only=True)

    class Meta:
        model = PostalReceive
        fields = [
            "id",
            "reference_no",
            "from_title",
            "to_title",
            "address",
            "note",
            "date",
            "created_by",
            "created_by_name",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_by", "created_at", "updated_at"]
