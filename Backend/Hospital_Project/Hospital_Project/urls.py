from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('auth/', include('users.urls')),  # Added /api/ prefix
    path('admin/', include('patient_module.urls')),
    path('admin/', include('admin_module.urls')),
    path('admin/appointments/', include('appointment_module.urls')),
    path("admin/", include("opd_ipd_module.urls")),
    path("admin/", include('pathology_module.urls')),
    path("admin/", include('pharmacy_module.urls')),
    path("admin/", include("ambulance_module.urls")),
    path("admin/setup/", include("setup_module.urls")),
    path("admin/radiology/", include("radiology_module.urls")), 
    path("admin/", include("inventory_module.urls")),
    path('admin/',include('front_office_module.urls')),
    path('admin/',include('finance_module.urls')),
    path('admin/',include('birth_death_module.urls')),
    path('admin/',include('calendar_module.urls')),
    path('admin/', admin.site.urls),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
