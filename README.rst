django-sections


Add editable sections to a view.

Installation
============
::

    pip install -e git+https://github.com/iarp/django-sections.git#egg=django_sections

    # If you want to use ckeditor, install the following
    pip install django-ckeditor

Add the following to settings.py::

    INSTALLED_APPS = [
        ...
        'django_sections',
        'ckeditor',
        ...
    ]

    # If you installed ckeditor and wish to use it
    SECTIONS_USE_CKEDITOR = True or False

Add the following to urls.py::

    urlpatterns = [
        ...
        path('sections/', include('django_sections.urls')),
        ...
    ]

Usage
=====

In your templates use::

    {% page_section "page name" "section name" %}

If you wish to add editing capabilities to the same page for users that have permission to edit sections add the
following near the bottom of your page. jquery is required.::

    {% page_section_requirements %}
