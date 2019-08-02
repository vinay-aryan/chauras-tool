var GalleryCopyModule = (function($, URLS) {
	var categories = [];
	var partners = [];
	var photos = [];
	var languages = [];
	var selectedLanguage = '';
	var Gallery = {
//		galleryid : '',
//		tags : '',
//		partnerid : '',
//		category : '',
//		title :''
	};
	var galleryId = '';
	return {
		init : initialize
	};
	
	//calling order is important
	function initialize() {
		
		alertBinding();
		
		//update gallery id on load
		var locationArray = location.pathname.split('/');
		galleryId = locationArray[locationArray.length-2];
		
		languages = JSON.parse(getLanguages());
		categories = JSON.parse(getAllCategories());
		//removing ndtv
		partners = $.grep(JSON.parse(getPartners()), function (a) { return a.id != 2; });
		loadGallery();
		copyGalleryClickBinding();
	}
	
	function loadGallery() {
		
		$.getJSON(URLS.GALLERY_BY_ID(galleryId)).done(function(data) {
			
			//order is important
			$('#gallery-title').val(data.title);

			applyLanguageTemplate();
			selectedLanguage = data.language;
			$('#languages-filter').val(selectedLanguage);
			languageUpdateBinding();
			
			applyCategoryTemplate();
			$('#categories-filter').val(data.category);
			
			applyPartnerTemplate();
			$('#partners-filter').val(data.partnerid);
			
			toggleUI();
		}).fail(function(jqxhr, textStatus, error) {
			console.log('Fetch failed for gallery');
			
		});
	}
	
	function toggleUI() {
		$('.spinner').toggleClass('hide');
		$('#main-container').toggleClass('hide');
	}
	function copyGalleryClickBinding() {
		
		$('.copy-gallery').off();
		$('.copy-gallery').click(function(e){
			e.preventDefault();
			toggleUI();
			var obj ={};
			var titleVal = $('#gallery-title').val().trim();
			if(titleVal == '' || $('#categories-filter').val() == '' || $('#languages-filter').val() == '' || $('#partners-filter').val() == '') {
				alert("Title or category or partner or language cannot be empty.");
				toggleUI();
				return;
			}
			obj['title']=titleVal;
			obj['partnerid']=$('#partners-filter').val();
			obj['language']=$('#languages-filter').val();
			obj['category']=$('#categories-filter').val();
			
			$.post(URLS.GALLERY_COPY(galleryId), JSON.stringify(obj))
				.done(function(data) {
					bootstrapAlert('success', 'Copy was successful. Redirecting to gallery home.');
					redirectToHome();
				})
				.fail(function(){
					console.log("Update to database/search engine failed");
					$('#error-alert').show();
					redirectToHome();
			});
		});
	}
	function languageUpdateBinding() {
		$('#languages-filter').off();
		$('#languages-filter').change(function(){
			selectedLanguage = $(this).val();
			applyCategoryTemplate();
		});
		
	}

	function applyCategoryTemplate() {
		console.log('applyCategoryTemplate  called.');
		var filteredCategories = $.grep(categories, function(data) {
			if(selectedLanguage==''){
				return true;
			}
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
		console.log('applyLanguageTemplate  called.');
//		var filteredLang = $.grep(languages, function(lang){
//			if(lang.id=='en' || lang.id=='hi') {
//				return true;
//			}
//			return false;
//		});
		var renderedHtml = $("#languageTemplate").tmpl(languages);
		$("#languages-filter").html('<option value="">Choose Language</option>').append(renderedHtml);
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
	
	function redirectToHome() {
		setInterval(function() { window.location.href = getContextPath()+"/gallery" ;}, 1500);
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