import 'bootstrap-sass';
import 'datatables.net';
import 'datatables.net-bs';
import 'datatables.net-responsive';
import 'simpleweather';
import 'timeago';
import 'timeago/locales/jquery.timeago.ro';
import * as PhotoSwipe from 'photoswipe/dist/photoswipe';
import * as PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import * as moment from 'moment';
import 'moment/locale/ro';
import 'jquery-match-height/jquery.matchHeight';

import bistr_logo from '../images/bistriteanul_logo.png';
import mxhost_logo from '../images/logo_mxhost_trafic.jpg';
import certificatweb_logo from '../images/certweb.png';
import rss_logo from '../images/rss-site.jpg';

let isMobile = false;
let isiPad = false;

let config = require('./template.config');

let baseHostname = config.baseHostname,
    cdnHostname = '//cdn.' + baseHostname,
    apiHostname = '//api.' + baseHostname;

function init_isMobile() {
    let array_mobileIds = ['iphone', 'android', 'ipad', 'ipod'];
    let uAgent = navigator.userAgent.toLowerCase();
    for (let i = 0; i < array_mobileIds.length; i++) {
        if (uAgent.search(array_mobileIds[i]) > -1) {
            isMobile = true;
            if (array_mobileIds[i] === 'ipad') isiPad = true;
            init_touch_hover();
        }
    }
}

function init_menu() {
    let timer = [];
    $('.block_top_menu nav li').hover(
        function () {
            clearTimeout(timer[$('.block_top_menu nav li').index(this)]);
            $(this).addClass('hover').find('> ul').slideDown(200);

        },
        function () {
            let _this = this;
            timer[$('.block_top_menu nav li').index(this)] = setTimeout(function () {
                $(_this).removeClass('hover').find('> ul').hide();
            }, 20);
        }
    );

    $('.block_top_menu nav a').click(function (e) {
        if (isMobile) {
            let parent = $(this).parent();
            if (((!parent.hasClass('expanded')) || $(this).attr('href') === '#') && (parent.find('ul').length > 0)) {
                $('.block_top_menu nav li').removeClass('expanded');
                $(this).parent().toggleClass('expanded');
                e.preventDefault();
            }
        }
    });

    init_secondary_menu();
    build_responsive_menu();
}

function init_secondary_menu() {
    let timer = [];

    $('.block_secondary_menu nav li').hover(
        function () {
            let tail = $(this).find('.tail');
            let content = $('.block_secondary_menu .dropdown[data-menu="' + $(this).attr('data-content') + '"]');
            clearTimeout(timer[$('.block_secondary_menu nav li').index(this)]);
            $(this).addClass('hover');
            content.addClass('hover');
        },
        function () {
            let _this = this;
            let tail = $(this).find('.tail');
            let content = $('.block_secondary_menu .dropdown[data-menu="' + $(this).attr('data-content') + '"]');
            timer[$('.block_secondary_menu nav li').index(this)] = setTimeout(function () {
                $(_this).removeClass('hover');
                content.removeClass('hover');
            }, 20);
        }
    );

    $('.block_secondary_menu .dropdown').hover(
        function () {
            let menu = $(this).attr('data-menu');
            let blockMenu = $('.block_secondary_menu nav li[data-content=' + menu + ']');
            let tail = $('.block_secondary_menu nav li[data-content=' + menu + '] .tail');
            let num = $('.block_secondary_menu nav li').index(blockMenu);
            clearTimeout(timer[num]);
            blockMenu.addClass('hover');
            $(this).addClass('hover');
        },
        function () {
            let menu = $(this).attr('data-menu');
            let tail = $('.block_secondary_menu nav li[data-content=' + menu + '] .tail');
            let num = $('.block_secondary_menu nav li').index($('.block_secondary_menu nav li[data-content=' + menu + ']'));
            let _this = this;
            timer[num] = setTimeout(function () {
                $('.block_secondary_menu nav li[data-content=' + menu + ']').removeClass('hover');
                $(_this).removeClass('hover');
            }, 10);
        }
    );

    build_responsive_secondary_menu();
}

