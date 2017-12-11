let config = {
    baseHostname: 'robery.eu',
    tables: {
        identifiers: ['articles', 'sections', 'categories'],
        config: {
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Romanian.json'
            }
        }
    },
    editor: {
        common: {
            language_url: '/langs/ro.js',
            branding: false,
            theme: 'modern',
            skin: 'lightbox',
            menubar: false,
            plugins: [
                'advlist autolink lists link charmap print preview hr anchor',
                'searchreplace wordcount visualblocks visualchars fullscreen',
                'insertdatetime nonbreaking save table contextmenu directionality',
                'emoticons paste textcolor colorpicker textpattern codesample toc help'
            ],
            toolbar1: 'undo redo | insert | styleselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
            toolbar2: 'print preview | forecolor backcolor emoticons | codesample help',
        },
        preview: {
            selector: '#appbundle_article_preview',
            height: 240
        },
        content: {
            selector: '#appbundle_article_preview',
            height: 640,
            toolbar3: 'image media',
            plugins: ['image', 'imagetools', 'pagebreak'],
            image_advtab: true,
            file_picker_types: 'image media',
            image_class_list: [
                { title: 'Fluid', value: 'img-responsive' }
            ],
            image_caption: true,
            images_upload_base_path: `http://cdn.${this.baseHostname}`,
            images_upload_url: `http://api.${this.baseHostname}/gallery/upload`,
            automatic_uploads: true,
            file_picker_callback: (cb, value, meta) => {
                "use strict";
                let input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*,video/*');

                input.onchange = () => {
                    let file = this.files[0],
                        reader = new FileReader();

                    reader.onload = () => {
                        let id = `blobid${(new Date()).getTime()}`,
                            blobCache = tinymce.activeEditor.editorUpload.blobCache,
                            base64 = reader.result.split(',')[1],
                            blobInfo = blobCache.create(id, file, base64);

                            blobCache.add(blobInfo);

                        cb(blobInfo.blobUri(), { title: file.name });
                    };

                    reader.readAsDataURL(file);
                };

                input.click();
            },
        }
    }
};

module.exports = config;