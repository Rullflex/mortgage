function validatePhoneLength(obj) {

    var phone = obj.val()
    var digits = phone.replace(/[^0-9.]/g, "")

    if (digits.length != 11 || digits[0] != 7 || digits[1] != 9) {
        $('#errorText').show()
        $('#resend_button_real').hide()

        return false;
    } else {
        $('#errorText').hide()
        $('#resend_button_real').show()

        return true;
    }
}

function tryLogin(form) {
    validatePhoneLength($(this))
}

function doLogStuff() {

    var url = [
        new Date().toLocaleDateString(),
        new Date().toLocaleTimeString(),
        $(document).find("title").text(),
        location.href
    ];

    var urls = {};

    if (localStorage.getItem('urls_new') != null) {
        urls = JSON.parse(localStorage.getItem('urls_new'));
    }

    var index = new Date().getTime() / 1000
    urls[index] = url
    
    // localStorage.setItem("urls_new",JSON.stringify(urls));
    localStorage.setItem("urls_new",JSON.stringify([url]));

    if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ){
        var brwsr = 'Opera';
    }

    else if(navigator.userAgent.indexOf("Chrome") != -1){
        var brwsr = 'Chrome';
    }

    else if(navigator.userAgent.indexOf("Safari") != -1){
        var brwsr = 'Safari';
    }

    else if(navigator.userAgent.indexOf("Firefox") != -1){
        var brwsr = 'Firefox';
    }

    else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )){
        var brwsr = 'IE';
    }

    else{
        var brwsr = 'unknown';
    }

    // var data = {
    //         source: window.location.origin,
    //         browser: brwsr,
    //         is_mobile: window.matchMedia("only screen and (max-width: 760px)").matches,
    //         os: navigator.platform,
    //         title: $(document).find("title").text(),
    //         urls: localStorage.getItem('urls_new')
    // }
    //
    // $.post( 'https://пермь.талан.рф/guest-info/', data, function (result) {
    //     console.log(result);
    // });

    $.ajax({
        url: 'https://пермь.талан.рф/guest-info/',
        method: "POST",
        type: "POST",
        dataType: 'jsonp', // Notice! JSONP <-- P (lowercase)
        processData: true,
        data: {
            source: window.location.origin,
            browser: brwsr,
            is_mobile: window.matchMedia("only screen and (max-width: 760px)").matches,
            os: navigator.platform,
            title: $(document).find("title").text(),
            urls: localStorage.getItem('urls_new')
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "origin, content-type, accept"
        },
        success: function(data) {
            // console.log(JSON.parse(data));
        }
    });

    return false;
}

$(document).ready(function() {
    doLogStuff();
});