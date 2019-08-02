var VideoModule = (function($, URLS){
	
	var videos = []; 
	var categories = [];
	var partners = [];
	var languages = [];

	// For pagination
	var pageSize = 10;
	var totalCount = 0;
	var pageIndex = 0;
	var pages = [];
	
	var selectedTitle = '';
	var selectedTags = '';
	var selectedCategory = '';
	var selectedPartner = '';
	var selectedLanguage= 'en';
	var selectSortAsc='';
	var selectSortDesc='updationTime';
	
	return {
		init : initialize,
		findMappedCategory : findMappedCategory,
		findMappedPartner : findMappedPartner,
		getReadableDate : getReadableDate,
		convertSecondsToMinutes : convertSecondsToMinutes,
		convertBytesToMB : convertBytesToMB
	};
	
	function initialize() {
		$("#video-tags").tagsManager();
		alertBinding();
		bindTitleFilter();
		bindTagsFilter();
		loadLanguages();
		loadCategoriesAndVideos();
	}
	
	// Binding functions for all actionable items (text-boxes, dropdowns, pagination)
	function bindTitleFilter() {
		$('#title-filter-button').off();
		$('#title-filter-button').click(function(e){
			e.preventDefault();
			selectedTitle = $('#title-filter-text').val();
			refreshPage();
		});
	}
	function bindTagsFilter() {
		$('#tags-filter-button').off();
		$('#tags-filter-button').click(function(e){
			e.preventDefault();
			selectedTags = $('#tags-filter-text').val();
			refreshPage();
		});
	}
	function bindCategoriesFilter() {
		$('#categories-filter').off();
		$('#categories-filter').change(function(){
			selectedCategory = $(this).val();
			refreshPage();
		});
	}
	function bindPartnersFilter() {
		$('#partners-filter').off();
		$('#partners-filter').change(function(){
			selectedPartner = $(this).val();
			refreshPage();
		});
	}
	function langChangeBinding() {
		$('#lang-filter').off();
		$('#lang-filter').change(function() {
			selectedLanguage = $(this).val();
			selectedCategory = '';
        	resetPageParams();
			toggleControls();
			loadCategoriesAndVideos();        
    	});
		
	}
	
	
	
	function bindPagingActions() {
		$('#paging-Prev').off();
		$('#paging-Next').off();
		$('#paging-First').off();
		$('#paging-Last').off();
		$('.paging-change').off();
		
		$('#paging-Prev').click(function(e){
			e.preventDefault();
			if($(this).parent().hasClass('disabled')) {
				return;
			}
			previousPage();
			toggleControls();
			loadVideos();
		});
		
		$('#paging-Next').click(function(e){
			e.preventDefault();
			if($(this).parent().hasClass('disabled')) {
				return;
			}
			nextPage();
			toggleControls();
			loadVideos();
		});
		$('#paging-First').click(function(e){
			e.preventDefault();
			if($(this).parent().hasClass('disabled')) {
				return;
			}
			firstPage();
			toggleControls();
			loadVideos();
		});
		$('#paging-Last').click(function(e){
			e.preventDefault();
			if($(this).parent().hasClass('disabled')) {
				return;
			}
			lastPage();
			toggleControls();
			loadVideos();
		});
		
		$('.paging-change').click(function(e){
			e.preventDefault();
			if($(this).parent().hasClass('active')) {
				return;
			}
			moveToPage($(this).text());
			toggleControls();
			loadVideos();
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
	
	function refreshPage() {
		resetPageParams();
		toggleControls();
		loadVideos();
	}
	
	
	
	// Template apply functions start
	function applyVideoTemplate() {
		console.log("applyVideoTemplate() called...");
		var renderedHtml = $("#videoTemplate").tmpl(videos);
		console.log("got the renderedHtml successfully");
		$("#videoBody").html(renderedHtml);
		console.log("end.....");
	}
	
	function applyCategoryTemplate() {
		console.log('applyCategoryTemplate  called.');
		var renderedHtml = $("#categoryTemplate").tmpl(categories);
		$("#categories-filter").html('<option value="">Choose...</option>').append(renderedHtml);
		
	}
	
	function applyLangTemplate() {
		console.log('applyLangTemplate  called.');
		var renderedHtml = $("#langTemplate").tmpl(languages);
		$("#lang-filter").html('<option value="">Choose lang...</option>').append(renderedHtml);
	}
	
	function applyCategoryEditTemplate() {
		var renderedHtml = $("#categoryTemplate").tmpl(categories);
		$("#categories-filter-edit").html(renderedHtml);
		
	}
	function applyPartnerTemplate() {
		console.log('applyPartnerTemplate  called.');
		var renderedHtml = $("#partnerTemplate").tmpl(partners);
		$("#partners-filter").html('<option value="">Choose...</option>').append(renderedHtml);
	}
	
	function applyPageTemplate() {
	    var renderedHtml = $("#pageTemplate").tmpl(pages);
		$("#paging-control").html(renderedHtml);
		
	}
	// Template apply functions end
	
	
	// Utility functions start
	function getReadableDate(millisec) {
			var convertedDate = new Date(millisec);
			return convertedDate.customFormat( "#DD#/#MMM#/#YYYY# #hh#:#mm# #AMPM#" );
	}
	function convertBytesToMB(fileSizeInBytes) {
		var mb = fileSizeInBytes / (1024 * 1024);
		return mb.toFixed(1) + "MB";
	}
	function convertSecondsToMinutes(seconds) {
		var minutes = truncateDecimals(seconds / 60);
		var secs = seconds % 60;
		return minutes + ":" + secs + " mins.";
	}
	function truncateDecimals (number) {
	    return Math[number < 0 ? 'ceil' : 'floor'](number);
	};
	// Utility functions end
	
	
	// Mapping functions for all drop-downs start
	function findMappedCategory(categoryId) {
			var matchedCategory = $.grep(categories, function(e){ return e.categoryId == categoryId; });
			if(matchedCategory.length > 0) {
				return matchedCategory[0].category;
			} else {
				return categoryId;
			}
	}
	function findMappedPartner(id) {
		var matchedPartner = $.grep(partners, function(e){ return e.id == id; });
		if(matchedPartner.length > 0) {
			return matchedPartner[0].name;
		} else {
			return id;
		}
	}
	// Mapping functions end
	
	//private methods (Not exposed to outer scope) - start
	function loadLanguages() {
	    console.log('Load languages called.');
		$.getJSON(URLS.LANGUAGES).done(function(data){
			languages = data;
			applyLangTemplate();
			langChangeBinding();
		}).fail(function(){
				console.log('Fetch failed for categories');
		});
	}
	function loadCategoriesAndVideos() {
	    console.log('Load videos called.');
		$.getJSON(URLS.CATEGORY(selectedLanguage)).done(function(data){
			categories = data;
			applyCategoryTemplate();
			bindCategoriesFilter();
			loadPartners();
		}).fail(function(){
				console.log('Fetch failed for categories');
		});
	}
	function loadPartners() {
		console.log('Load partners called.');
		$.getJSON(URLS.PARTNER).done(function(data){
			partners = data;
			applyPartnerTemplate();
			bindPartnersFilter();
			loadVideos();
		}).fail(function(){
				console.log('Fetch failed for categories');
		});
	}
	function loadVideos() {
		
	    console.log('Load video called. Category length is : '+ categories.length);
		$.getJSON(URLS.VIDEO(pageIndex, pageSize, selectedCategory ,selectedPartner, selectedTitle,selectedLanguage,selectSortAsc,selectSortDesc))
		.done(function(data) {
								if (data.videos == null || data.videos == undefined)
									videos = [];
								else
									videos = data.videos;
								totalCount = data.total;
								updateMaxPageIndex();
								updatePages();
								applyVideoTemplate();
								console.log("going to call applyPageTemplate() .....");
								applyPageTemplate();
								bindPagingActions();
								editVideoClickBinding();
								saveVideoClickBinding();
								toggleControls();
							}
		).fail(function() {
							console.log('Fetch failed for videos');
						}
		);
		
	}
	function toggleControls() {
		$('.spinner').toggle();
		$('#video-complete').toggle();
	}
	function updateMaxPageIndex() {
		maxPageIndex = Math.ceil(totalCount/pageSize);
		if (isNaN(maxPageIndex)) {
			maxPageIndex = 1;
		}
	}
	
	function updatePages() {
		pages = [];
		var prevDisabled = pageIndex==0 ? true : false;
		var nextDisabled = pageIndex==maxPageIndex-1 ? true : false;
		if(totalCount==0) {
			prevDisabled=nextDisabled=true;
		}
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
	        if (pageIndex < maxPageIndex-1) {
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
	//private methods (Not exposed to outer scope) - end
	
	
	// Edit fucntionality starts
	function editVideoClickBinding() {
		$('.editVideo').off();
		$('.editVideo').click(function(e){
			e.preventDefault();
			$('#edit-error-alert').hide();
			resetEditVideoForm();
			$.getJSON(URLS.DETAIL($(this).tmplItem().data.id))
			.done(function(data) {
				fillForm(data);
				$('#myModal').modal();
			})
			.fail(function(){
				console.log("Couldn't get video detail from server.");
				$('#error-alert').show();
			});
			
		});
	}
	
	function resetEditVideoForm() {
		$("#editVideoForm")[0].reset();
		if($('span.tm-tag').length > 0) {
			$("#video-tags").tagsManager('empty');
		}
	}
	function saveVideoClickBinding() {
		$('#saveVideo').off();
		$('#saveVideo').click(function(e){
			e.preventDefault();
			var videoId = $('#videoId').val();
			var matchedVideo = $.grep(videos, function(e){ return e.id == videoId; });
			
			if(matchedVideo.length > 0) {
				
				var objToSend = { id : matchedVideo[0].id };
				
				var isEdited = false;
				
				if ($('#title').val().trim() == "") {
					document.getElementById('editError').innerHTML = 'Title cannot be empty';
					$('#edit-error-alert').show();
					return;
				}
				
				if(matchedVideo[0].title !== $('#title').val()) {
					matchedVideo[0].title = $('#title').val().trim();
					objToSend['title'] = matchedVideo[0].title;
					isEdited = true;
				}
				
				if(!matchedVideo[0].description) {
					matchedVideo[0].description = "";
				}
				
				if(matchedVideo[0].description !== $('#desc').val()) {
					matchedVideo[0].description = $('#desc').val().trim();
					objToSend['longDescription'] = matchedVideo[0].description;
					isEdited = true;
				}
				
				if(matchedVideo[0].categoryId !== $("#categories-filter-edit").val()) {
					objToSend['categoryId'] = $("#categories-filter-edit").val();
					matchedVideo[0].categoryId = $("#categories-filter-edit").val();
					isEdited = true;
				}
				
				var tagValues = $('input[name="hidden-video-tags"]').val();
				tagValues = tagValues=='' ? [] : tagValues.split(';');
				
				if(!_.isEqual(matchedVideo[0].keywords, tagValues)) {
					objToSend['keywords'] = tagValues;
					matchedVideo[0].keywords = tagValues;
					isEdited = true;
				}
				
				if (isEdited) {
					var timestamp = new Date().getTime();
					objToSend['updationTime'] = timestamp;
					matchedVideo[0].updationTime = timestamp;
					
					toggleControls();
					
					$.post(URLS.UPDATE(videoId), JSON.stringify(objToSend))
						.done(function(data) {
							applyVideoTemplate();
							applyPageTemplate();
							bindPagingActions();
							editVideoClickBinding();
							saveVideoClickBinding();
							toggleControls();
							$('#success-alert').show();
					})
						.fail(function(){
							console.log("Video update failed");
							$('#error-alert').show();
					});
					$('#myModal').modal('hide');
				} else {
					document.getElementById('editError').innerHTML = 'Cannot save as no changes made';
					$('#edit-error-alert').show();
				}
					
			} else {
				$('#myModal').modal('hide');
			}
		});
	}
	function fillForm(data) {
		$("#title").val(data.title);
		applyCategoryEditTemplate();
		$("#categories-filter-edit").val(data.categoryId);
		$("#desc").val(data.description);
		$("#url").attr('href',URLS.VIDEO_URL(data.partnerId, data.language, data.sourceId));
		$("#videoId").val(data.id);
		$("#sourceId").val(data.sourceId);
		$("#videosize").val(data.sizeBytes);
		$("#partnerid").val(findMappedPartner(data.partnerId));
		if (data.updationTime) {
			$("#lastupdated").val(getReadableDate(data.updationTime));
		}
		if(typeof data.keywords !== 'undefined' && data.keywords != null) {
			for(var i=0;i<data.keywords.length;i++) {
				$("#video-tags").tagsManager('pushTag',data.keywords[i]);
			}
		}
	}
	// Edit functionality ends
}(jQuery,URLS));