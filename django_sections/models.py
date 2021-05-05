from django.db import models
from django.conf import settings

from ckeditor.fields import RichTextField


class PageContentBlock(models.Model):

    class Meta:
        verbose_name = 'Page Content Block'
        verbose_name_plural = 'Page Content Blocks'

    page_id = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    contents = RichTextField(blank=True)

    inserted = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    edited_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f'{self.page_id} - {self.location}'
