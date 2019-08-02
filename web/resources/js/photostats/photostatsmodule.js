var PhotoStatsModule = (function($, URLS){
	
	var photostats = [];
	var partners = [];
	var totalCount = 10;
	var pageIndex = 0;
	var pageSize = 10;
	var pages = [];
	var selectedName = '';
	var isFeatured = '';
	return {
		init : initialize,
		getReadableDate : getReadableDate
	};

	function initialize() {
		loadStats();
	}
	function getReadableDate(millisec) {
		var convertedDate = new Date(millisec);
		return convertedDate.customFormat( "#DD#/#MMM#/#YYYY# #hh#:#mm# #AMPM#" );
	}
	function loadStats() {
		console.log('Load stats called.');
		$.getJSON(URLS.STATS(pageIndex, pageSize)).done(function(response){
			totalCount = response.count;
			photostats = response.stats;
			updateMaxPageIndex();
			updatePages();
			applyPhotoStatsTemplate();
			applyPageTemplate();
			bindPagingActions();
			toggleControls();
		}).fail(function(){
				console.log('Fetch failed for profiles.');
		});
	}
	
	function toggleControls() {
		$('.spinner').toggle();
		$('#photostats-complete').toggle();
	}
	
	function applyPhotoStatsTemplate() {
	    var renderedHtml = $("#photostatsTemplate").tmpl(photostats);
		$("#photostatsBody").html(renderedHtml);
		
	}
	
	function applyPageTemplate() {
	    var renderedHtml = $("#pageTemplate").tmpl(pages);
		$("#paging-control").html(renderedHtml);
		
	}
	
	function updateMaxPageIndex() {
		maxPageIndex = Math.ceil(totalCount/pageSize);
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
			loadStats();
		});
		
		$('#paging-Next').click(function(e){
			e.preventDefault();
			if($(this).parent().hasClass('disabled')) {
				return;
			}
			nextPage();
			toggleControls();
			loadStats();
		});
		$('#paging-First').click(function(e){
			e.preventDefault();
			if($(this).parent().hasClass('disabled')) {
				return;
			}
			firstPage();
			toggleControls();
			loadStats();
		});
		$('#paging-Last').click(function(e){
			e.preventDefault();
			if($(this).parent().hasClass('disabled')) {
				return;
			}
			lastPage();
			toggleControls();
			loadStats();
		});
		
		$('.paging-change').click(function(e){
			e.preventDefault();
			if($(this).parent().hasClass('active')) {
				return;
			}
			moveToPage($(this).text());
			toggleControls();
			loadStats();
		});
	}
	
}(jQuery,URLS));