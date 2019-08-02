var PhotoModule = (function($, URLS){
	
	var photos = []; 
	var totalCount = 0;
	var pageIndex = 0;
	var pageSize = 10;
	var pages = [];
	var coverPhotoId='';
	
	var galleryid = '';
	return {
		init : initialize,
		getReadableDate : getReadableDate,
		shouldBeDisabled :shouldBeDisabled
		
	};
	function getReadableDate(millisec) {
			var convertedDate = new Date(millisec);
			return convertedDate.customFormat( "#DD#/#MMM#/#YYYY# #hh#:#mm# #AMPM#" );
	}
	function shouldBeDisabled(photoid) {
		if(photoid==coverPhotoId) {
			return true;
		} 
		return false;
	}
	function editPhotoClickBinding() {
		$('.editPhoto').off();
		$('.editPhoto').click(function(e){
			e.preventDefault();
			resetEditPhotoForm();
			var data = $(this).tmplItem().data;
			fillForm(data);
			$('#myModal').modal();
		});
	}
	function resetEditPhotoForm() {
		$('#editPhotoForm')[0].reset();
		if($('span.tm-tag').length > 0) {
			$("#photo-tags").tagsManager('empty');
		}
	}
	function fillForm(data) {
		$("#description").val(data.desc);
		$('#photoid').val(data._id);
		if(typeof data.keywords !== 'undefined' && data.keywords != null) {
			for(var i=0;i<data.keywords.length;i++) {
				$("#photo-tags").tagsManager('pushTag',data.keywords[i]);
			}
		}
	}
	function disabledBinding() {
		$('.disabled').off();
		$('.disabled').click(function(e){
			e.preventDefault();
		});
	}
	function savePhotoClickBinding() {
		$('#savePhoto').off();
		$('#savePhoto').click(function(e){
			e.preventDefault();
			var photoid = $('#photoid').val();
			var matchedPhoto = $.grep(photos, function(e){ return e._id == photoid; });
			if(matchedPhoto.length > 0) {
				matchedPhoto[0].desc = $('#description').val();
				var tagValue = $('input[name="hidden-photo-tags"]').val();
				matchedPhoto[0].keywords = tagValue==''?[] : tagValue.split(';');
				matchedPhoto[0].galleryid = galleryid; 
				toggleControls();
				$.post(URLS.PHOTO(), JSON.stringify(matchedPhoto[0]))
				.done(function(data) {
					$('#success-alert').show();
					applyPhotoTemplate();
					makeCoverClickBinding();
					makeInactiveClickBinding();
					editPhotoClickBinding();
					savePhotoClickBinding();
					disabledBinding();
					toggleControls();
				})
					.fail(function(){
						console.log("Make inactive/active update failed");
						$('#error-alert').show();
				});
					
			}
			$('#myModal').modal('hide');
		});
	}
	function bindPagingActions() {
		$('#paging-Prev').off();
		$('#paging-Next').off();
		$('.paging-change').off();
		$('#paging-First').off();
		$('#paging-Last').off();
		$('#paging-Prev').click(function(e){
			e.preventDefault();
			//TODO - Stop click if disabled
			if($(this).parent().hasClass('disabled')) {
				return;
			}
			previousPage();
			toggleControls();
			loadPhotos();
		});
		
		$('#paging-Next').click(function(e){
			e.preventDefault();
			//TODO - Stop click if disabled
			if($(this).parent().hasClass('disabled')) {
				return;
			}
			nextPage();
			toggleControls();
			loadPhotos();
		});
		$('#paging-First').click(function(e){
			e.preventDefault();
			if($(this).parent().hasClass('disabled')) {
				return;
			}
			firstPage();
			toggleControls();
			loadPhotos();
		});
		$('#paging-Last').click(function(e){
			e.preventDefault();
			if($(this).parent().hasClass('disabled')) {
				return;
			}
			lastPage();
			toggleControls();
			loadPhotos();
		});
		$('.paging-change').click(function(e){
			e.preventDefault();
			if($(this).parent().hasClass('active')) {
				return;
			}
			moveToPage($(this).text());
			toggleControls();
			loadPhotos();
		});
	}
	function setGalleryId() {
		//location.pathname = "/tool/gallery/MS04NTE0/photos"
		//location.pathname.split("/") = ["", "tool", "gallery", "MS04NTE0", "photos"]
		var pathNameArray = location.pathname.split("/");
		var galleryIdLocation = pathNameArray.indexOf("gallery") + 1;
		galleryid = pathNameArray[galleryIdLocation];
	}
	function initialize() {
		$("#photo-tags").tagsManager();
		alertBinding();
		fileUploadLook();
		fileUploadBinding();
		setGalleryId();
		loadTotalCountAndPhotos();
	}
	function fileUploadLook() {
		$('.fileupload').fileupload();
	}
	
	function fileUploadBinding() {
		$(".file-upload").click(function (e){
			e.preventDefault();
			if(fileData.files.length <= 0) {
				alert('Please select a file first');
				return;
			}
			
			var data = new FormData();
			data.append("galleryId", galleryid);
			data.append("fileData",fileData.files[0]);

		    $.ajax({
		       url: URLS.GALLERY_UPLOAD,
		       type: "POST",
		       data: data,
		       processData: false,
		       contentType: false,
		       success: function(response) {
		    	   $('#success-alert').show();
		    	   $('.fileupload').fileupload('clear');
		       },
		       error: function(jqXHR, textStatus, errorMessage) {
		    	   console.log("File upload failed");
		    	   $('#error-alert').show();
		    	   $('.fileupload').fileupload('clear');
		       }
		    });
		 });
	}
	function makeInactiveClickBinding() {
		$('.makeActiveOrInactive').off();
		$('.makeActiveOrInactive').click(function(e){
			e.preventDefault();
			var data = $(this).tmplItem().data;
			var sure = confirm('Are you sure you want to soft delete/undelete this photo?');
			if(sure) {
				var photoid = data._id;
				if(photoid == coverPhotoId) {
					alert("Can not delete coverphotoid. Please choose a different photo.");
				}
				var matchedPhoto = $.grep(photos, function(e){ return e._id == photoid; });
				var deleteStatus = !matchedPhoto[0].deleted;
				matchedPhoto[0].deleted = deleteStatus;
				matchedPhoto[0].galleryid = galleryid; 
				//$.post(URLS.PHOTO(), JSON.stringify({ galleryid : galleryid, _id : photoid, deleted : deleteStatus}))
				$.post(URLS.PHOTO(), JSON.stringify( matchedPhoto[0]))
					.done(function(data) {
						$('#success-alert').show();
						applyPhotoTemplate();
						makeCoverClickBinding();
						makeInactiveClickBinding();
						editPhotoClickBinding();
						savePhotoClickBinding();
						disabledBinding();
				})
					.fail(function(){
						console.log("Make inactive/active update failed");
						$('#error-alert').show();
				});
			} 
			return;
		});
	}
	
	function makeCoverClickBinding() {
		$('.makeCover').off();
		$('.makeCover').click(function(e){
			e.preventDefault();
			var data = $(this).tmplItem().data;
			var sure = confirm('Are you sure you want this photo as cover?');
			if(sure) {
				var newCoverId = data._id;
				var newThumbnail = data.thumbnail;
				$.post(URLS.GALLERY(), JSON.stringify({ galleryid : galleryid, coverphotoid : newCoverId, thumbnail : newThumbnail}))
					.done(function(data) {
						$('#success-alert').show();
						coverPhotoId = newCoverId;
						applyPhotoTemplate();
						makeCoverClickBinding();
						makeInactiveClickBinding();
						editPhotoClickBinding();
						savePhotoClickBinding();
						disabledBinding();
				})
					.fail(function(){
						console.log("Cover update failed");
						$('#error-alert').show();
				});
			} 
			return;
		});
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
	
	function applyPhotoTemplate() {
		var renderedHtml = $("#photoTemplate").tmpl(photos);
		$("#photoBody").html(renderedHtml);
	}
	
	function applyPageTemplate() {
	    var renderedHtml = $("#pageTemplate").tmpl(pages);
		$("#paging-control").html(renderedHtml);
		
	}
	function loadTotalCountAndPhotos() {
		console.log('loadTotalCount called.');
	    
		$.getJSON(URLS.GALLERY_SIZE(galleryid)).done(function(data){
			totalCount = data;
			loadPhotos();
		}).fail(function(){
				console.log('Fetch failed for photos');
		});
	}
	//private methods : Not exposed to outer scope
	function loadPhotos() {
	    console.log('Load photos called.');
	    
		$.getJSON(URLS.PHOTO(pageIndex, pageSize, galleryid)).done(function(data){
			if(typeof data === 'undefined' || typeof data.photos === 'undefined' || data.photos.length <=0) {
				nophotosfound();
			} else {
				photos = data.photos;
				coverPhotoId = data.coverphotoid;
				updateMaxPageIndex();
				updatePages();
				applyPhotoTemplate();
				applyPageTemplate();
				bindPagingActions();
				makeCoverClickBinding();
				makeInactiveClickBinding();
				editPhotoClickBinding();
				savePhotoClickBinding();
				disabledBinding();
				alertBinding();
				toggleControls();
			}
		}).fail(function(){
				console.log('Fetch failed for photos');
				nophotosfound();
		});
	}
	function nophotosfound() {
		$('.spinner').hide();
		$('.table').hide();
		$('#photo-arrange').hide();
		$('#no-data').show();
	}
	function toggleControls() {
		$('.spinner').toggle();
		$('#photo-complete').toggle();
	}
	function updateMaxPageIndex() {
		maxPageIndex = Math.ceil(totalCount/pageSize);
	}
	
	function updatePages() {
		pages = [];
		var prevDisabled = pageIndex==0 ? true : false;
		var nextDisabled = pageIndex==maxPageIndex-1 ? true : false;
		var isActive = false;
		pages.push({text : 'First', disabled : prevDisabled});
		pages.push({text : 'Prev', disabled : prevDisabled});
        
        for (i = pageIndex; i <= pageIndex+4 && i < maxPageIndex ; i++) {
        	if(i == pageIndex) {
        		isActive = true;
        	}
	        pages.push({ pageNumber: (i + 1) , text: (i+1), active : isActive });
	        isActive = false;
	    }
	    
	    pages.push({text : 'Next', disabled : nextDisabled});
	    pages.push({text : 'Last', disabled : nextDisabled});
	}
	function previousPage() { 
			if (pageIndex > 0) { 
				pageIndex = pageIndex - 1; 
			}
			
	}
	function nextPage() {
	        if (pageIndex < maxPageIndex) {
	            pageIndex = pageIndex + 1;
	        }
	        
	}
	function firstPage() {
        if (pageIndex > 0) {
            pageIndex = 0;
        }
	}
	function lastPage() {
        if (pageIndex < maxPageIndex-1) {
            pageIndex = maxPageIndex-1;
        }
	}
	function resetPageParams() {
	    pageIndex = totalCount = 0;
	    pageSize = 10;
	}
	function  moveToPage(index) {
	        pageIndex = parseInt(index) - 1;
	}
}(jQuery,URLS));