var GalleryCreateModule = (function($, URLS) {
	var categories = [];
	var partners = [];
	var photos = [];
	var selectedLanguage = 'en';
	var Gallery = {
		galleryid : '',
		tags : '',
		partnerid : '',
		category : '',
		title :''
	};
	return {
		init : initialize
	};
	
	//calling order is important
	function initialize() {
		applyLanguageTemplate();
		alertBinding();
		tagsInit();
		fileUploadInit();
		fileUploadBinding();
		loadCategoriesAndPartners();
		languageChangeBinding();
	}
	
	function languageChangeBinding() {
		$('#gallery-language').off();
		$('#gallery-language').change(function() {
			selectedLanguage = $(this).val();
			applyCategoryTemplate();
		});
		
	}
	function tagsInit() {
		$(".tm-input").off();
		var tagsInputLength = $(".tm-input").length;
		for(var i=0;i<tagsInputLength;i++) {
			$(".tm-input:eq("+i+")").tagsManager();
		}
	}
	function loadCategoriesAndPartners() {
		console.log('Load categories called.');
		$.getJSON(URLS.CATEGORY('')).done(function(data) {
			categories = data;
			applyCategoryTemplate();
			loadPartners();
		}).fail(function() {
			console.log('Fetch failed for categories');
		});
	}

	function loadPartners() {
		console.log('Load partners called.');
		$.getJSON(URLS.PARTNER).done(function(data) {
			//filtering ndtv out
			partners = $.grep(data, function (a) { return a.id != 2; });
			applyPartnerTemplate();
		}).fail(function(jqxhr, textStatus, error) {
			console.log('Fetch failed for partners');
		});
	}

	function applyCategoryTemplate() {
		console.log('applyCategoryTemplate  called.');
		var filteredCategories = $.grep(categories, function(data) {
			return selectedLanguage == data.language;
		});
		var renderedHtml = $("#categoryTemplate").tmpl(filteredCategories);
		$("#categories-filter").html('<option value="">Choose Category</option>').append(renderedHtml);
		
	}
	function applyPartnerTemplate() {
		console.log('applyPartnerTemplate  called.');
		var renderedHtml = $("#partnerTemplate").tmpl(partners);
		$("#partners-filter").html('<option value="">Choose Partner</option>').append(renderedHtml);
	}

	function applyLanguageTemplate() {
		var languages = JSON.parse(getLanguages());
		var renderedHtml = $("#languageTemplate").tmpl(languages);
		$("#gallery-language").html(renderedHtml);
	}
	
	function applyPhotoTemplate() {
		var renderedHtml = $("#photoTemplate").tmpl(photos, {	dataArrayIndex: function (item) { return $.inArray(item, photos); },
																partners : partners	
															});
		$("#photoBody").html(renderedHtml);
		$('[id^="photo-partner-"]').val(Gallery.partnerid);
	}
	
	function updateGallery() {
		var tagValue = $('input[name="hidden-gallery-tags"]').val();
		Gallery.tags = tagValue==''? [] : tagValue.split(';');
		Gallery.title = $('#gallery-title').val();
		Gallery.category = $('#categories-filter').val();
		Gallery.partnerid = $('#partners-filter').val();
	}
	
	
	function fileUploadInit() {
		$('.fileupload').fileupload();
	}
	
	function fileUploadBinding() {
		$(".file-upload").off();
		$(".file-upload").click(
				function(e) {
					e.preventDefault();
					
					updateGallery();
					
					//TODO - Replace with a suitable validation plugin
					if(dataIsInvalid()) {
						return;
					}
					
					var data = new FormData();
					data.append("partnerId", Gallery.partnerid);
					data.append("categoryId", Gallery.category);
					for(var i=0;i<fileData.files.length;i++) {
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
	
	function dataIsInvalid() {
		if (Gallery.title=='') {
			alert('Please select a title');
			return true;
		} else if (Gallery.language=='' ) {
			alert('Please select a language');
			return true;
		} else if(fileData.files.length <= 0) {
			alert('Please select a file');
			return true;
		} else  if (Gallery.partnerid=='' || Gallery.category=='') {
			alert('Please select category/partner.');
			return true;
		}
		return false;
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
			Gallery.photos = photos;
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
		setInterval(function() { window.location.href = getContextPath()+"/gallery" ;}, 1500);
	}
	
	function savePhotosClickBinding() {
		$('.save-photos').off();
		$('.save-photos').click(function(e) {
			e.preventDefault();
			for(var i=0;i<photos.length;i++) {
				photos[i].desc = $('#desc-'+i).val();
				var tagValue = $('input[name="hidden-tags-'+i+'"]').val();
				photos[i].keywords = tagValue==''?[] : tagValue.split(';');
				photos[i].partnerid = $("#photo-partner-"+i).val();
				photos[i].category = Gallery.category;
				photos[i].title = Gallery.title;
				photos[i].url = photos[i].thumbnail;
				photos[i].rank = 0;
				photos[i].startdate = 0;
				photos[i].enddate = 0;
				photos[i].isFavourite  = false;
				photos[i].language  = Gallery.language;
				photos[i].deleted  = false;
				photos[i].type = 1;
			}
			Gallery.photos = photos;
			$(".alert").hide();
			$('.spinner').show();
			$.post(URLS.GALLERY_CREATE, JSON.stringify(Gallery))
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

	function setGalleryId() {
		if(Gallery.partnerid!='' && Gallery.category!='') {
			Gallery.galleryid = $.base64.encode(Gallery.partnerid
					+ "-" + Gallery.category + "-"
					+ s4() + s4() + "-" + s4());
		}
	}

	//refer http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
	//TODO move to utils
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16)
				.substring(1);
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