let els = null;
$(document).ready(function(){
    els = $('div[data-bg-src]');

    els.each(function(index, el){
        if($(el).offset().top >= window.scrollY+window.innerHeight)
        {
            $(el).css('background', 'none');
        }
        //console.log($(el).offset().top);
        $(window).on('scroll', function(){
            //console.log(window.scrollY+window.innerHeight);
            if(window.scrollY+window.innerHeight >= $(el).offset().top) {
                let bg = 'url('+$(el).attr('data-bg-src')+')';
                //console.log(bg);
                if($(el).css('background-image') === 'none'){
                    $(el).css('background', bg);
                    console.log($(el).css('background'));
                }
            }
        })
    });
});
