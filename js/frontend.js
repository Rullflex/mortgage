/**
 * Created by walter on 17.12.15.
 */

function parseResponse(response) {
    let i;
    if (response.replaces instanceof Array) {
        for (i = 0, ilen = response.replaces.length; i < ilen; i++) {
            $(response.replaces[i].what).replaceWith(response.replaces[i].data);
        }
    }
    if (response.append instanceof Array) {
        for (i = 0, ilen = response.append.length; i < ilen; i++) {
            $(response.append[i].what).append(response.append[i].data);
        }
    }
    if (response.content instanceof Array) {
        for (i = 0, ilen = response.content.length; i < ilen; i++) {
            $(response.content[i].what).html(response.content[i].data);
        }
    }
    if (response.js) {
        $("body").append(response.js);
    }
    if (response.refresh) {
        window.location.reload(true);
    }
    if (response.onsubmit) {
        $("body").append(response.onsubmit);
    }
    if (response.redirect) {
        window.location.href = response.redirect;
    }
    $('.input_phone').mask("+7(999) 999-99-99");
}

function executeAjaxRequest(url, data, type, successCallback, completeCallback) {
    var csrfParam = $('meta[name="csrf-param"]').attr('content');
    var csrfToken = $('meta[name="csrf-token"]').attr('content');

    var postData = {};
    if (!type) {
        type = 'GET';
        postData[csrfParam] = csrfToken;
    }
    postData = data ? $.extend(postData, data) : postData;

    jQuery.ajax({
        'cache': false,
        'type': type,
        'dataType': 'json',
        'data': postData,
        'success': successCallback ? successCallback : function (response) {
            parseResponse(response);
        },
        'error': function (response) {
            alert(response.responseText);
        },
        'beforeSend': function () {
        },
        'complete': completeCallback ? completeCallback : function () {
            $('.input_phone').mask("+7(999) 999-99-99");
        },
        'url': url
    });
}

$('.js_state').parents('.sales__select-item').find('.sales__lists').show();
$('.js_state').parents('.sales__select-item').find('.sales__select-btn').addClass('active');

function parseErrors(errors) {
    $.each(errors, function (key, value) {
        $('#'+key).parents('.required').addClass('has-error');
        $('#'+key).parent().find('.help-block-error').text(value);
    });
}

$(function () {
    $(document).on('click', '.ajax-link', function (event) {
        event.preventDefault();
        var that = this;
        if ($(that).data('confirm') && !confirm($(that).data('confirm'))) {
            return false;
        }
        executeAjaxRequest($(that).data('href'), $(that).data('params'));
    });

    $(document).on('submit', '.ajax-form', function (event) {
        event.preventDefault();
        var that = this;
        var formData = new FormData(that);
        if (typeof $(that).data('onsubmit') !== 'undefined') {
            formData.append('onsubmit', $(that).data('onsubmit'));
        }
        var form = $(this);
        $('#btn-questions-form-submit').hide();
        jQuery.ajax({
            'cache': false,
            'type': 'POST',
            'dataType': 'json',
            'data': formData,
            'processData': false,
            'contentType': false,
            'success': function (response) {
                parseErrors(response);
                setTimeout(function () {
                    window.talanPreloader.hide();
                }, 1000);

                setTimeout(function () {
                    parseResponse(response);
                }, 1100);
            },
            'error': function (response) {
                alert(response.responseText);
            },
            'beforeSend': function () {
                setTimeout(function () {
                    if (!form.find('.has-error').length) {
                        window.talanPreloader.showAjax();
                    }
                }, 300);
            },
            'complete': function () {
            },
            'url': that.action
        });
    });

    $(document).on("click", ".form-submit", function (e) {
        e.preventDefault();
        var form = $(this).parents('form');
        if (form.length) {
            form.submit();
        } else {
            var formId = $(this).data('id');
            $('#' + formId).submit();
        }
    });

    $(document).on("click", "[data-name='menu-item-link']", function (e) {
        var url = $(this).attr('href');
        var id = $(this).attr('data-model-id');
        var type = $(this).attr('data-model-type');

        setCookie('menu-item-href', url, 1);
        setCookie('menu-item-model-id', id, 1);
        setCookie('menu-item-model-type', type, 1);
    });
});

