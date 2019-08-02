$(function() {
	$('#topimage_info').ajaxForm(function(res) {
		
		if (res.indexOf("failed") === -1) {
			$('#tab_image').html(res);
			$('#img_upload_res').text('Image uploaded successfully.');
		} else {
			$('#img_upload_res').text('Image could not be uploaded.');
		}
	});
});
