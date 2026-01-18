from django.urls import path
from .views import *

urlpatterns = [
    path("front-office/purpose/", PurposeAPI.as_view(), name="purpose"),


    path("front-office/complain-types/", ComplainTypeAPI.as_view(), name="complain-type"),


    path("front-office/sources/", SourceAPI.as_view(), name="source"),


    # Visitor Routes
    path("front-office/visitor/", VisitorAPI.as_view(), name="visitor"),
    path("front-office/visitor/create/", VisitorAPI.as_view(), name="visitor-create"),
    path("front-office/visitor/<int:pk>/details/", VisitorAPI.as_view(), name="visitor-details"),
    path("front-office/visitor/<int:pk>/update/", VisitorAPI.as_view(), name="visitor-update"),
    path("front-office/visitor/<int:pk>/delete/", VisitorAPI.as_view(), name="visitor-delete"),

    path("front-office/complain/", ComplainAPI.as_view(), name="complain"),
    path("front-office/complain/create/", ComplainAPI.as_view(), name="complain-create"),
    path("front-office/complain/<int:pk>/details/", ComplainAPI.as_view(), name="complain-details"),
    path("front-office/complain/<int:pk>/update/", ComplainAPI.as_view(), name="complain-update"),
    path("front-office/complain/<int:pk>/delete/", ComplainAPI.as_view(), name="complain-delete"),

    path("front-office/dispach/", DispachAPI.as_view(), name="dispach"),
    path("front-office/dispach/create/", DispachAPI.as_view(), name="dispach-create"),
    path("front-office/dispach/<int:pk>/details/", DispachAPI.as_view(), name="dispach-details"),
    path("front-office/dispach/<int:pk>/update/", DispachAPI.as_view(), name="dispach-update"),
    path("front-office/dispach/<int:pk>/delete/", DispachAPI.as_view(), name="dispach-delete"),

    path("front-office/receive/", ReceiveAPI.as_view(), name="receive"),
    path("front-office/receive/create/", ReceiveAPI.as_view(), name="receive-create"),
    path("front-office/receive/<int:pk>/details/", ReceiveAPI.as_view(), name="receive-details"),
    path("front-office/receive/<int:pk>/update/", ReceiveAPI.as_view(), name="receive-update"),
    path("front-office/receive/<int:pk>/delete/", ReceiveAPI.as_view(), name="receive-delete"),
]

