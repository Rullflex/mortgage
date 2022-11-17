let building_ids = $('.choose-house__link');
let target = [];
let url = "";
let complex_alias = "";
let current_container;

building_ids.each(function(index, e) {
    let house_index = $(this).parent().attr("class").split("--")[1];
    let a = e.name.split("/");
    url = a[0]+"//"+a[2];
    //complex_alias = a[4];
    complex_alias = window.location.href.split('/')[4];
    let index_of_apartments = a.indexOf("apartments");
    target.push({"index": house_index, "building": a[index_of_apartments-1], "section": a[index_of_apartments+1]});
    current_container = $(this).parent();
});

let sendAjax = function (e)
{
    //$('.preloader').removeClass('preloader_done')
    let ajax_url = url+"/page/page/building-ajax-popup";
    let house = $(this).parent().attr("class").split("--")[1];
    let entrance = $(this).attr('name').split('/');
    entrance = entrance[entrance.length-1];

    let active_house = target.find(function(e) { return e.index === house });
    let ajax_data = active_house;
    ajax_data["complex"] = complex_alias;

    var myhouse = $(this).find(".choose-house__name").text();

    if(entrance=='apartments' || entrance=='APARTMENTS') {
        entrance = $(this).find(".choose-house__number").text();
    }

    $.ajax({
        url:  ajax_url,
        type: 'POST',
        async: true,
        dataType: 'json',
        enctype: 'multipart/form-data',
        cache: false,
        data: ajax_data,
        beforeSend: function(){
          building_ids.off('mouseenter', sendAjax);
        },
        success: function(data){
            showElPopup(data, house, entrance,myhouse);
        },
        error: function(data){
            return false;
        }
    });
    e.stopImmediatePropagation();
    return false;
};

function showElPopup(data, container, entrance,myhouse)
{
    let html2 = '';
    let length = Object.keys(data).length;
	let $currTextBlock = $('.choose-house__house--' + container + ' .choose-house__text-block')
	,	$currHouseBlock = $('.choose-house__house--' + container)
	,   coordX = 0
	,	coordY = 0;
	;
    for(let i=0;i<length-2;i++)
    {
        if($.isPlainObject(data[i])) {
            html2 += '<div class="ajax-popup-left-col">\n' +
                data[i]['rooms_number'] + '-комнатные' +
                '</div>\n' +
                '<div class="ajax-popup-right-col">\n' +
                'от ' + parseFloat(data[i]['min_price'] / 1000000).toFixed(1) + ' млн' +
                '</div>\n'
        }
    }
    let build_end_new = [];
    if (data['sksg']){
        data.build_end = data['sksg_'+entrance];
    }

	myhouse_arr = myhouse.match( /(подъезд([\d\W]*))/i );
	if (myhouse_arr !==null){

		// если это запись типа "литер, подъезд 3-5"
		if(myhouse_arr[2] && myhouse_arr[2].trim().length) {
			myhouse = myhouse_arr[1];
			entrance = '';
		} else if(myhouse_arr[1]) {
			myhouse = myhouse_arr[1];
		}
	}

    let html =  '<div class="ajax-popup">\n' +
        '  <div class="ajax-popup-header-wrap">\n' +
        '      <div class="ajax-popup-header">\n' +myhouse+
        '           ' + entrance + '\n' +
        '      </div>\n' +
        '      <div class="ajax-popup-header-text">\n' +
        '      \tКвартиры с улучшенной предчистовой отделкой\n' +
        '      </div>\n' +
        '      <hr class="hr"><br>\n' +
        'Свободно: ' + data["count"] +
        '  </div>\n' +
        '  <div class="ajax-popup-date">\n' +
        '  \tСрок сдачи: <div class="date">'+data.build_end+'</div><br>\n' +
        '  </div>\n' +
        '  <div class="ajax-popup-apartments-wrap">\n' +

        html2 +

        '  </div>\n' +
        '</div>';

    // на тот случай, если к тек. элементу уже был добавлен Попап - то повторно добавлять не будем
	if(!$currHouseBlock.find('.ajax-popup').length) {
		$currTextBlock.append(html);
	}

	let $popupWnd = $(document).find('.ajax-popup');
	if($currTextBlock.length) {
		coordX = $currTextBlock.offset().left;
	}
	if($currHouseBlock.length) {
		coordY = $currHouseBlock.offset().top;
	}
	$popupWnd.offset({/*'left':coordX,*/ 'top': coordY});
	building_ids.off('mouseenter', sendAjax);

	$currHouseBlock.on('mouseleave', removePopup);
	$currTextBlock.on('mouseleave', removePopup);
}

function removePopup(d)
{
    $('.ajax-popup').remove();
    building_ids.on('mouseenter', sendAjax);
}
    building_ids.on('mouseenter', sendAjax);

