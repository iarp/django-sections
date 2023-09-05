import warnings

from django import template
from django.conf import settings
from django.shortcuts import reverse
from django.utils.safestring import mark_safe
from django.contrib.auth.context_processors import auth

try:
    from django.contrib.staticfiles.templatetags.staticfiles import static
except ImportError:
    from django.templatetags.static import static

from django.template import Template, Context

from django_sections.models import PageContentBlock

if settings.SECTIONS_USE_CKEDITOR:
    from ckeditor.widgets import json_encode, CKEditorWidget

register = template.Library()


@register.simple_tag(takes_context=True)
def page_section(context, page_id, location, blank_if_empty=True):

    pc, _ = PageContentBlock.objects.get_or_create(page_id=page_id, location=location)

    if blank_if_empty and not pc.contents:
        return ""

    auth_data = auth(context['request'])
    auth_data['request'] = context['request']

    context = Context(auth_data)
    formatted_contents = Template(pc.contents).render(context=context)

    return mark_safe("""
        <div class="page-section-wrapper {location}" data-page-section-id="{id}">
            <div class="page-section-contents">
                {contents}
            </div>
        </div>""".format(id=pc.pk, location=location, contents=formatted_contents))


@register.simple_tag(takes_context=True)
def page_section_requirements(context, page_already_has_ckeditor=False):
    if not settings.SECTIONS_USE_CKEDITOR:
        warnings.warn('CKEditor is not enabled, do not use {% page_section_requirements %}')
        return ""
    outputs = []
    try:
        if context['request'].user.has_perm('django_sections.change_pagecontentblock'):
            item = CKEditorWidget()
            config = Template('{{config}}').render(context=Context({'config': json_encode(item.config)}))

            outputs.append("""
            <script type="text/javascript">
                var $url_page_contents_editor = "{}";
                var $url_page_contents_editor_config = "{}";
            </script>""".format(
                reverse('django_sections:page-section-contents', kwargs={'page_id': '000'}),
                config,
            ))

            if not page_already_has_ckeditor:
                outputs.append("""
                <script type="text/javascript" src="{}"></script>
                <script type="text/javascript" src="{}"></script>
                """.format(
                    static('ckeditor/ckeditor/ckeditor.js'),
                    static('ckeditor/ckeditor-init.js')
                ))
            outputs.append("""<script type="text/javascript" src="{}"></script>""".format(
                static('django_sections/page-section-editor.js')
            ))
    except:
        pass
    return mark_safe('\n'.join(outputs))
