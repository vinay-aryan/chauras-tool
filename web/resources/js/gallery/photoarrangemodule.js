var PhotoArrangeModule = (function($, URLS){
	
	var photos = []; 
	var MAX_PHOTO_COUNT = 1000;
	var galleryid = '';
	return {
		init : initialize,
		getReadableDate : getReadableDate
		
	};
	function getReadableDate(millisec) {
			var convertedDate = new Date(millisec);
			return convertedDate.customFormat( "#DD#/#MMM#/#YYYY# #hh#:#mm# #AMPM#" );
	}
	
	function setGalleryId() {
		//location.pathname = "/tool/gallery/MS04NTE0/photos"
		//location.pathname.split("/") = ["", "tool", "gallery", "MS04NTE0", "photos"]
		var pathNameArray = location.pathname.split("/");
		var galleryIdLocation = pathNameArray.indexOf("gallery") + 1;
		galleryid = pathNameArray[galleryIdLocation];
	}
	function initialize() {
		alertBinding();
		setGalleryId();
		goBackBinding();
		saveArrangementClickBinding();
		loadPhotos();
	}
	function alertBinding(){
		$(' #success-alert button' ).off();
		$(' #error-alert button' ).off();
		$(' #success-alert button' ).click(function(){
			$('#success-alert').hide();
		});
		$(' #error-alert button' ).click(function(){
			$('#error-alert').hide();
		});
	}
	function saveArrangementClickBinding() {
		$('.save-arrangement').off();
		$('.save-arrangement').click(function(e){
			e.preventDefault();
			$.post(URLS.GALLERY_PHOTOS, JSON.stringify({galleryid : galleryid, photos : photos}))
					.done(function(data) {
						$('#success-alert').show();
				})
				.fail(function(){
						console.log("Photo arrangement failed");
						$('#error-alert').show();
			});
			
		});
	}
	function goBackBinding() {
		$('.go-back').off();
		$('.go-back').click(function(e){
			e.preventDefault();
			window.location.href = getContextPath()+"/gallery/"+galleryid+"/photos" ;
		});
	}
	function imageClickBinding() {
		$('a.thumbnail').off();
		$('a.thumbnail').click(function(e){
			e.preventDefault();
			var obj = {};
			var index1 = -1;
			$('a.thumbnail').each(function(index, value){
				if($(value).hasClass('selected-pic')) {
					obj = value;	
					index1=index;			
				}
			});
			if(Object.keys(obj).length === 0) {
				$(this).addClass('selected-pic');
				$('.alert-info').html('Now click the image you want to place it before.');
			} else {
			    $('.alert-info').html('Click the image which you want to re-position.');
				var index2 = $("a.thumbnail").index(this);
				if(index1==index2) {
					$(this).removeClass('selected-pic');
					return;
				}
				//splice
				var elementAtIndex1 = photos[index1];

				photos.splice(index1,1);

				if(index1-index2 > 0) {
				    photos.splice(index2,0,elementAtIndex1);
				} else {
				    photos.splice(index2-1,0,elementAtIndex1);
				}
				applyPhotoTemplate();
				imageClickBinding();
				
			}
			
		});
	}
	
	function applyPhotoTemplate() {
		var renderedHtml = $("#photoTemplate").tmpl(photos);
		$("#photoBody").html(renderedHtml);
	}
	
	//private methods : Not exposed to outer scope
	function loadPhotos() {
	    console.log('Load photos called.');
	    //assuming no gallery will have more than 1000 photos
		$.getJSON(URLS.PHOTO(0, MAX_PHOTO_COUNT, galleryid)).done(function(data){
			photos = data.photos;
			applyPhotoTemplate();
			imageClickBinding();
			toggleControls();
		}).fail(function(){
				console.log('Fetch failed for photos');
		});
	}
	function toggleControls() {
		$('.spinner').toggle();
		$('#photo-complete').toggle();
	}
}(jQuery,URLS));