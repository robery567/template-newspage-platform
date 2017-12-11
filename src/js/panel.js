import 'bootstrap-sass';
import 'metismenu';
import 'datatables.net';
import 'tinymce/tinymce';
import 'tinymce/themes/modern/theme';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/print';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/save';
import 'tinymce/plugins/table';
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/colorpicker';
import 'tinymce/plugins/textpattern';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/toc';
import 'tinymce/plugins/help';

let config = require('./template.config');
let baseHostname = config.baseHostname;

// function init_tagsinput() {
//     let $input = $('input[data-toggle="tagsinput"]');
//     if ($input.length) {
//         let source = new Bloodhound({
//             local: $input.data('tags'),
//             queryTokenizer: Bloodhound.tokenizers.whitespace,
//             datumTokenizer: Bloodhound.tokenizers.whitespace
//         });
//         source.initialize();
//
//         $input.tagsinput({
//             trimValue: true,
//             focusClass: 'focus',
//             typeaheadjs: {
//                 name: 'tags',
//                 source: source.ttAdapter()
//             }
//         });
//     }
// }

function init_metisMenu()
{
    $('#side-menu').metisMenu();
}

// function init_dateTimePicker()
// {
//     $('[data-toggle="datetimepicker"]').datetimepicker({
//         icons: {
//             time: 'fa fa-clock-o',
//             date: 'fa fa-calendar',
//             up: 'fa fa-chevron-up',
//             down: 'fa fa-chevron-down',
//             previous: 'fa fa-chevron-left',
//             next: 'fa fa-chevron-right',
//             today: 'fa fa-check-circle-o',
//             clear: 'fa fa-trash',
//             close: 'fa fa-remove'
//         }
//     });
// }

function load_sidebar()
{
    $(window).bind('load resize', function() {
        let topOffset = 50;
        let width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        let height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height -= topOffset;

        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100;
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        if (height < 1) { height = 1; }
        if (height > topOffset) {
            $('#page-wrapper').css('min-height', (height) + 'px');
        }
    });
}

function init_active()
{
    let url = window.location;
    let element = $('ul.nav a').filter(function () {
        return this.href === url;
    }).addClass('active').parent();

    while (true) {
        if (element.is('li')) {
            element = element.parent().addClass('in').parent();
        } else {
            break;
        }
    }
}

function init_dataTables()
{
    let tables = [
        'articles',
        'sections',
        'categories'
    ];

    tables.forEach(table => {
        $(`#dt-${table}`).DataTable({
            'language': {
                'url': '//cdn.datatables.net/plug-ins/1.10.15/i18n/Romanian.json'
            }
        });
    });
}

function api_deleteImage(cdnUrl)
{
    // http://cdn.robery.eu/gallery/{articleId}/{UUIDv5}.{extension}
    /*
        0 => http:
        1 =>
        2 => cdn.robery.eu
        3 => gallery
        4 => {articleId}
        5 => {UUIDv5}.{extension}
     */
    let bits = cdnUrl.split('/'),
        articleId = bits[4],
        mediaName = bits[5]
    ;

    console.log(`Detected Article ID = ${articleId}`);
    console.log(`Detected Media Name = ${mediaName}`);

    $.ajax(`http://api.${baseHostname}/gallery/delete/${articleId}/${mediaName}`, {
        async: true,
        crossDomain: true,
        dataType: 'json',
        error: (jqXHR, textStatus, errorThrown) => {
            alert('Nu s-a putut șterge imaginea de pe server.');
        },
        success: (data, textStatus, jqXHR) => {
            alert('Imaginea de pe server s-a șters fără probleme!');
        },
        method: 'GET',

    });
}

function init_tinymce()
{
    let articleId = $('form[name="appbundle_article"]').data('article-id');
    let tinymce_config = {
        selector: '#appbundle_article_content',
        language_url: '/langs/ro.js',
        branding: false,
        theme: 'modern',
        skin: 'lightbox',
        menubar: false,
        height: '640',
        plugins: [
            'advlist autolink lists link image charmap print preview hr anchor pagebreak',
            'searchreplace wordcount visualblocks visualchars fullscreen',
            'insertdatetime media nonbreaking save table contextmenu directionality',
            'emoticons paste textcolor colorpicker textpattern imagetools codesample toc help'
        ],
        toolbar1: 'undo redo | insert | styleselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
        toolbar2: 'print preview media | forecolor backcolor emoticons | codesample help',
        image_advtab: true,
        file_picker_types: 'image media',
        image_class_list: [
            { title: 'Fluid', value: 'img-responsive' }
        ],
        image_caption: true,
        images_upload_url: 'http://api.' + baseHostname + '/gallery/upload/' + articleId,
        images_upload_base_path: 'http://cdn.' + baseHostname,
        automatic_uploads: true,
        file_picker_callback: function(cb, value, meta) {
            let input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*, video/*');

            // Note: In modern browsers input[type="file"] is functional without 
            // even adding it to the DOM, but that might not be the case in some older
            // or quirky browsers like IE, so you might want to add it to the DOM
            // just in case, and visually hide it. And do not forget do remove it
            // once you do not need it anymore.

            input.onchange = function() {
                let file = this.files[0];

                let reader = new FileReader();
                reader.onload = function () {
                    // Note: Now we need to register the blob in TinyMCEs image blob
                    // registry. In the next release this part hopefully won't be
                    // necessary, as we are looking to handle it internally.
                    let id = 'blobid' + (new Date()).getTime();
                    let blobCache =  tinymce.activeEditor.editorUpload.blobCache;
                    let base64 = reader.result.split(',')[1];
                    let blobInfo = blobCache.create(id, file, base64);
                    blobCache.add(blobInfo);

                    // call the callback and populate the Title field with the file name
                    cb(blobInfo.blobUri(), { title: file.name });
                };
                reader.readAsDataURL(file);
            };

            input.click();
        },
        setup: ed => {
            ed.on('keydown', e => {
                let selection = tinymce.activeEditor.selection;
                if ((e.keyCode === 8 || e.keyCode === 46) && selection) {
                    let selectedNode = selection.getNode();
                    if (selectedNode && selectedNode.nodeName === 'IMG') {
                        console.log(selectedNode);
                        api_deleteImage(selectedNode.src);
                    }
                }
            });
        },
    };

    tinymce.init(tinymce_config);

    $(document).on('focusin', (e) => {
        if ($(e.target).closest(".mce-window").length) {
            e.stopImmediatePropagation();
        }
    });
}

function init_previewEditor()
{
    let tinymce_config = {
        selector: '#appbundle_article_preview',
        language_url: '/langs/ro.js',
        branding: false,
        theme: 'modern',
        skin: 'lightbox',
        height: 240,
        menubar: false,
        plugins: [
            'advlist autolink lists link charmap print preview hr anchor',
            'searchreplace wordcount visualblocks visualchars fullscreen',
            'insertdatetime nonbreaking save table contextmenu directionality',
            'emoticons paste textcolor colorpicker textpattern codesample toc help'
        ],
        toolbar1: 'undo redo | insert | styleselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
        toolbar2: 'print preview | forecolor backcolor emoticons | codesample help'
    };

    tinymce.init(tinymce_config);

    $(document).on('focusin', e => {
        if ($(e.target).closest(".mce-window").length) {
            e.stopImmediatePropagation();
        }
    });
}

$(window).ready(() => {
    init_metisMenu();
    init_active();
    init_dataTables();
    init_tinymce();
    init_previewEditor();

    load_sidebar();
});