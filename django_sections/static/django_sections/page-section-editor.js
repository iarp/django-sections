$(document).ready(function() {

    $('.page-section-wrapper').each(function (index, item) {
        setup_buttons($(this));
    });

    function start_ck() {
        /* global CKEDITOR */
        ;(function() {
          var el = document.getElementById('ckeditor-init-script');
          if (el && !window.CKEDITOR_BASEPATH) {
            window.CKEDITOR_BASEPATH = el.getAttribute('data-ckeditor-basepath');
          }

          // Polyfill from https://developer.mozilla.org/en/docs/Web/API/Element/matches
          if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function(s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                        i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) {}
                    return i > -1;
                };
          }

          function runInitialisers() {
            initialiseCKEditor();
            initialiseCKEditorInInlinedForms();
          }

          if (document.readyState != 'loading') {
            runInitialisers();
          } else {
            document.addEventListener('DOMContentLoaded', runInitialisers);
          }

          function initialiseCKEditor() {
            var textareas = Array.prototype.slice.call(document.querySelectorAll('textarea[data-type=ckeditortype]'));
            for (var i=0; i<textareas.length; ++i) {
              var t = textareas[i];
              if (t.getAttribute('data-processed') == '0' && t.id.indexOf('__prefix__') == -1) {
                t.setAttribute('data-processed', '1');
                var ext = JSON.parse(t.getAttribute('data-external-plugin-resources'));
                for (var j=0; j<ext.length; ++j) {
                  CKEDITOR.plugins.addExternal(ext[j][0], ext[j][1], ext[j][2]);
                }
                CKEDITOR.replace(t.id, JSON.parse(t.getAttribute('data-config')));
              }
            }
          }

          function initialiseCKEditorInInlinedForms() {
            document.body.addEventListener('click', function(e) {
              if (e.target && (
                e.target.matches('.add-row a') ||
                e.target.matches('.grp-add-handler')
              )) {
                initialiseCKEditor();
              }
            });
          }

        }());
    }

    function setup_buttons($obj) {
        var $page_id = $obj.attr('data-page-section-id');

        $obj.find('.buttons').remove();

        var $div = $('<div></div>').addClass('buttons').attr('style', "float:right; position: relative; top: 0px; right: 0px;");

        $div.append($('<a></a>').text('Edit Section')
            .addClass('btn btn-sm edit-page-section btn-danger')
            .attr('name', 'pc-' + $page_id)
            .attr('href', $url_page_contents_editor.replace('000', $page_id))
        );

        $obj.prepend($div);
    }

    $(document).on('click', '.edit-page-section', function(e){
        e.preventDefault();

        var $parent = $(this).closest('.page-section-wrapper');
        var $page_id = $parent.attr('data-page-section-id');
        var $item = $(this);

        $.ajax({
            url: $url_page_contents_editor.replace('000', $page_id),
            success: function(data) {

                $item.hide();

                $parent.find('div.page-section-contents').html(
                    '<div class="django-ckeditor-widget" data-field-id="id_contents-' + $page_id + '" style="display: inline-block;">\n' +
                    '    <textarea cols="40" id="id_contents-' + $page_id + '" data-id="id_contents-\' + $page_id + \'" name="contents" rows="10" required data-processed="0" data-config="' + $url_page_contents_editor_config + '" data-external-plugin-resources="[]" data-type="ckeditortype">' + data.contents + '</textarea>\n' +
                    '</div>');

                var $button_base = $('<button></button>').addClass('btn btn-sm');
                $parent.find('.buttons').append($button_base.clone().text('Save').addClass('save-page-section btn-primary'));
                $parent.find('.buttons').append($button_base.clone().text('Cancel').addClass('cancel-page-section btn-outline yellow'));

                start_ck();
            }
        })
    });

    $(document).on('click', '.save-page-section', function() {

        var $parent = $(this).closest('.page-section-wrapper');
        var $page_id = $parent.attr('data-page-section-id');
        var objEditor1 = CKEDITOR.instances["id_contents-" + $page_id];

        $.ajax({
            url: $url_page_contents_editor.replace('000', $page_id),
            type: 'post',
            data: {
                'contents': objEditor1.getData()
            },
            success: function (data) {
                objEditor1.destroy();
                $parent.find('.page-section-contents').html(data.contents);
                setup_buttons($parent);
            }
        });
    });

    $(document).on('click', '.cancel-page-section', function() {

        var $parent = $(this).closest('.page-section-wrapper');
        var $page_id = $parent.attr('data-page-section-id');

        $.ajax({
            url: $url_page_contents_editor.replace('000', $page_id),
            success: function (data) {

                CKEDITOR.instances["id_contents-" + $page_id].destroy();
                var $parent = $('.page-section-wrapper[data-page-section-id="' + $page_id + '"]');
                $parent.find('.page-section-contents').html(data.contents);
                setup_buttons($parent)
            }
        });
    });
});
