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

module.exports = {
    config: require('template.config'),
    __init__: () => {
        this.initMetisMenu();
        this.loadSidebar();
        this.initActive();
        this.initDataTables();
    },
    initMetisMenu: () => {
        $('#side-menu').metisMenu();
    },
    loadSidebar: () => {
        $(window).bind('load resize', () => {
            let topOffset = 50,
                width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width,
                height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1,
                collapse = $('div[class="navbar-collapse"]');
            height -= topOffset;

            if (width < 768) {
                collapse.addClass('collapse');
            } else {
                collapse.removeClass('collapse');
            }

            if (height < 1) { height = 1; }
            if (height > topOffset) {
                $('#page-wrapper').css('min-height', `${height}px`);
            }
        });
    },
    initActive: () => {
        let url = window.location,
            element = $('ul[class="nav"] a').filter(() => this.href === url)
                .addClass('active')
                .parent();

        while (true) {
            if (element.is('li')) {
                element = element.parent().addClass('in').parent();
            } else {
                break;
            }
        }
    },
    initDataTables: () => {
        this.config.tables.identifiers.forEach(table => {
            $(`#dt-${table}`).DataTable(this.config.tables.config);
        });
    },
    initTinyMce: () => {
        let localConfig = this.config.editor;
        let editorConfig = {};

        for (editor in localConfig) {
            if (localConfig.hasOwnProperty(editor)) {
                if (editor === 'common') {
                    return;
                }

                editorConfig = Object.merge(localConfig.common, localConfig[editor]);

                tinymce.init(editorConfig);

                $(document).on('focusin', e => {
                    if ($(e.target()).closest('.mce-window').length) {
                        e.stopImmediatePropagation();
                    }
                });
            }
        }
    }
};