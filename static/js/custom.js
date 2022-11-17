$(document).ready(function() {
    $('.wrap.wrap_mobile_full.shares__wrap .show_all_actions').attr('style', 'height: auto !important');

});

$('.js-btn-more').on('click', function (e) {
    e.preventDefault();

    var $this = $(this);

    var height_block = document.getElementById("propsPhone4").scrollHeight;
    var height_all_block = document.getElementById("about-good__block-desc_chars4").clientHeight;


    var height = "";
    var text = "";
    var opacity = "1";
    var $textBtn = $("#about-good__block-desc_chars4").next();
    var $textBtn1 = $textBtn.find('.card__blur.wow.fadeInLeft');
    if (height_block == height_all_block) {
        height = "465";
    } else {
        height = height_block;
    }


    $("#about-good__block-desc_chars4").animate({
        height: height + 'px',
        opacity: "1"
    }, 800, function () {
        $textBtn1.html(text);
    });


    if (!$this.hasClass('trigger')) {
        $this.addClass('trigger');
        $this.html('Свернуть');

    } else {
        $this.removeClass('trigger');
        $this.html('Смотреть все акции');

    }

});

var act_block = document.getElementById("propsPhone4");

if (act_block && 2 < $('.shares__card').length) {
    var height_block1 = act_block.scrollHeight;
    var height_all_block1 = document.getElementById("about-good__block-desc_chars4").clientHeight;
    var height_all_block12 = height_all_block1 - 1;
    console.log(height_all_block12);
    if (height_block1 == height_all_block12) {
        $("#about-good__block-desc_chars4").siblings(".card__blur.wow").addClass('hided');
    }

    $('.customSvBtn .js-btn-more').html('Смотреть все акции');
}