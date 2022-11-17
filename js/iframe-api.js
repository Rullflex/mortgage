(function() {

	$(document).ready(function() {

		$('.mrTalanAgencyContainer').each(function() {
			var $currDiv = $(this)
			,	divUrl = $currDiv.attr('data-url')
			,	dataHeight = $currDiv.attr('data-height')
			,	dataWidth = $currDiv.attr('data-width')
			;
			if(!divUrl) {
				console.log('Error. Incorrect widget configuration.')
			} else {
				if(!dataHeight) {
					dataHeight = '300px';
				}
				if(!dataWidth) {
					dataWidth = '100%';
				}
				var iFrame = $('<iframe width="' + dataWidth + '" height="' + dataHeight + '" src="' + divUrl + '" style="border: 0px solid transparent;">')
				;
				$currDiv.append(iFrame);
			}
		});
	});

}) (jQuery);