function build_responsive_menu() {
    let header = $('#header');

    header.find(".top > .inner").prepend('<div class="block_responsive_menu"><div class="button"><a href="#">Menu</a></div><div class="r_menu"></div></div>');

    let menu_content = $('.block_top_menu nav > ul').clone();
    header.find(".block_responsive_menu .r_menu").append(menu_content);

    $('.block_responsive_menu .r_menu ul').each(function () {
        $(this).find('> li:last').addClass('last_menu_item');
    });
    $('.block_responsive_menu .r_menu li').each(function () {
        if ($(this).find('> ul').length > 0) {
            $(this).addClass('has_children');
        }
    });

    $('.block_responsive_menu .button a').click(function (e) {
        $('.block_responsive_menu > .r_menu').toggleClass('hover');

        e.preventDefault();
    });

    $('.block_responsive_menu .r_menu .has_children > a').click(function (e) {
        if (!$(this).parent().hasClass('expanded') || $(this).attr('href') === '#') {
            $('.block_responsive_menu .r_menu .expanded').removeClass('expanded');
            $(this).parent().toggleClass('expanded');

            e.preventDefault();
        }
    });
}

function build_responsive_secondary_menu() {
    let header = $('#header');

    header.find(".bottom > .inner").prepend('<div class="block_secondary_menu_r"><div class="button"><a href="#">Category</a></div><div class="r_menu"></div></div>');

    let menu_content = $('.block_secondary_menu nav > ul').clone();
    header.find(".block_secondary_menu_r .r_menu").append(menu_content);

    $('.block_secondary_menu_r .button a').click((e) => {
        $('.block_secondary_menu_r > .r_menu').slideToggle(300);

        e.preventDefault();
    });
}

function init_sticky_footer() {
    let page_height = $('.wrapper').height();
    let window_height = $(window).height();
    let bodyObject = $('body');
    if (page_height <= window_height) {
        if (bodyObject.hasClass('sticky_footer')) {
            bodyObject.addClass('need');
            $('#content').css('padding-bottom', $('footer').outerHeight() + 'px');
        }
    }
    else {
        bodyObject.removeClass('need');
        $('#content').css('padding-bottom', '0px');
    }
}

function init_touch_hover() {
    $('.hover').bind('click', () => {
        $(this).parent().toggleClass('hovered');
    });
}

function init_weather() {
    let latitude = '47.1392617',
        longitude = '24.4890979';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
        });
    }

    load_weather(latitude+','+longitude);
}

function init_date() {
    let datetime = moment().format("dddd, DD MMM YYYY");
    $('#datetime').append(datetime);
}

function init_currency() {
    let currencyNode = $('#currency');
    let date;

    currencyNode.html('Schimb valutar <i class="fa fa-caret-down"></i>');
    $.getJSON('http://' + baseHostname + '/api/exchange-rate', (data) => {
        let rates = [];
        let result = JSON.parse(data);

        date = result['publish-date'];

        $.each(result['currencies'], (currency, value) => {
            let multiplier = value['multiplier'],
                currencyValue = value['value'];

            rates.push('<li>' + multiplier + ' ' + currency + ' = ' + currencyValue + '</li>');
        });

        let displayCurrency = '<ul>' + rates.join('') + '</ul>';

        currencyNode.popover({
            html: true,
            content: displayCurrency,
            title: 'Curs valutar ' + date,
            trigger: 'hover',
            placement: 'bottom'
        });
    });
}

function load_weather(location, woeid) {
    $.simpleWeather({
        location: location,
        woeid: woeid,
        unit: 'c',
        success: (weather) => {
            let html = '<i id="weather-icon" class="icon-' + weather.code + '"></i> ' + weather.city + ' (' + weather.temp + ' &deg;' + weather.units.temp + ')';

            $("#weather").html(html);
        },
        error: (error) => {
            $("#weather").append(error);
        }
    });
}

function load_visitors() {
    $.getJSON('http://' + baseHostname + '/api/active-visitors', (data) => {
        let visitors = JSON.parse(data);

        $('#visitors').html('Cititori online: ' + visitors.active);
    });
}

