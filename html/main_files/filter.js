'use strict';

var IS_DEBUG = true,
// Small function for debugging purposes.
    dd = function () {
        IS_DEBUG ? console.log.apply(console, arguments) : undefined;
    },
    Filter = (function ($) {
        // Filter Class constructor
        function Filter(options) {
            var defaults = {
                form: '#filters-form',
                sliders: '.nouislider__slider',
                pjaxContainer: '#pjax-catalog-list',
                filterInputs: {
                    'complex': '[name="complex_ids[]"]',
                    'rooms': '[name="roominess[]"]',
                    'queue': '[name="queue[]"]',
                    'sort': '[name="sort"]',
                    'square-min': '[name="square-min"]',
                    'square-max': '[name="square-max"]',
                    'price-min': '[name="price-min"]',
                    'price-max': '[name="price-max"]',
                    'floor-min': '[name="floor-min"]',
                    'floor-max': '[name="floor-max"]',
                    //'floor': '[name="floor"]',
                    'for': '[name="for"]'
                }
            };
            // Proceeding plugin options, by merging two objects (modifying the first).
            this.opts = $.extend({}, defaults, options);
            // Initializing properties
            this.form = $(this.opts.form);
            this.sliders = $(this.opts.sliders);
            this.container = this.opts.pjaxContainer;
        }


        Filter.prototype = {
            init: function () {
                this.checkDependencies();
                this.triggerReInit();
                this.registerPjaxErrorHandler();
                //this.fixFloorFilter();
                this.fixSlidersInputs();
                this.registerOnChangeEventHandlers();
                this.registerPjaxSuccessHandler();
                $('#spinner_preloader').hide();
                dd('Filters: initialized');
            },
            // Add 'change' event handler for all filter inputs.

            registerOnChangeEventHandlers: function () {
                $(function() {
                    _.sendRequest();
                });
                var _ = this;
                $.each(_.opts.filterInputs, function(k, v) {
                    var input = $(v);
                    if (input.length > 0) {
                        input.on('change', function(e) {
                            dd('triggering submit 1');
                            // $('#spinner_preloader').fadeIn(3000);
                            _.sendRequest();
                        });
                        input.on('load', function(e) {
                            dd('triggering submit 1');
                            // $('#spinner_preloader').fadeIn(3000);
                            _.sendRequest();
                        });
                    }
                });
            },
            registerPjaxErrorHandler: function () {
                $(document).on('pjax:error', function(xhr, textStatus, error, options) {
                    dd(error);
                    return false;
                });
            },
            registerPjaxSuccessHandler: function () {
                $(document).on('pjax:success', function(xhr, textStatus, error, options) {
                    window.preloader.done();
                });
            },
            /**
             * Fix floor filter dropdown by re-updating filter input value, each time it changes through custom dropdown.
             */
            fixFloorFilter: function () {
                var _ = this;
                $(document).on('click', '.floor .custom-select__list button', function () {
                    var input = $('[name="floor"]');
                    input.val($(this).data('select-item-value'));
                    dd('triggering submit 2');
                    _.sendRequest();
                });

            },
            /**
             * Fix all sliders(rage inputs) filters by re-updating filter inputs values, each time it changes through noUiSlider plugin.
             */
            fixSlidersInputs: function () {
                var _ = this;

                $.each(_.sliders, function (k, obj) {
                    try {
                        obj.noUiSlider.on('change', function (values, handle, unencoded, tap, positions) {
                            var minValue = values[0],
                                maxValue = values[1],
                                ranges = $(this.target).siblings('.ranges').eq(0),
                                minInput = ranges.find('[data-no-ui-input-min]').eq(0),
                                maxInput = ranges.find('[data-no-ui-input-max]').eq(0);
                            minInput.val(minValue);
                            maxInput.val(maxValue);
                            dd('triggering submit 3');
                            _.sendRequest();
                        });
                    } catch(err) {
                        dd(err);
                        dd('error function fixSlidersInputs, it is trying to fix Floor-slider, which does not exist');
                    }
                });
            },
            /**
             * Send request via pjax plugin.
             */
            sendRequest: function () {
                window.history.pushState("", "",  window.location.pathname + '?' + $('#filters-form').serialize());
                $('.filter-form__summary').css('visibility', 'visible');
                var needRefresh = false;
                // var needRefresh = true;

                if (typeof sessionStorage.syncts !== 'undefined') {
                    var time = new Date().getTime()
                    var expire = Math.round((time / 1000)-(sessionStorage.syncts))
                    if (expire > 15*60) {
                        needRefresh = true
                    }
                } else {
                    needRefresh = true
                }

                var url = window.location

                var _ = this;

                if (typeof sessionStorage.flatsfixed4 === 'undefined' || needRefresh) {
                    $.ajax({
                        dataType: "json",
                        indexValue: {param1:_},
                        url: url,
                        success: function(data, param1) {
                            if ((typeof sessionStorage.flatsfixed4 === 'undefined' || needRefresh)
                                && data[0].sync_status === 'done') {
                                sessionStorage.removeItem('syncts')
                                sessionStorage.setItem('syncts', data[0].sync_timestamp);
                                sessionStorage.setItem('flatsfixed4', JSON.stringify(data));
                            }
                            doStuff(data);
                        },
                    });
                } else {
                    var flats = JSON.parse(sessionStorage.flatsfixed4);
                    doStuff(flats);
                }

                function doStuff(flats, main) {
                    $(".flat-results-grid__item").remove();
                    var formData =  _.form.serializeArray();
                    var formValues = [];
                    var flatsToDelete = [];

                    $.each(formData, function (k, v) {
                        if (formValues[v.name]) {
                            formValues[v.name] += ', ' + v.value + '';
                        } else {
                            formValues[v.name] = '' + v.value + '';
                        }
                    });

                    if (formValues['roominess[]']) {
                        formValues['roominess[]'] = formValues['roominess[]'].split(", ");
                    }

                    if (formValues['queue[]']) {
                        formValues['queue[]'] = formValues['queue[]'].split(", ");
                    }

                    if (formValues['complex_ids[]']) {
                        formValues['complex_ids[]'] = formValues['complex_ids[]'].split(", ");
                    }

                    if(formValues['sort'] && (formValues['sort'] === 'cheap' || formValues['sort'] === 'expensive')) {
                        sessionStorage.setItem('sorting', formValues['sort'])
                    }

                    if (formValues['price-min'] || formValues['price-max']) {
                        $.each(flats, function (index, loopelement) {
                            var price = parseInt(loopelement.price);
                            if (price < parseInt(formValues['price-min']) || price > parseInt(formValues['price-max'])) {
                                delete flats[index]
                            }
                        });
                    }

                    if (formValues['type']) {
                        $.each(flats, function (index, loopelement) {
                            if (typeof loopelement !== 'undefined') {
                                var type = loopelement.type;
                                if (type != formValues['type']) {
                                    delete flats[index]
                                }
                            }
                        });
                    }

                    if (formValues['square-min'] || formValues['square-max']) {
                        $.each(flats, function (index, loopelement) {
                            if (typeof loopelement !== 'undefined') {
                                var area = parseFloat(loopelement.area);
                                var squareMax = parseFloat(formValues['square-max'])+0.0001;
                                var squareMin = parseFloat(formValues['square-min'])-0.0001;
                                if (area <= squareMin || area >= squareMax) {
                                    delete flats[index]
                                }
                            }
                        });
                    }

                    if (formValues['floor-min'] || formValues['floor-max']) {
                        $.each(flats, function (index, loopelement) {
                            if (typeof loopelement !== 'undefined') {
                                var floor = parseInt(loopelement.floor);
                                if (floor < parseInt(formValues['floor-min']) || floor > parseInt(formValues['floor-max'])) {
                                    delete flats[index]
                                }
                            }
                        });
                    }

                    if (formValues['queue[]']) {
                        var queues = formValues['queue[]'];
                        $.each(flats, function (index, loopelement) {
                            if (typeof loopelement !== 'undefined') {
                                var queue_number = loopelement.queue_number;
                                if ($.inArray(queue_number, queues) === -1) {
                                    delete flats[index]
                                }
                            }
                        });
                    }

                    if (formValues['roominess[]']) {
                        var roominesses = formValues['roominess[]'];
                        $.each(flats, function (index, loopelement) {
                            if (typeof loopelement !== 'undefined') {
                                var roominess = loopelement.roominess;
                                if ($.inArray(roominess, roominesses) === -1) {
                                    delete flats[index]
                                }
                            }
                        });
                    }

                    if (formValues['complex_ids[]']) {
                        var complexids = formValues['complex_ids[]'];
                        $.each(flats, function (index, loopelement) {
                            if (typeof loopelement !== 'undefined') {
                                var complexid = loopelement.ac_id.toString();
                                if ($.inArray(complexid, complexids) === -1) {
                                    delete flats[index]
                                }
                            }
                        });
                    }

                    var i = 0

                    function SortByPrice(a, b){
                        if (sessionStorage.getItem('sorting') === 'expensive') {
                            if (a.status === 'presale') {
                                var aPrice = 1;
                            } else {
                                var aPrice = parseInt(a.price);
                            }

                            if (b.status === 'presale') {
                                var bPrice = 1;
                            } else {
                                var bPrice = parseInt(b.price);
                            }

                            return ((aPrice > bPrice) ? -1 : ((aPrice < bPrice) ? 1 : 0));
                        } else {
                            if (a.status === 'presale') {
                                var aPrice = 999999999;
                            } else {
                                var aPrice = parseInt(a.price);
                            }

                            if (b.status === 'presale') {
                                var bPrice = 999999999;
                            } else {
                                var bPrice = parseInt(b.price);
                            }

                            return ((aPrice < bPrice) ? -1 : ((aPrice > bPrice) ? 1 : 0));
                        }
                    }

                    $.each(flats.sort(SortByPrice), function (index) {
                        var margin = 0;
                        var flat = flats[index];

                        if (typeof flat !== 'undefined') {
                            i++;
                            if (i % 2 == 0) {
                                margin = '2.97% !important'
                            }

                            if (flat.status === 'presale') {
                                flat.price_str = 'Скоро в продаже';
                            } else {
                                flat.price_str = flat.price_str + ' ₽';
                            }

                            var tagsHtml = '';
                            var padding = '';
                            var pr_from = '';

                            if ((flat.complex_id === '59506c6e-41d6-4204-b721-d433e32198b9' ||
                            flat.complex_id === '13f35050-ceb0-43fc-9b4f-81c25fcad433' ||
                            flat.complex_id === 'd7b26f49-aeff-440e-b5bb-b40e626a5f2c') && flat.price_str !== 'Скоро в продаже') {
                                pr_from = 'от ';
                            }
                            var queue = '';
                            if (parseInt(flat.queue_size) > 0) {
                                queue = '<span style="float: right;"><img src="/img/lock.png" style="width: 20px" /><span style="float: right;font-weight: 700;\n' +
                                    '        text-transform: uppercase;\n' +
                                    '        font-size: 15px !important;\n' +
                                    '        letter-spacing: .10em;\n' +
                                    '        line-height: 1.66em;\n' +
                                    '        color: #45a56b;">' + flat.queue_size + '</span></span>';
                            }

                            if (flat.type === 'apartment' && parseInt(flat.float_rooms) > 0) {
                                var floorstyles = '';
                                var rooms = flat.float_rooms = flat.float_rooms + '-комн.';
                            } else {
                                var floorstyles = ' style="display:none;" ';
                                var rooms = '';
                            }

                            if (flat.tags) {
                                var tagsHtml = '<p style="margin: 0;">';
                                var thisTags = JSON.parse(flat.tags).tags;
                                padding = 'padding: 12px 19px 10px !important;'

                                if (Array.isArray(thisTags)) {
                                    $.each(thisTags, function (index) {
                                        tagsHtml = tagsHtml + '<img src="' + thisTags[index].tag_icon_url + '" ' +
                                            'title="' + thisTags[index].tag_title + '" style="background-color: ' + thisTags[index].tag_hex_color + ';\n' +
                                            '                                     width: 8%;\n' +
                                            '                                     float: left;\n' +
                                            '                                     padding: 4px;\n' +
                                            '                                     margin-right: 5px;\n' +
                                            '                                     border-radius: 5px; border-color: white">\n';
                                    })
                                } else {
                                    tagsHtml = tagsHtml + '<img src="' + thisTags.tag_icon_url + '" ' +
                                        'title="' + thisTags.tag_title + '" style="background-color: ' + thisTags.tag_hex_color + ';\n' +
                                        '                                     width: 8%;\n' +
                                        '                                     float: left;\n' +
                                        '                                     padding: 4px;\n' +
                                        '                                     margin-right: 5px;\n' +
                                        '                                     border-radius: 5px; border-color: white">\n';
                                }

                                var tagsHtml = tagsHtml + '</p><p style="height: 6px;"></p>';
                            }

                            $('.flat-results-grid').append('' +
                                '<li class="flat-results-grid__item" data-price="' + flat.price + '" style="margin-left: ' + margin + '; cursor: pointer;" onclick="location.href=\'/apartment/' + flat.guid_id + '\'">' +
                                '<div class="flat-mini-card">' +
                                '<a href="/apartment/' + flat.guid_id + '" class="flat-mini-card__image">' +
                                '<img src="' + flat.image + '" alt="" onerror="this.src=\'/static/img/apartments/apartaments-hover.png\';" class="flat-mini-card__img"></a>' +
                                '<div class="flat-mini-card__description" style="' + padding + '">' +
                                tagsHtml +
                                '<p class="flat-mini-card__price"><a href="#" class="flat-mini-card__price-link">' + pr_from + flat.price_str + '</a></p>' +
                                '<p class="flat-mini-card__object">' + flat.complex_label + '</p>' +
                                '<ul class="flat-mini-card__list">' +
                                '<li class="flat-mini-card__list-item"' + floorstyles + '>' + rooms + '</li>' +
                                '<li class="flat-mini-card__list-item"' + floorstyles + '>этаж: ' + flat.floor + ' / ' + flat.floor_count + '</li>' +
                                '<li class="flat-mini-card__list-item">' + flat.area + ' м<sup>2</sup>' + queue + '</li>' +
                                '</ul>' +
                                '</div>' +
                                '</div>' +
                                '</li>')
                        }
                    });
                    $('.apartaments__list').show();
                    $('.filter-form__summary').html('Найдено: ' + i)
                }
                },
            /**
             * Reinitialize page plugins by triggering custom event.
             */
            triggerReInit: function () {
                $(document).trigger('reinit');
            },
            /**
             * Check whether jQuery is loaded
             * @throws Error
             */
            checkDependencies: function () {
                if (typeof $ === undefined) {
                    throw new Error('This plugin requires jQuery.');
                }
                if (typeof $.pjax === undefined) {
                    throw new Error('This plugin requires Pjax.');
                }
            },

        };
        return Filter;
    })(jQuery);