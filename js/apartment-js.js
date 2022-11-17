$(function(){
    $('.tab-panels .tab-item').on('click', function(){

        var $panel = $(this).closest('.tab-panels');
        

        $panel.find(' .tab-item.active').removeClass('active');

        $(this).addClass('active');

        var clickedPanel = $(this).attr('data-panel-name');

        $panel.find('.panel.active').slideUp(0, nextPanel);

        function nextPanel(){
            $(this).removeClass('active');

            $('#'+clickedPanel).slideDown(0, function(){
                $(this).addClass('active');
            });
        }
    })
});

/* slick */

(function($) {
    return;
    'use strict';
  
    //create temporal object to get slick object
    var getSlick = function() {
      var $tmp = $('<div>').slick();
      var slick = $tmp[0].slick.constructor;
      $tmp.slick('unslick');
      return slick;
    };
  
    if ($.fn.slick) {
      var Slick = getSlick();
      if (Slick) {
        //hook checkResponsive method
        var checkResponsiveOrig = Slick.prototype.checkResponsive;
        Slick.prototype.checkResponsive = function(initial, forceUpdate) {
          var _ = this;
          if (_.options.autoSlidesToShow && !_.options.infinite && _.options.variableWidth) {
            var sliderWidth = _.$slider.width();
            var width = 0, length = _.$slides.length;
            for (var i = 0; i < length; i++) {
              width += $(_.$slides[i]).outerWidth();
            }
            _.averageSlidesWidth = width / length;
            _.options.slidesToShow = Math.floor(sliderWidth / _.averageSlidesWidth) || 1;
            //force update arrows
            if (_.lastSlidesToShow !== _.options.slidesToShow) {
              _.lastSlidesToShow = _.options.slidesToShow;
              if (initial === true) {
                _.currentSlide = _.options.initialSlide;
              }
              _.refresh(initial);
            }
          }
          return checkResponsiveOrig.apply(this, arguments);
        };
        //hook getLeft method
        var getLeftOrig = Slick.prototype.getLeft;
        Slick.prototype.getLeft = function(slideIndex) {
          var _ = this;
          if (_.options.autoSlidesToShow && !_.options.infinite && _.options.variableWidth) {
            var targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
            if (targetSlide[0]) {
              var diff = 0;
              if (slideIndex) {
                var sliderWidth = _.$slider.width();
                var otherSlidesWidth = (_.slideCount - slideIndex) * _.averageSlidesWidth;
                if (otherSlidesWidth < sliderWidth) {
                  diff = sliderWidth - otherSlidesWidth;
                }
              }
              return (targetSlide[0].offsetLeft - diff) * -1;
            }
            return  0;
          }
          return getLeftOrig.apply(this, arguments);
        };
      }
    }
  })(jQuery);

  
  


 
  // var slickCheck = 'unslick';
  // $('.tabs-mob-slide').slick({
  //     autoplay: false,
  //     settings: slickCheck
  // });
  // $('.tabs-mob-slide').slick('unslick');
  //   function initSwiper() {
  //       var screenWidth = $(window).width();
  //       if(screenWidth < 789) {
  //         var slickCheck = {autoSlidesToShow: true,};
  //
  //         $('.tabs-mob-slide').slick({
  //           autoplay: false,
  //           arrows: true,
  //           variableWidth: true,
  //           infinite: true,
  //           focusOnSelect: true,
  //           variableWidth: true,
  //           swipeToSlide: true,
  //           settings: slickCheck
  //         }).on('afterChange', function(event, slick, currentSlide, nextSlide){
  //
  //           $(".tab-item.tab-item-h.slick-slide.slick-current.slick-active").click();
  //
  //         });;
  //
  //
  //       } else if (screenWidth > 790) {
  //         $('.tabs-mob-slide').slick('unslick');
  //
  //       }
  //   }
  //
  //   //Swiper plugin initialization
  //   initSwiper();
  //
  //   //Swiper plugin initialization on window resize
  //   $(window).on('resize', function(){
  //       initSwiper();
  //   });