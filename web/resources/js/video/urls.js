var URLS = (function() {
	var domain = location.protocol+"//"+window.location.host;
	var contextPath = getContextPath();
		
	return {
		UPDATE : function(videoId) {
			return domain + contextPath + "/video/update/" + videoId;
		},				
		
		DETAIL : function(videoId) {
			return domain + contextPath + "/video/details?id=" + videoId;
		},
		
		VIDEO_URL : function(cpId, lang, sourceId) {
			return getVideoCDNUrl() + "/" + cpId + "/" + lang + "/" + sourceId + "/" + "lh.3gp";
		},
		
		VIDEO : function(pageIndex, pageSize, categoryid, partnerid, title, language,sortAsc,sortDesc) {
					var categoryParam = "";
					var videoParam ="";
					var partnerParam = "";
					var titleParam ="";
					var langParam ="";
					var pageParam="";
					var sortAscParam="";
					var sortDescParam="";
					if(isNotUndefinedOrEmptyOrNull(categoryid)) {
						categoryParam = "&cat="+categoryid;
					}
					if(isNotUndefinedOrEmptyOrNull(partnerid)) {
						partnerParam = "&partner_id="+partnerid;
					}
					if(isNotUndefinedOrEmptyOrNull(title)){
						titleParam="&s="+title;
					}
					if(isNotUndefinedOrEmptyOrNull(language)){
						langParam="&lang="+language;
					}
					if(isNotUndefinedOrEmptyOrNull(pageIndex) && isNotUndefinedOrEmptyOrNull(pageSize)) {
						pageParam = "&pos="+ pageIndex*pageSize +"&n="+pageSize;
					}
					if(isNotUndefinedOrEmptyOrNull(sortAsc)) {
						sortAscParam = "&sort_asc="+ sortAsc;
					}
					if(isNotUndefinedOrEmptyOrNull(sortDesc)) {
						sortDescParam = "&sort_desc="+ sortDesc;
					}
					return domain + contextPath +"/video/search?"+pageParam+categoryParam+videoParam+partnerParam+titleParam+langParam+sortAscParam+sortDescParam;
				  },

		CATEGORY : function(language) {
					 var langParam="";
					 if(isNotUndefinedOrEmptyOrNull(language)){
						langParam="&lang="+language;
				 	 }
					 return domain + contextPath + "/video/categories?"+langParam;
				   },
				   
	   LANGUAGES : domain + contextPath + "/video/languages",
				   
		PARTNER : domain + contextPath + "/image/partners"
		
	};
	
	function isNotUndefinedOrEmptyOrNull(data) {
		return typeof data !== 'undefined' && data!= null && data!=='';
	}
}());