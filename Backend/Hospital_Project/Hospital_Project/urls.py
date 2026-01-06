from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('users.urls')),
    path('api/admin/patients/', include('patient_module.urls')),
    path('api/admin/', include('admin_module.urls')),
    path('api/admin/doctors/', include('doctor_module.urls')),
    path('api/admin/appointments/', include('appointment_module.urls')),
    path("api/admin/", include("opd_ipd_module.urls")),
    path("api/admin/", include('pathology_module.urls')),

    path("api/admin/", include('pharmacy_module.urls')),
    path("api/admin/", include("ambulance_module.urls")),
    path("api/admin/setup/", include("setup_module.urls")),
    path("api/admin/radiology/", include("radiology_module.urls")),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
