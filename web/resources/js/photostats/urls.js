var URLS = (function() {
	var domain = location.protocol+"//"+window.location.host;
	var contextPath = getContextPath();
		
	return {
		STATS :function(pageIndex, pageSize) {
						var pageParam="";
						var nameParam="";
						var featuredParam="";
						if(isNotUndefinedOrEmptyOrNull(pageIndex) && isNotUndefinedOrEmptyOrNull(pageSize)) {
							pageParam = "?&pos="+ pageIndex*pageSize +"&n="+pageSize;
						}
						return domain + contextPath + "/monitor/photos" + pageParam;
					},
		STATS_COUNT : domain + contextPath + "/monitor/photos/size",
		
		CONTEXT_PATH : contextPath,
	};
	
	function isNotUndefinedOrEmptyOrNull(data) {
		return typeof data !== 'undefined' && data!= null && data!=='';
	}
}());