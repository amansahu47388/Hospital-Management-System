from django.urls import path
from .views import *
urlpatterns = [

    # *********************************************************************************************#
    #                            HOSPITAL CHARGES SETUP ROUTES                                     #
    # *********************************************************************************************#
    path("charge-units/", ChargeUnitAPI.as_view(), name="charge-unts"),
    path("charge-units/create/", ChargeUnitAPI.as_view(), name="charge-unts-create"),
    path("charge-units/<int:pk>/update/", ChargeUnitAPI.as_view(), name="charge-unts-update"),
    path("charge-units/<int:pk>/delete/", ChargeUnitAPI.as_view(), name="charge-unts-delete"),

    path("charge-type/", ChargeTypeAPI.as_view(), name="charge-type"),
    path("charge-type/create/", ChargeTypeAPI.as_view(), name="charge-type-create"),
    path("charge-type/<int:pk>/update/", ChargeTypeAPI.as_view(), name="charge-type-update"),
    path("charge-type/<int:pk>/delete/", ChargeTypeAPI.as_view(), name="charge-type-delete"),

    path("charge-categories/", ChargeCategoryAPI.as_view(), name="charge-categories"),
    path("charge-category/create/", ChargeCategoryAPI.as_view(), name="charge-category-create"),
    path("charge-category/<int:pk>/update/", ChargeCategoryAPI.as_view(), name="charge-category-update"),
    path("charge-category/<int:pk>/delete/", ChargeCategoryAPI.as_view(), name="charge-category-delete"),

    path("charge-tax/", ChargeTaxAPI.as_view(), name="charge-tax"),
    path("charge-tax/create/", ChargeTaxAPI.as_view(), name="charge-tax-create"),
    path("charge-tax/<int:pk>/update/", ChargeTaxAPI.as_view(), name="charge-tax-update"),
    path("charge-tax/<int:pk>/delete/", ChargeTaxAPI.as_view(), name="charge-tax-delete"),

    path("charges/", HospitalChargesAPIView.as_view(), name="hospital-charges-list"),
    path("charges/create/", HospitalChargesAPIView.as_view(), name="hospital-charges-create"),
    path("charges/<int:pk>/update/", HospitalChargesAPIView.as_view(), name="hospital-charges-update"),
    path("charges/<int:pk>/delete/", HospitalChargesAPIView.as_view(), name="hospital-charges-delete"),



    # *********************************************************************************************#
    #                            BAD SETUP ROUTES                                     #
    # *********************************************************************************************#

    path("floors/", FloorAPI.as_view(), name="floor-list"),
    path("floors/create/", FloorAPI.as_view(), name="floor-create"),
    path("floors/<int:pk>/update/", FloorAPI.as_view(), name="floor-update"),
    path("floors/<int:pk>/delete/", FloorAPI.as_view(), name="floor-delete"),

    path("bed-types/", BedTypeAPI.as_view(), name="bed-type-list"),
    path("bed-type/create/", BedTypeAPI.as_view(), name="bed-type-create"),
    path("bed-type/<int:pk>/update/", BedTypeAPI.as_view(), name="bed-type-update"),
    path("bed-type/<int:pk>/delete/", BedTypeAPI.as_view(), name="bed-type-delete"),

    path("bed-groups/", BedGroupAPI.as_view(), name="bed-groups-list"),
    path("bed-groups/create/", BedGroupAPI.as_view(), name="bed-groups-create"),
    path("bed-groups/<int:pk>/update/", BedGroupAPI.as_view(), name="bed-groups-update"),
    path("bed-groups/<int:pk>/delete/", BedGroupAPI.as_view(), name="bed-groups-delete"),

    path("beds/", BedAPI.as_view(), name="bed-list"),
    path("bed/create/", BedAPI.as_view(), name="bed-create"),
    path("bed/<int:pk>/update/", BedAPI.as_view(), name="bed-update"),
    path("bed/<int:pk>/delete/", BedAPI.as_view(), name="bed-delete"),



#***********************************************************************************#
#                            OPERATIONS SETUP ROUTES                                #
#***********************************************************************************#

    path("operation-setup/", OperationSetupAPI.as_view(), name="operation-setup-list"),
    path("operation-setup/create/", OperationSetupAPI.as_view(), name="operation-setup-create"),
    path("operation-setup/<int:pk>/update/", OperationSetupAPI.as_view(), name="operation-setup-update"),
    path("operation-setup/<int:pk>/delete/", OperationSetupAPI.as_view(), name="operation-setup-delete"),





#***********************************************************************************#
#                            SYMPTOM SETUP ROUTES                                   #
#***********************************************************************************#
   
    path("symptoms/", SymptomAPI.as_view(), name="symptoms-list"),
    path("symptoms/create/", SymptomAPI.as_view(), name="symptoms-create"),
    path("symptoms/<int:pk>/update/", SymptomAPI.as_view(), name="symptoms-update"),
    path("symptoms/<int:pk>/delete/", SymptomAPI.as_view(), name="symptoms-delete"),




#***********************************************************************************#
#                            VITALS SETUP ROUTES                                    #
#***********************************************************************************#

    path("vitals/", VitalAPI.as_view(), name="vitals-list"),
    path("vitals/create/", VitalAPI.as_view(), name="vitals-create"),
    path("vitals/<int:pk>/update/", VitalAPI.as_view(), name="vitals-update"),
    path("vitals/<int:pk>/delete/", VitalAPI.as_view(), name="vitals-delete"),





#***********************************************************************************#
#                            FINDING SETUP ROUTES                                    #
#***********************************************************************************#

    path("findings/", FindingAPI.as_view(), name="findings-list"),
    path("findings/create/", FindingAPI.as_view(), name="findings-create"),
    path("findings/<int:pk>/update/", FindingAPI.as_view(), name="findings-update"),
    path("findings/<int:pk>/delete/", FindingAPI.as_view(), name="findings-delete"),

    path("finding-categories/", FindingCategoryAPI.as_view(), name="finding-categories-list"),
    path("finding-categories/create/", FindingCategoryAPI.as_view(), name="finding-categories-create"),
    path("finding-categories/<int:pk>/update/", FindingCategoryAPI.as_view(), name="finding-categories-update"),
    path("finding-categories/<int:pk>/delete/", FindingCategoryAPI.as_view(), name="finding-categories-delete"),








    path("charges/", HospitalChargesListAPIView.as_view(), name="hospital-charges-list"),
    path("symptoms/", SymptomListAPIView.as_view(), name="symptom-list"),
    path("beds/", BedListAPIView.as_view(), name="bed-list"),
    
]

