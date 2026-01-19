from django.urls import path
from .views import *

urlpatterns = [

    path("inventory/categories/", ItemCategoryAPI.as_view(), name="item-categories"),
    path("inventory/categories/create/", ItemCategoryAPI.as_view(), name="item-categories-create"),
    path("inventory/categories/<int:pk>/update/", ItemCategoryAPI.as_view(), name="item-categories-update"),
    path("inventory/categories/<int:pk>/detail/", ItemCategoryAPI.as_view(), name="item-categories-detail"),
    path("inventory/categories/<int:pk>/delete/", ItemCategoryAPI.as_view(), name="item-categories-delete")

    path("inventory/stores/", ItemStoreAPI.as_view(), name="item-stores"),
    path("inventory/stores/create/", ItemStoreAPI.as_view(), name="item-stores-create"),
    path("inventory/stores/<int:pk>/update/", ItemStoreAPI.as_view(), name="item-stores-update"),
    path("inventory/stores/<int:pk>/detail/", ItemStoreAPI.as_view(), name="item-stores-detail"),
    path("inventory/stores/<int:pk>/delete/", ItemStoreAPI.as_view(), name="item-stores-delete"),



    path("inventory/suppliers/", ItemSupplierAPI.as_view(), name="item-suppliers"),
    path("inventory/suppliers/create/", ItemSupplierAPI.as_view(), name="item-suppliers-create"),
    path("inventory/suppliers/<int:pk>/update/", ItemSupplierAPI.as_view(), name="item-suppliers-update"),
    path("inventory/suppliers/<int:pk>/detail/", ItemSupplierAPI.as_view(), name="item-suppliers-detail"),
    path("inventory/suppliers/<int:pk>/delete/", ItemSupplierAPI.as_view(), name="item-suppliers-delete"),


    path("inventory/items/", ItemAPI.as_view(), name="items"),
    path("inventory/items/create/", ItemAPI.as_view(), name="items-create"),   
    path("inventory/items/<int:pk>/", ItemAPI.as_view(), name="items-detail"),
    path("inventory/items/<int:pk>/update/", ItemAPI.as_view(), name="items-update"),
    path("inventory/items/<int:pk>/delete/", ItemAPI.as_view(), name="items-delete"),

    
    path("inventory/stock/", ItemStockAPI.as_view(), name="item-stock"),
    path("inventory/stock/create/", ItemStockAPI.as_view(), name="item-create"),
    path("inventory/stock/<int:pk>/update/", ItemStockAPI.as_view(), name="item-update"),
    path("inventory/stock/<int:pk>/detail", ItemStockAPI.as_view(), name="item-detail"),
    path("inventory/stock/<int:pk>/delete/", ItemStockAPI.as_view(), name="item-delete"),

    path("inventory/store-stock/", ItemStoreStockAPI.as_view(), name="store-stock"),
    path("inventory/issueitems/", ItemIssueAPI.as_view(), name="item-issue"),
    path("inventory/issueitems/create/", ItemIssueAPI.as_view(), name="item-create"),
    path("inventory/issueitems/<int:pk>/delete/", IssueItemDeleteView.as_view()),
    path("inventory/issueitems/return/", ItemReturnAPI.as_view(), name="item-return"),

]
