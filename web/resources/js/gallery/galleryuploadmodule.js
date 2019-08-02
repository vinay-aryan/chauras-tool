var GalleryEditModule = (function($, URLS) {
	var categories = [];
	var partners = [];
	var photos = [];
	var selectedLanguage = 'en';
	var Gallery = {
	};
	var galleryid ='';
	return {
		init : initialize
	};
	
	//calling order is important
	function initialize() {
		alertBinding();
		setGalleryId();
		fileUploadInit();
		fileUploadBinding();
		loadGallery();
	}
	
	function setGalleryId() {
		var pathNameArray = location.pathname.split("/");
		var galleryIdLocation = pathNameArray.indexOf("gallery") + 1;
		galleryid = pathNameArray[galleryIdLocation];
	}
	
	function tagsInit() {
		$(".tm-input").off();
		var tagsInputLength = $(".tm-input").length;
		for(var i=0;i<tagsInputLength;i++) {
			$(".tm-input:eq("+i+")").tagsManager();
		}
	}
	
	function loadGallery() {
		console.log('Load gallery called.');
		$.getJSON(URLS.PHOTO(0,1, galleryid)).done(function(data) {
			Gallery = data;
		}).fail(function(jqxhr, textStatus, error) {
			console.log('Fetch failed for gallery.');
		});
	}
	
	function applyPhotoTemplate() {
		var renderedHtml = $("#photoTemplate").tmpl(photos, { dataArrayIndex: function (item) { return $.inArray(item, photos); } });
		$("#photoBody").html(renderedHtml);
	}
	
	function fileUploadInit() {
		$('.fileupload').fileupload();
	}

	function fileUploadBinding() {
		$(".file-upload").off();
		$(".file-upload").click(
				function(e) {
					e.preventDefault();
					var numberOfFiles = fileData.files.length;
					if(numberOfFiles <= 0) {
						alert('Please select a file');
						return;
					}
					
					var data = new FormData();
					data.append("partnerId", Gallery.partnerid);
					data.append("categoryId", Gallery.category);
					for(var i=0;i<numberOfFiles;i++) {
						data.append("fileData", fileData.files[i]);
					}
					
					$('.spinner').show();
					$.ajax({
						url : URLS.GALLERY_UPLOAD,
						type : "POST",
						data : data,
						headers : {
							Accept : "application/json",
						},
						processData : false,
						contentType : false,
						success : function(response) {
							bootstrapAlert('success', 'Please provide meta information and press save to complete the upload.');
							console.log(response);
							photos = response;
							applyPhotoTemplate();
							tagsInit();
							savePhotosClickBinding();
							deletePhotosClickBinding();
							$('.spinner').hide();
							$('#upload-form').hide();
							$('#photo-complete').show();
						},
						error : function(jqXHR, textStatus, errorMessage) {
							console.log("File upload failed");
							$('.spinner').hide();
							$('#error-alert').show();
							$('.fileupload').fileupload('clear');
						}
					});
				});
	}

	function resetUploadForm() {
		$('#upload-form')[0].reset();
		$('span.tm-tag').remove();
		$('input[name="hidden-gallery-tags"]').val('');
	}
	
	function bootstrapAlert(type, message) {
		if(type=='success') {
			$('#success-alert').html('<button type="button" class="close" data-dismiss="alert">x</button>'+message);
			alertBinding();
			$('#success-alert').show();
		} else if(type == 'error'){
			$('#error-alert').show();
		}
	}
	function deletePhotosClickBinding() {
		$('.delete-photos').off();
		$('.delete-photos').click(function(e) {
			e.preventDefault();
			$(".alert").hide();
			$('.spinner').show();
			$.ajax({
	            type: 'post',
	            url: URLS.GALLERY_DELETE,
	            data: JSON.stringify({"photoDtos" : photos}),
	            contentType: "application/json",
	            success: function (data) {
	            	$('#photo-complete').hide();
	            	bootstrapAlert('success', 'Photos deleted successfully.');
	            	redirectToHome();
	            },
	            error: function(a,b,c) {
	            	console.log("Photo deletion failed.");
	            	$('#photo-complete').hide();
					$('#error-alert').show();
					redirectToHome();
	            }
	        });
		});
	}
	
	function redirectToHome() {
		setInterval(function() { window.location.href = getContextPath()+"/gallery/"+galleryid+"/photos" ;}, 1500);
	}
	
	function savePhotosClickBinding() {
		$('.save-photos').off();
		$('.save-photos').click(function(e) {
			e.preventDefault();
			for(var i=0;i<photos.length;i++) {
				photos[i].desc = $('#desc-'+i).val();
				var tagValue = $('input[name="hidden-tags-'+i+'"]').val();
				photos[i].keywords = tagValue==''?[] : tagValue.split(';');
				photos[i].partnerid = Gallery.photos[0].partnerid;
				photos[i].category = Gallery.photos[0].category;
				photos[i].title = Gallery.title;
				photos[i].url = photos[i].thumbnail;
				photos[i].rank = 0;
				photos[i].startdate = 0;
				photos[i].enddate = 0;
				photos[i].isFavourite  = false;
				photos[i].language  = Gallery.photos[0].language;
				photos[i].deleted  = false;
				photos[i].type = 1;
			}
			$(".alert").hide();
			$('.spinner').show();
			$.post(URLS.GALLERY_PHOTO_UPLOAD(galleryid), JSON.stringify(photos))
					.done(function(data) {
						$('#photo-complete').hide();
						bootstrapAlert('success', 'Upload was successful.');
						redirectToHome();
				})
				.fail(function(){
					$('#photo-complete').hide();
					console.log("Update to database/search engine failed");
					$('#error-alert').show();
					redirectToHome();
			});

		});
	}

	function alertBinding() {
		$(' #success-alert button').off();
		$(' #error-alert button').off();
		$(' #success-alert button').click(function() {
			$('#success-alert').hide();
		});
		$(' #error-alert button').click(function() {
			$('#error-alert').hide();
		});
	}
}(jQuery, URLS));