function generate_bistr_logo() {
    let target = $('a[id="bistr-logo"]'),
        generated = $('<img/>')
            .addClass('logo')
            .attr('width', 379)
            .attr('alt', 'bistriteanul.ro')
            .attr('title', 'bistriteanul.ro')
            .attr('src', cdnHostname + bistr_logo);

    target.append(generated);
}

function generate_logo_mxhost() {
    let target = $('#generate-logo-mxhost'),
        logo = $('<img/>')
            .addClass('img-responsive')
            .attr('alt', 'MxHost.ro')
            .attr('title', 'MxHost.ro')
            .attr('src', cdnHostname + mxhost_logo);

    target.append(logo);
}

function generate_logo_certweb() {
    let target = $('#generate-logo-certificatweb'),
        logo = $('<img/>')
            .addClass('img-responsive')
            .attr('alt', 'Certificat web')
            .attr('title', 'Certificat web')
            .attr('src', cdnHostname + certificatweb_logo);

    target.append(logo);
}

function generate_logo_rss() {
    let target = $('#generate-logo-rss'),
        logo = $('<img/>').addClass('img-responsive').attr('alt', 'RSS Bistriteanul.ro').attr('title', 'RSS Bistriteanul.ro').attr('src', cdnHostname + rss_logo);

    target.append(logo);
}

function init_gallery()
{
    let currentPage = $("body").data('page');

    if (currentPage === 'main_article') {
        let articleId = $('article').data('articleId'),
            thumbnailsNode = $('#articleGalleryThumbnails')
        ;
        console.log("Article ID: " + articleId);
        $.getJSON('//api.' + baseHostname + '/gallery/' + articleId, data => {
            let
                thumbnailsStack = [],
                index = 0
            ;

            data['api-content']['results'].forEach(image => {
                thumbnailsStack.push('<figure class="article__gallery__item" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">' +
                    `<a href="${image.src}" itemprop="contentUrl" data-size="${image.w}x${image.h}" data-index="${index}">` +
                    `<img src="${image.src}" height="200" width="200" itemprop="thumbnail" alt="Image #${index}">` +
                    '</a>' +
                    '</figure>'
                );
                index++;
            });

            thumbnailsNode.html(thumbnailsStack);
        }).fail(() => {
            $('#articleGallery').hide();
        }).done(() => {
            $('#articleGallery').show();
        });
    }
}

let initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements 
    // (children of gallerySelector)
    let parseThumbnailElements = function(el) {
        let thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for(let i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes 
            if(figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML;
            }

            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    let closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    let onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        let eTarget = e.target || e.srcElement;

        // find root element of slide
        let clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if(!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        let clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (let i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) {
                continue;
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    let photoswipeParseHash = function() {
        let hash = window.location.hash.substring(1),
            params = {};

        if(hash.length < 5) {
            return params;
        }

        let vars = hash.split('&');
        for (let i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            let pair = vars[i].split('=');
            if(pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    let openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        let pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                let thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }

        };

        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(let j = 0; j < items.length; j++) {
                    if(items[j].pid === index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    let galleryElements = document.querySelectorAll( gallerySelector );

    for(let i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    let hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};

function init_logo() {
    generate_bistr_logo();
    generate_logo_certweb();
    generate_logo_mxhost();
    generate_logo_rss();
}

function createThumbnailFromVideo() {
    let
        articleNodes = $('.list-group.news--video').find('a[data-article-id]')
    ;

    console.log(articleNodes);
    articleNodes.each((index, articleNode) => {
        let canvas = document.createElement('canvas'),
            childs = articleNode.childNodes,
            video = null
        ;

        console.log(childs);

        childs.forEach(child => {
            console.log(child);
            if (child.tagName === 'video') {
                video = child;
            }
        });

        console.log(video);

        if (video !== null) {
            canvas.width = video.videoWidth();
            canvas.height = video.videoHeight();

            let context = canvas.getContext('2d');

            context.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
    });
}

$(() => {
    init_menu();
    init_sticky_footer();
    init_isMobile();

    init_logo();
    init_date();
    init_weather();
    init_currency();
    load_visitors();

    init_gallery();
    initPhotoSwipeFromDOM('#articleGallery');

    jQuery('time').timeago();
    $('.box').matchHeight();
});