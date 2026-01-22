from django.urls import path
from .views import *  

urlpatterns = [
    
#***********************************************************************************#
#                            PATHOLOGY PARAMETER SETUP ROUTES                       #
#***********************************************************************************#
    path("pathology/parameter", PathologyParameterAPI.as_view(), name="pathology-parameter"),
    path("pathology/parameter/create/", PathologyParameterAPI.as_view(), name="pathology-parameter-create"),
    path("pathology/parameter/<int:pk>/update/",PathologyParameterAPI.as_view(), name="pathology-parameter-update"),
    path("pathology/parameter/<int:pk>/delete/", PathologyParameterAPI.as_view(), name="pathology-parameter-delete"),
    



    
#***********************************************************************************#
#                                PATHOLOGY CATEGORY ROUTES                          #
#***********************************************************************************#
    path("pathology/category", PathologyCategoryAPI.as_view(), name="pathology-category"),
    path("pathology/category/create/", PathologyCategoryAPI.as_view(), name="pathology-category-create"),
    path("pathology/category/<int:pk>/update/",PathologyCategoryAPI.as_view(), name="pathology-category-update"),
    path("pathology/category/<int:pk>/delete/", PathologyCategoryAPI.as_view(), name="pathology-category-delete"),
    



    
#***********************************************************************************#
#                                PATHOLOGY TEST ROUTES                                #
#***********************************************************************************#
    path("pathology/pathology-test/", PathologyTestListAPIView.as_view(), name="pathology-test-list"),
    path("pathology/pathology-test/create/", PathologyTestCreateAPIView.as_view(), name="pathology-test-create"),
    path("pathology/pathology-test/<int:pk>/update/",PathologyTestUpdateAPIView.as_view(), name="pathology-test-update"),
    path("pathology/pathology-test/<int:pk>/delete/", PathologyTestDeleteAPIView.as_view(), name="pathology-test-delete"),


#***********************************************************************************#
#                                PATHOLOGY BILL ROUTES                                #
#***********************************************************************************#
    path("pathology/pathology-bill/create/", GeneratePathologyBillAPIView.as_view(), name="pathology-bill-create"),
    path("pathology/pathology-bill/", PathologyBillListAPIView.as_view(), name="pathology-bill-list"),
    path("pathology/pathology-bill/<int:pk>/", PathologyBillDetailAPIView.as_view(), name="pathology-bill-detail"),
    path("pathology/pathology-bill/<int:pk>/update/", PathologyBillUpdateAPIView.as_view(), name="pathology-bill-update"),
    path("pathology/pathology-bill/<int:pk>/delete/", PathologyBillDeleteAPIView.as_view(), name="pathology-bill-delete"),

    
#***********************************************************************************#
#                                PRESCRIPTION ROUTES                                #
#***********************************************************************************#
    path("pathology/prescription/search/", PrescriptionSearchAPIView.as_view(), name="prescription-search"),
]

