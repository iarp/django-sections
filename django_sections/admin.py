from django.contrib import admin

from .models import PageContentBlock


@admin.register(PageContentBlock)
class PageContentsAdmin(admin.ModelAdmin):
    list_display = ['page_id', 'location', 'updated', 'inserted']
