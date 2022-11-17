

document.addEventListener('DOMContentLoaded', function() {
	
	$('.slider-wr').slick({
		autoplay: false,
		autoplaySpeed: 6000,
		fade: true,
		arrows: false,
		slidesToShow: 1,
		slidesToScroll: 1,

		loop: true,
		asNavFor: '.slider-nav'
	});
	$('.slider-nav').slick({
		slidesToShow: 5,
		slidesToScroll: 1,
		asNavFor: '.slider-wr',
		dots: false,
		loop: true,

		focusOnSelect: true
	});

	$('.slider-comfort').slick({
		autoplay: false,
		fade: true,
		arrows: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		prevArrow: $('.comfort-arrows__btn_prev'),
		nextArrow: $('.comfort-arrows__btn_next'),
		responsive: [
			
			{
			  breakpoint: 560,
			  settings: {
				
					adaptiveHeight: true
			  }
			},
			// You can unslick at a given breakpoint now by adding:
			// settings: "unslick"
			// instead of a settings object
		  ]

	});
	$('.slider-comfort-nav-item[data-slide]').click(function(e) {
		e.preventDefault();
		var slideno = $(this).data('slide');
		$('.slider-comfort').slick('slickGoTo', slideno - 1);
	});

    $('.myadv').on('click', function (e) {
        e.preventDefault();
       // console.log('click');
        $(".is_active").removeClass( "is_active");
        $(".first").removeClass( "first");
        $(this).find(".slider-comfort-nav-item").addClass("is_active");
    });

	;(function () {

		window.comfortCtrl = {
			init: function init() {

				var _this = comfortCtrl;

				_this.html = {
					$slider: $("[data-comfort-slider]"),
					$statusCurrent: $("[data-comfort-status-current]"),
					$statusTotal: $("[data-comfort-status-total]")
				};

				_this.html.$nav = _this.html.$statusCurrent.closest('.card__number');

				_this.setStatus();
				_this.checkNav();
				_this.events();
			},
			setStatus: function setStatus() {

				var _this = comfortCtrl;

				var current = _this.html.$slider.slick('slickCurrentSlide') + 1;
				var total = _this.html.$slider.slick('getSlick').slideCount;

				current = current < 10 ? '0' + current : current;
				total = total < 10 ? '0' + total : total;

				_this.html.$statusCurrent.text(current);
				_this.html.$statusTotal.text(total);
			},

			checkNav: function checkNav() {
				var _this = comfortCtrl;

				var total = _this.html.$slider.slick('getSlick').slideCount;

				if (total < 2) {
					_this.html.$nav.hide();
				} else {
					_this.html.$nav.show();
				}
			},

			events: function events() {

				var _this = comfortCtrl;

				_this.html.$slider.on('afterChange', function () {
					_this.setStatus();
				});

				$(window).on('resize', _this.checkNav);
			}
		};
		if ($("[data-comfort-slider]").length) {
			comfortCtrl.init();
		}
    })();
    
    ;(function () {
        'use strict';
    
        window.comfortMoreCtrl = {
    
            init: function init() {
    
                var ctrl = comfortMoreCtrl;
                ctrl.$comfortBlur = $('[data-blur-comfort]');
                ctrl.$comfortBtn = $('[data-btn-comfort]');
                ctrl.$comfortContent = $('[data-comfort-content]');
    
                // ctrl.detectHight();
                ctrl.addBtn();
				ctrl.events();

            },
    
            addBtn: function addBtn() {
    
                var ctrl = comfortMoreCtrl;
    
                ctrl.$comfortContent.each(function (i, content) {
    
                    var $content = $(content);
					var basicHeight = $content.height();
					
					console.log(basicHeight  + 'basic item');
                    $content.css({ 'height': 'auto' });
                    var fullHeight = $content.height();
					console.log(fullHeight + 'full item');
					$content.height(basicHeight);
					
					

					// $('.slider-comfort').on('beforeChange', function(event, slick, currentSlide, nextSlide){
					// 	if (fullHeight < 260 && client.windowW < 768) {
					// 		ctrl.$comfortBlur.eq(i).addClass('hide-btn-sh');
					// 	}

					// });
    
                    if (fullHeight > 140 && client.windowW > 1200) {
                        ctrl.$comfortBlur.eq(i).addClass('card__blur_show');
                    }
    
                    if (fullHeight > 260 && client.windowW >= 768 && client.windowW <= 1200) {
                        ctrl.$comfortBlur.eq(i).addClass('card__blur_show');
                        $content.addClass('card__content_margin');
                        $content.height(260);
                    }
    
                    if (fullHeight > 260 && client.windowW < 768) {
                        ctrl.$comfortBlur.eq(i).addClass('card__blur_show');
                        // $content.height(260);
					}
					
					if (fullHeight <= 170 ) {
                        ctrl.$comfortBlur.eq(i).addClass('hide-btn-sh');
					}
					
                });
            },
    
            showText: function showText(i) {

				
				var ctrl = comfortMoreCtrl;
				var sliderList = ctrl.$comfortBtn.closest('.slick-list');
    
				sliderList.addClass('on');
                var basicHeight = ctrl.$comfortContent.eq(i).height();
                ctrl.$comfortContent.eq(i).css({ 'height': 'auto' });
                var fullHeight = ctrl.$comfortContent.eq(i).height();
                // console.log("fullHeight-3", fullHeight);
                ctrl.$comfortContent.eq(i).height(basicHeight);
                ctrl.$comfortContent.eq(i).animate({
                    height: fullHeight
                }, 500);
                ctrl.$comfortContent.eq(i).data('basic-height', basicHeight);
				ctrl.$comfortBtn.eq(i).addClass('card__btn_show').text('Свернуть');
				
            },
    
            hideText: function hideText(i) {
	
				
				var ctrl = comfortMoreCtrl;
				var sliderList = ctrl.$comfortBtn.closest('.slick-list');
    
				sliderList.removeClass('on');
                var basicHeight = ctrl.$comfortContent.eq(i).data('basic-height');
                ctrl.$comfortBtn.eq(i).removeClass('card__btn_show').text('Развернуть');
                ctrl.$comfortContent.eq(i).animate({
                    height: basicHeight
				}, 500);

				// let $block = $('.slider-comfort').find('.slick-list');

				// if ( !$block.hasClass('on') ) {
				// 	$block.animate({
				// 		height: basicHeight + 150
				// 	}, 500);
				// }

				
			},
			
    
            events: function events() {
    
                var ctrl = comfortMoreCtrl;
    
                //$(window).on('resize', function () {
                //    ctrl.$comfortContent.attr('style', '');
                //    ctrl.$comfortBtn.removeClass('card__btn_show').text('Развернуть');
                //    ctrl.$comfortContent.data('basic-height', '0');
                //    ctrl.addBtn();
                //});
    
                ctrl.$comfortBtn.on('click', function () {
                    var index = ctrl.$comfortBtn.index(this);
                    if (!ctrl.$comfortBtn.eq(index).hasClass('card__btn_show')) {
                        ctrl.showText(index);
                    } else {
                        ctrl.hideText(index);
                    };
                });
			},

			
			
			
		
        };
	})();


	;(function () {
        'use strict';
    
        window.comfortMoreCtrl = {
    
            init: function init() {
    
                var ctrl = comfortMoreCtrl;
                ctrl.$comfortBlur = $('[data-blur-comfort]');
                ctrl.$comfortBtn = $('[data-btn-comfort]');
                ctrl.$comfortContent = $('[data-comfort-content]');
    
                // ctrl.detectHight();
                ctrl.addBtn();
				ctrl.events();

            },
    
            addBtn: function addBtn() {
    
                var ctrl = comfortMoreCtrl;
    
                ctrl.$comfortContent.each(function (i, content) {
    
                    var $content = $(content);
					var basicHeight = $content.height();
					
					console.log(basicHeight  + 'basic item');
                    $content.css({ 'height': 'auto' });
                    var fullHeight = $content.height();
					console.log(fullHeight + 'full item');
					$content.height(basicHeight);
					
					

					// $('.slider-comfort').on('beforeChange', function(event, slick, currentSlide, nextSlide){
					// 	if (fullHeight < 260 && client.windowW < 768) {
					// 		ctrl.$comfortBlur.eq(i).addClass('hide-btn-sh');
					// 	}

					// });
    
                    if (fullHeight > 140 && client.windowW > 1200) {
                        ctrl.$comfortBlur.eq(i).addClass('card__blur_show');
                    }
    
                    if (fullHeight > 260 && client.windowW >= 768 && client.windowW <= 1200) {
                        ctrl.$comfortBlur.eq(i).addClass('card__blur_show');
                        $content.addClass('card__content_margin');
                        $content.height(260);
                    }
    
                    if (fullHeight > 260 && client.windowW < 768) {
                        ctrl.$comfortBlur.eq(i).addClass('card__blur_show');
                        // $content.height(260);
					}
					
					if (fullHeight <= 170 ) {
                        ctrl.$comfortBlur.eq(i).addClass('hide-btn-sh');
					}
					
                });
            },
    
            showText: function showText(i) {

				
				var ctrl = comfortMoreCtrl;
				var sliderList = ctrl.$comfortBtn.closest('.slick-list');
    
				sliderList.addClass('on');
                var basicHeight = ctrl.$comfortContent.eq(i).height();
                ctrl.$comfortContent.eq(i).css({ 'height': 'auto' });
                var fullHeight = ctrl.$comfortContent.eq(i).height();
                // console.log("fullHeight-3", fullHeight);
                ctrl.$comfortContent.eq(i).height(basicHeight);
                ctrl.$comfortContent.eq(i).animate({
                    height: fullHeight
                }, 500);
                ctrl.$comfortContent.eq(i).data('basic-height', basicHeight);
				ctrl.$comfortBtn.eq(i).addClass('card__btn_show').text('Свернуть');
				
            },
    
            hideText: function hideText(i) {
	
				
				var ctrl = comfortMoreCtrl;
				var sliderList = ctrl.$comfortBtn.closest('.slick-list');
    
				sliderList.removeClass('on');
                var basicHeight = ctrl.$comfortContent.eq(i).data('basic-height');
                ctrl.$comfortBtn.eq(i).removeClass('card__btn_show').text('Развернуть');
                ctrl.$comfortContent.eq(i).animate({
                    height: basicHeight
				}, 500);

				// let $block = $('.slider-comfort').find('.slick-list');

				// if ( !$block.hasClass('on') ) {
				// 	$block.animate({
				// 		height: basicHeight + 150
				// 	}, 500);
				// }

				
			},
			
    
            events: function events() {
    
                var ctrl = comfortMoreCtrl;
    
                //$(window).on('resize', function () {
                //    ctrl.$comfortContent.attr('style', '');
                //    ctrl.$comfortBtn.removeClass('card__btn_show').text('Развернуть');
                //    ctrl.$comfortContent.data('basic-height', '0');
                //    ctrl.addBtn();
                //});
    
                ctrl.$comfortBtn.on('click', function () {
                    var index = ctrl.$comfortBtn.index(this);
                    if (!ctrl.$comfortBtn.eq(index).hasClass('card__btn_show')) {
                        ctrl.showText(index);
                    } else {
                        ctrl.hideText(index);
                    };
                });
			},

			
			
			
		
        };
	})();

	(function () {
        'use strict';
		window.advantageRRMoreCtrl = {

			init: function init() {

				var ctrl = advantageRRMoreCtrl;
				ctrl.$advantageRRBlur = $('[data-blur-advantageRR]');
				ctrl.$advantageRRBtn = $('[data-btn-advantageRR]');
				ctrl.$advantageRRContent = $('[data-advantageRR-content]');

				// ctrl.detectHight();
				ctrl.addBtn();
				ctrl.events();
			},

			addBtn: function addBtn() {

				var ctrl = advantageRRMoreCtrl;

				ctrl.$advantageRRContent.each(function (i, content) {

					var $content = $(content);
					var basicHeight = $content.height();
					$content.css({ 'height': 'auto' });

					var fullHeight = $content.height();

					$content.height(basicHeight);

					if (fullHeight > 140 && client.windowW > 1200) {
						ctrl.$advantageRRBlur.eq(i).addClass('card__blur_show');
					}

					if (fullHeight > 260 && client.windowW >= 768 && client.windowW <= 1200) {
						ctrl.$advantageRRBlur.eq(i).addClass('card__blur_show');
						$content.addClass('card__content_margin');
						$content.height(260);
					}

					if (fullHeight > 260 && client.windowW < 768) {
						ctrl.$advantageRRBlur.eq(i).addClass('card__blur_show');
						$content.height(260);
					}
					if (fullHeight < basicHeight) {
						ctrl.$advantageRRBlur.eq(i).removeClass('card__blur_show');
					}
				});
			},

			showText: function showText(i) {

				var ctrl = advantageRRMoreCtrl;
				var basicHeight = ctrl.$advantageRRContent.eq(i).height();
				ctrl.$advantageRRContent.eq(i).css({ 'height': 'auto' });
				var fullHeight = ctrl.$advantageRRContent.eq(i).height();
				ctrl.$advantageRRContent.eq(i).height(basicHeight);
				ctrl.$advantageRRContent.eq(i).animate({
					height: fullHeight
				}, 500);
				ctrl.$advantageRRContent.eq(i).data('basic-height', basicHeight);
				ctrl.$advantageRRBtn.eq(i).addClass('card__btn_show').text('Свернуть');
			},

			hideText: function hideText(i) {

				var ctrl = advantageRRMoreCtrl;
				var basicHeight = ctrl.$advantageRRContent.eq(i).data('basic-height');
				// ctrl.$advantageRRBtn.eq(i).removeClass('card__btn_show').text('Смотреть все акции');
				checkActions();
				ctrl.$advantageRRContent.eq(i).animate({
					height: basicHeight
				}, 500);
			},

			events: function events() {

				var ctrl = advantageRRMoreCtrl;

				$(window).on('resize', function () {
					ctrl.$advantageRRContent.attr('style', '');
					// ctrl.$advantageRRBtn.removeClass('card__btn_show').text('Смотреть все акции');
					checkActions();
					ctrl.$advantageRRContent.data('basic-height', '0');
					ctrl.addBtn();
				});

				ctrl.$advantageRRBtn.on('click', function () {
					var index = ctrl.$advantageRRBtn.index(this);
					if (!ctrl.$advantageRRBtn.eq(index).hasClass('card__btn_show')) {
						ctrl.showText(index);
					} else {
						ctrl.hideText(index);
					};
				});
			}
		};

	})();
	if ($('[data-btn-comfort]').length) {
		comfortMoreCtrl.init();
	}
/*
	if ($('[data-btn-advantageRR]').length) {
		advantageRRMoreCtrl.init();
	}
*/
	$('.slider-comfort').on('beforeChange', function(event, slick, currentSlide, nextSlide){
		let $block = $(this).find('.slick-slide.slick-current.slick-active');
		let $item = $block.find('.card__btn_show');
		
		$item.trigger('click');

	  });
	
	$('.comfort-arrows .slick-arrow').on( "click", function() {

		let $this = $(this);
		let $block = $('.slider-comfort').find('.slick-slide.slick-current.slick-active');
		let $item = $block.find('.card__btn');

		if ( $item.hasClass('card__btn_show') ) {

			console.log(0);
			setTimeout(function(){ $('.slider-comfort .slick-list').addClass('on'); }, 100);

		} else {

			setTimeout(function(){ $('.slider-comfort .slick-list').removeClass('on'); }, 100);	

		}


		

	});
	

});