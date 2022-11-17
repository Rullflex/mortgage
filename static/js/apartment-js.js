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