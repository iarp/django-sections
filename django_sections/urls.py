from django.urls import path

from . import views


app_name = "django_sections"
urlpatterns = [
    path('<int:page_id>/', views.page_section_contents, name='page-section-contents'),
]
