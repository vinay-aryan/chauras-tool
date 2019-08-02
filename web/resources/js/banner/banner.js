$(function() {
	$( "#bannerSave" ).on( "click", function() {
		event.preventDefault();
		
		var result = $('#banner_basic_info');
		
		if(result) {
			
			var data = {
					'siteId' : $('#siteId').val(),
					'lowAUrl' : $('#lowAImage').val(),
					'lowBUrl' : $('#lowBImage').val(),
					'midUrl' : $('#middleImage').val(),
					'smartUrl' : $('#smartImage').val(),
					'superSmartImageUrl' : $('#superSmartImage').val(),
					'circle' : $('#circle').val(),
					'id' : $('#count').val(),
					'lowLinkUrl' : $('#lowLinkUrl').val(),
					'midLinkUrl' : $('#midLinkUrl').val(),
					'Url' : $('#Url').val(),
					'superSmartLinkUrl' : $('#superSmartLinkUrl').val(),
					'publisher_lowA': $('#publisher_lowA').val(),
					'publisher_lowB': $('#publisher_lowB').val(),
					'publisher_mid': $('#publisher_mid').val(),
					'publisher_smart': $('#publisher_smart').val(),
					'publisher_superSmart': $('#publisher_superSmart').val()
					};
			var val = [];
	         $(':checkbox:checked').each(function(i){
	           val[i] = $(this).val();
	          });
	         
	         var language = val.toString();
			 data['language']=language;
			 
			$.post('banner/basic/save/', data, function(res) {
				if (res.indexOf("FAILEDEDIT") === -1) {
					document.getElementById("banner_result_basic_info").innerHTML="Edited succesfully";
					$('#banner_upload').hide();
					$('#bannerSave').hide();
				} else {
					document.getElementById("banner_result_basic_info").innerHTML="Editing Failed";
					$('#bannerSave').hide();
					
				}
			});
		}

	});
	
	

});

