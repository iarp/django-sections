from django.contrib.auth.decorators import permission_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from .models import PageContentBlock


@permission_required('core_data.change_pagecontents')
@csrf_exempt
def page_section_contents(request, page_id):
    page = get_object_or_404(PageContentBlock, pk=page_id)

    if request.method == 'POST':
        page.contents = request.POST['contents']
        page.edited_by = request.user
        page.save()

    return JsonResponse({'contents': page.contents})
