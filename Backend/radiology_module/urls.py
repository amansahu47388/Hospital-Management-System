from django.urls import path
from .views import *

urlpatterns = [
        
#***********************************************************************************#
#                                RADILOGY CATEGORY ROUTES                          #
#***********************************************************************************#
    path("radiology-category/", RadiologyCategoryAPIView.as_view()),
    path("radiology-category/create/", RadiologyCategoryAPIView.as_view()),
    path("radiology-category/<int:pk>/update/", RadiologyCategoryAPIView.as_view()),
    path("radiology-category/<int:pk>/delete/", RadiologyCategoryAPIView.as_view()),




#***********************************************************************************#
#                                RADILOGY PARAMETER ROUTES                          #
#***********************************************************************************#
    path("radiology-parameter/", RadiologyParameterAPIView.as_view()),
    path("radiology-parameter/create/", RadiologyParameterAPIView.as_view()),
    path("radiology-parameter/<int:pk>/update/", RadiologyParameterAPIView.as_view()),
    path("radiology-parameter/<int:pk>/delete/", RadiologyParameterAPIView.as_view()),






#***********************************************************************************#
#                                RADILOGY TEST ROUTES                          #
#***********************************************************************************#
    path("radiology-test/", RadiologyTestListAPIView.as_view()),
    path("radiology-test/create/", RadiologyTestCreateAPIView.as_view()),
    path("radiology-test/<int:pk>/update/", RadiologyTestUpdateAPIView.as_view()),
    path("radiology-test/<int:pk>/delete/", RadiologyTestDeleteAPIView.as_view()),





#***********************************************************************************#
#                                RADILOGY BILL ROUTES                          #
#***********************************************************************************#
    path("radiology-bill/create/", GenerateRadiologyBillAPIView.as_view()),
    path("radiology-bill/", RadiologyBillListAPIView.as_view()),
    path("radiology-bill/<int:pk>/", RadiologyBillDetailAPIView.as_view()),
    path("radiology-bill/<int:pk>/update/", RadiologyBillUpdateAPIView.as_view()),
    path("radiology-bill/<int:pk>/delete/", RadiologyBillDeleteAPIView.as_view()),
    




#***********************************************************************************#
#                                PRESCRIPTION ROUTES                                #
#***********************************************************************************#
    path("prescription/search/", PrescriptionSearchAPIView.as_view()),
]
