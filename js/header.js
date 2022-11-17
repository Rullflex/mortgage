$(document).ready(function() {
    $(window).keydown(function(event){
        if(event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
});

function runTimer() {
    var timerBlock = $('.seconds');
    timerBlock.html(60)
    var num = 60; //количество секунд

    var index = num;
    var timerId = setInterval(function() {
        timerBlock.html(--index);
    }, 1000);

    setTimeout(function() {
        clearInterval(timerId);
        $('#resend_button_real').show()
        $('#timerBlock').hide()
    }, num*1000);
}

function setUserCode() {
    var phone = $('#login_phone').val();
    var username = $('#login_username').val();

    $.ajax({
        url: '/login?username=' + username + '&phone=' + phone,
        success: function(data) {
            console.log(data)
        }
    });
}

function checkIfCodeIsCorrect() {

    var phone = $('#login_phone').val();
    var sms_code = $('#sms_code_input').val();
    $('#authForm').css('visibility', 'hidden');
    $.ajax({
        url: '/check-code?sms_code=' + sms_code + '&phone=' + phone,
        success: function(data) {
            if (data === 'error') {
                $('#authForm').css('visibility', 'visible');
                $('#error_label').show();
                $('#sms_code_input').val('');
            } else {
                MicroModal.hide('modal-login')
            }
        }
    });
}

function showTooltip() {
    $('#cart_button').tipsy("show");
    setTimeout(function() {
        $('#cart_button').tipsy("hide");
    }, 2500)
}

function getFlatsCount() {
    $.ajax({
        url: '/get-flats-count-in-cart',
        success: function(data) {
            $('.cart-count').html(data)
        }
    });
}

function getGuestMessage() {
    $.ajax({
        url: '/get-guest-message',
        success: function(data) {
            if (data) {
                alert(data);
            }
        }
    });
}

$('.cart_button').tipsy({
    arrowWidth: 10,
    attr: 'data-tipsy',
    cls: 'toast-success',
    duration: 450,
    offset: 1,
    position: 'bottom-left',
    trigger: 'manual',
    onShow: null,
    onHide: null
})

// $(document).ready(function() {
//     getFlatsCount()
//     $('.toast').attr('onClick', 'location.href = "/cart"')
//     $('.toast').css('cursor', 'pointer')
// })

// setInterval(function() {
//     getFlatsCount()
// }, 2500)
//
//
// setInterval(function() {
//     getGuestMessage()
// }, 5000)

function doLogin() {
    var input = $('#login_phone')

    if (validatePhoneLength(input)) {
        $('.first_step_form').hide();
        $('#code_field').show();
        $('#resend_button_real_block').show();
        setUserCode();
    }

    return false;
}

$('#resend_button_real').on('click', function() {
    $('#resend_button_real').hide()
    $('#timerBlock').show()
    runTimer();
    setUserCode();
})

$('#sms_code_input').on('keyup', function() {
    if ($(this).val().length === 6) {
        checkIfCodeIsCorrect();
    }
})