function showPopup() {
    $('.modals__modal').first().addClass('modal_active');
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// $('form.hypothec-with-doc-form').submit(function (e) {
//     e.preventDefault();
//     var form = $(this);
//     var formData = new FormData(form.get(0));
//     $.ajax({
//         url: form.attr('action'),
//         type: 'post',
//         data: formData,
//         //Options to tell jQuery not to process data or worry about content-type.
//         cache: false,
//         contentType: false,
//         processData: false,
//         success: function (response) {
//             console.log(response);
//         },
//         error: function () {
//             alert('ERROR');
//         }
//     });
// });


$(document).on('changed', '#vacancy-city-select, #vacancy-specialization-select', function () {
    var city = $('#vacancy-city-select').val(),
        specialization = $('#vacancy-specialization-select').val();
    $.pjax.reload({
        container: '#vacancies-list-pjax',
        type: 'GET',
        url: window.location.pathname,
        data: {'vacancy-city': city, 'specialization': specialization},
        push: true,
        replace: false,
        timeout: false
    });
});

(function () {
    $("[data-scroll_to]").click(function(e) {
        var btn = $(this);
        $('html, body').animate({
            scrollTop: $("#" + btn.data('scroll_to')).offset().top
        }, 1000);
    });
})();

$(document).ready(function () {
    if ($(".rating")[0]){
        var tableId, container;
        renderDefaultRating();

        $(document).on('changed', '.city_select_rating', function () {
            tableId = $(this).val();
            container = $(this).parents('.rating').data('count-rating');
            getRating(tableId, container);
        });
    }
});



$(document).ready(function () {
    if ($(".custom_quantity")[0]){

        var chartId;
        var container;

        renderDefaultCustomDdu();

        $(document).on('changed', '.custom_city_select_ddu', function () {
            var currentComplexes = $(this).parents('.custom_quantity').find('.custom_complex_ddu .custom-select__list').find('[data-cityid='+$(this).val()+']');
            var complexLabel = currentComplexes.first().data('select-item-text');
            $(this).parents('.custom_quantity').find('.custom_complex_ddu .custom-select__value').text(complexLabel);
            $(this).parents('.custom_quantity').find('.custom_complex_ddu').find('.custom-select__item').hide();
            currentComplexes.show();
            chartId = currentComplexes.first().data('select-item-value');
            container = $(this).parents('.custom_quantity').data('custom-count-ddu');
            getCustomDdu(chartId, container);
        });

        $(document).on('changed', '.custom_complex_select_ddu', function () {
            chartId = $(this).val();
            container = $(this).parents('.custom_quantity').data('custom-count-ddu');
            getCustomDdu(chartId, container);
        });
    }
});

$(document).ready(function () {
    if ($(".schedule")[0]){

        var chartId;
        var container;

        renderDefaultScheduleCharts();

        $(document).on('changed', '.city_select_schedule', function () {
            var currentComplexes = $(this).parents('.schedule').find('.complex_schedule .custom-select__list').find('[data-cityid='+$(this).val()+']');
            var complexLabel = currentComplexes.first().data('select-item-text');
            $(this).parents('.schedule').find('.complex_schedule .custom-select__value').text(complexLabel);
            $(this).parents('.schedule').find('.complex_schedule').find('.custom-select__item').hide();
            currentComplexes.show();
            chartId = currentComplexes.first().data('select-item-value');
            container = $(this).parents('.schedule').data('count-schedule');
            getScheduleChart(chartId, container);
        });

        $(document).on('changed', '.complex_select_schedule', function () {
            chartId = $(this).val();
            container = $(this).parents('.schedule').data('count-schedule');
            getScheduleChart(chartId, container);
        });
    }
});

$(document).ready(function () {
    if ($(".quantity")[0]){

        var chartId;
        var container;

        renderDefaultCharts();

        $(document).on('changed', '.city_select_ddu', function () {
            var currentComplexes = $(this).parents('.quantity').find('.complex_ddu .custom-select__list').find('[data-cityid='+$(this).val()+']');
            var complexLabel = currentComplexes.first().data('select-item-text');
            $(this).parents('.quantity').find('.complex_ddu .custom-select__value').text(complexLabel);
            $(this).parents('.quantity').find('.complex_ddu').find('.custom-select__item').hide();
            currentComplexes.show();
            chartId = currentComplexes.first().data('select-item-value');
            container = $(this).parents('.quantity').data('count-ddu');
            getChart(chartId, container);
        });

        $(document).on('changed', '.complex_select_ddu', function () {
            chartId = $(this).val();
            container = $(this).parents('.quantity').data('count-ddu');
            getChart(chartId, container);
        });
    }
});

function getChart(chartId, container) {
    var url = $('[data-count-ddu='+container+']').data('submit-url');
    $.ajax({
        type: 'post',
        url: url,
        data: {'chartId' : chartId},
        success: function (response) {
            var currentContainer = $('[data-count-ddu='+container+']');
            currentContainer.find('.render').html('<canvas></canvas><script type="application/json">'+response+'</script>');
            var ctx = currentContainer.find("canvas");
            buildChart(ctx, response);
        },
        error: function () {
            console.log('ERROR: chart');
        }
    });
}

function getScheduleChart(chartId, container) {
    var url = $('[data-count-schedule='+container+']').data('submit-url');
    $.ajax({
        type: 'post',
        url: url,
        data: {'chartId' : chartId},
        success: function (response) {
            var currentContainer = $('[data-count-schedule='+container+']');
            currentContainer.find('.render_schedule').html(response);
        },
        error: function () {
            console.log('ERROR: Schedule chart');
        }
    });
}

function getRating(tableId, container) {
    var url = $('[data-count-rating='+container+']').data('submit-url');
    $.ajax({
        type: 'post',
        url: url,
        data: {'tableId' : tableId},
        success: function (response) {
            var currentContainer = $('[data-count-rating='+container+']');
            currentContainer.find('.render_rating').html(response);
        },
        error: function () {
            console.log('ERROR: table rating');
        }
    });
}

function getCustomDdu(chartId, container) {
    var url = $('[data-custom-count-ddu='+container+']').data('submit-url');
    $.ajax({
        type: 'post',
        url: url,
        data: {'chartId' : chartId},
        success: function (response) {
            var currentContainer = $('[data-custom-count-ddu='+container+']');
            currentContainer.find('.custom_render').html('<canvas></canvas><script type="application/json">'+response+'</script>');
            var ctx = currentContainer.find("canvas");
            buildChart(ctx, response);
        },
        error: function () {
            console.log('ERROR: table rating');
        }
    });
}

function renderDefaultCharts() {
    $(".quantity").each(function(index) {
        var defaultCity = $(this).find('.city_select_ddu').val();
        var defaultComplexes = $(this).find('.complex_ddu .custom-select__list').find('[data-cityid='+defaultCity+']');
        var complexLabel = defaultComplexes.first().data('select-item-text');
        $(this).attr({'data-count-ddu' : index++});
        $(this).find('.complex_ddu .custom-select__value').text(complexLabel);
        $(this).find('.complex_ddu .custom-select__item').hide();
        defaultComplexes.show();
        var chartId = defaultComplexes.first().data('select-item-value');
        var container = $(this).data('count-ddu');
        getChart(chartId, container);
    });
}

function renderDefaultScheduleCharts() {
    $(".schedule").each(function(index) {
        var defaultCity = $(this).find('.city_select_schedule').val();
        var defaultComplexes = $(this).find('.complex_schedule .custom-select__list').find('[data-cityid='+defaultCity+']');
        var complexLabel = defaultComplexes.first().data('select-item-text');
        $(this).attr({'data-count-schedule' : index++});
        $(this).find('.complex_schedule .custom-select__value').text(complexLabel);
        $(this).find('.complex_schedule .custom-select__item').hide();
        defaultComplexes.show();
        var chartId = defaultComplexes.first().data('select-item-value');
        var container = $(this).data('count-schedule');
        getScheduleChart(chartId, container);
    });
}

function renderDefaultRating() {
    $(".rating").each(function(index) {
        $(this).attr({'data-count-rating' : index++});
        var tableId = $(this).find('.city_select_rating').val();
        var container = $(this).data('count-rating');
        getRating(tableId, container);
    });
}

function renderDefaultCustomDdu() {
    $(".custom_quantity").each(function(index) {
        var defaultCity = $(this).find('.custom_city_select_ddu').val();
        var defaultComplexes = $(this).find('.custom_complex_ddu .custom-select__list').find('[data-cityid='+defaultCity+']');
        var complexLabel = defaultComplexes.first().data('select-item-text');
        $(this).attr({'data-custom-count-ddu' : index++});
        $(this).find('.custom_complex_ddu .custom-select__value').text(complexLabel);
        $(this).find('.custom_complex_ddu .custom-select__item').hide();
        defaultComplexes.show();
        var chartId = defaultComplexes.first().data('select-item-value');
        var container = $(this).data('custom-count-ddu');
        getCustomDdu(chartId, container);
    });
}

function buildChart(ctx, data) {
    new Chart(ctx, {
        type: 'line',
        data: jQuery.parseJSON(data),
        options: {
            responsive: true,
            legend: {
                display: true,
                labels: {
                    fontColor: 'rgb(52, 52, 52)',
                    fontSize: 10,
                    fontFamily: "'Northern', 'Helvetica', 'Arial', sans-serif",
                    fontWeight: 'bold'
                }
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
            scales: {
                yAxes: [{
                    stacked: false
                }]
            }
        }
    });
}

$('.ajax_geolocation').on('click', function (event) {
    var type = $(this).data('type');
    var url = $('.geolocation_popup').data('geolocation-url');

    $.ajax({
        type: 'post',
        url: url,
        data: {type: type},
        success: function (response) {
            console.log(response);
        },
        error: function () {
            console.log('ERROR: Geolocation');
        }
    });
});

$('input:file').on('change', function (event) {
    var filename = $(this).val().replace(/C:\\fakepath\\/i, '');
    if (filename) {
        $(this).parent().find('.label_file').text(filename);
    } else {
        $(this).parent().find('.label_file').text($('.label_file').data('old-label'));
    }
});

$('.js_state').parents('.sales__select-item').find('.sales__lists').show();
$('.js_state').parents('.sales__select-item').find('.sales__select-btn').addClass('active');

$(document).on('click', '.show-online', function (event) {
    event.preventDefault();
    var that = $(this);
    jQuery.ajax({
        'cache': false,
        'type': 'POST',
        'dataType': 'json',
        'data': {
            'iframe': that.data('content')
        },
        'success': function (response) {
            window.talanPreloader.hide();
            setTimeout(function () {
                parseResponse(response);
            }, 1100);
        },
        'error': function (response) {
            alert(response.responseText);
        },
        'beforeSend': function () {
            window.talanPreloader.showAjax();
        },
        'complete': function () {

        },
        'url': that.data('url')
    });
});

$(document).ready(function () {
	if ($(".city_select_guarantee")[0]){
		var defaultCity = $('.city_select_guarantee').find('.custom-select__item').first().data('select-item-value');
		$('.complex_select_guarantee').find('[data-cityid]').hide();
		$('.complex_select_guarantee').find('[data-cityid='+defaultCity+']').show();
		var label = $('.complex_select_guarantee').find('[data-cityid='+defaultCity+']').first().text();
		$('.complex_select_guarantee').find('.custom-select__value').text(label);
		$('.guarantee_input_complex').val($('.complex_select_guarantee').find('[data-cityid='+defaultCity+']').first().val());
	}
    // отображение баннера с разной ссылкой в зависимости от типа моб. устройства
	var isMobile = parseInt($('#tlnmdIsMobile').val())
	,	isAndroid = parseInt($('#tlnmdIsAndroid').val())
	,	isIOS = parseInt($('#tlnmdIsIos').val())
	,	hideMobiTopBanner = parseInt($('#tlnHideMobiTopBanner').val())
	,	bannerUrl = null
    ,    forceSystem = null
	;
	if(isMobile) {
		if(isIOS) {
			bannerUrl = 'https://go.onelink.me/app/footerios';
            forceSystem = 'ios';
		} else if(isAndroid) {
			bannerUrl = 'https://go.onelink.me/app/footerandrd';
		}
	}
	// нужно ли отображать верхний баннер
	if(bannerUrl && bannerUrl.length && hideMobiTopBanner !== 1) {
        $.smartbanner({
            title: 'Талан', // What the title of the app should be in the banner (defaults to <title>)
            author: ' ', // What the author of the app should be in the banner (defaults to <meta name="author"> or hostname)
            price: 'Бесплатно', // Price of the app
            appStoreLanguage: 'us', // Language code for App Store
            inAppStore: 'On the App Store', // Text of price for iOS
            inGooglePlay: ' в Google Play', // Text of price for Android
            inAmazonAppStore: 'In the Amazon Appstore',
            inWindowsStore: 'In the Windows Store', // Text of price for Windows
            GooglePlayParams: null, // Aditional parameters for the market
            icon: '/static/img/banner-talan.png', // The URL of the icon (defaults to <meta name="apple-touch-icon">)
            iconGloss: null, // Force gloss effect for iOS even for precomposed
            url: bannerUrl,
            //url: 'https://play.google.com/store/apps/details?id=ru.napoleonit.talan_client&hl=en', // The URL for the button. Keep null if you want the button to link to the app store.
            button: 'Скачать', // Text for the install button
            scale: 'auto', // Scale based on viewport size (set to 1 to disable)
            speedIn: 300, // Show animation speed of the banner
            speedOut: 400, // Close animation speed of the banner
            daysHidden: 0, // Duration to hide the banner after being closed (0 = always show banner)
            daysReminder: 90, // Duration to hide the banner after "VIEW" is clicked *separate from when the close button is clicked* (0 = always show banner)
            force: forceSystem, // Choose 'ios', 'android' or 'windows'. Don't do a browser check, just always show this banner
            hideOnInstall: true, // Hide the banner after "VIEW" is clicked.
            layer: true, // Display as overlay layer or slide down the page
            iOSUniversalApp: false, // If the iOS App is a universal app for both iPad and iPhone, display Smart Banner to iPad users, too.
            appendToSelector: 'body' //Append the banner to a specific selector
        });
		// при нажатии на "крестик" в верхнем банере
		$('#smartbanner .sb-close').on('click', function() {
			//
			$.ajax({
					'url': '/site/close-banner'
				,	'dataType' : 'json'
				,	'method' : 'post'
				,	'success': function(resp) {
				}
			});
		});
	}
});

$(document).on('changed', '.guarantee_input_city_select', function () {
    $('.guarantee_input_city').val($(this).val());
    $('.complex_select_guarantee').find('[data-cityid]').hide();
    $('.complex_select_guarantee').find('[data-cityid='+$(this).val()+']').show();
    var label = $('.complex_select_guarantee').find('[data-cityid='+$(this).val()+']').text();
    $('.complex_select_guarantee').find('.custom-select__value').text(label);
    $('.guarantee_input_complex').val($('.complex_select_guarantee').find('[data-cityid='+$(this).val()+']').first().val());
});

$(document).on('changed', '.guarantee_input_complex_select', function () {
    $('.guarantee_input_complex').val($(this).val());
});

$(document).on('click', '.years-select .custom-select__item', function () {
    updateQueryStringParam('theme', $(this).data('select-item-value'));
});

$(document).on('click', '.themes-select .custom-select__item', function () {
    updateQueryStringParam('theme', $(this).data('select-item-value'));
});

function updateQueryStringParam(param, value) {
    baseUrl = [location.protocol, '//', location.host, location.pathname].join('');
    urlQueryString = document.location.search;
    var newParam = param + '=' + value,
        params = '?' + newParam;

    if (urlQueryString) {
        keyRegex = new RegExp('([\?&])' + param + '[^&]*');
        if (urlQueryString.match(keyRegex) !== null) {
            params = urlQueryString.replace(keyRegex, "$1" + newParam);
        } else {
            params = urlQueryString + '&' + newParam;
        }
    }

    if (value === false) {
        window.location.href = baseUrl;
    } else {
        window.location.href = baseUrl + params;
    }

}
