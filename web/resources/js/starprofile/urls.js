var URLS = (function() {
	var domain = location.protocol+"//"+window.location.host;
	var contextPath = getContextPath();
		
	return {
		STARPROFILE :function(pageIndex, pageSize, name, featured, type) {
						var pageParam="";
						var nameParam="";
						var featuredParam="";
						var typeParam="";
						if(isNotUndefinedOrEmptyOrNull(pageIndex) && isNotUndefinedOrEmptyOrNull(pageSize)) {
							pageParam = "?&pos="+ pageIndex*pageSize +"&n="+pageSize;
						}
						if(isNotUndefinedOrEmptyOrNull(name)){
							nameParam="&name="+name;
						}
						if(isNotUndefinedOrEmptyOrNull(featured)){
							featuredParam="&featured="+featured;
						}
						if(isNotUndefinedOrEmptyOrNull(type)){
							typeParam="&type="+type;
						}
						return domain + contextPath + "/star/profiles" + pageParam + nameParam + featuredParam + typeParam;
					},
		STARPROFILEPOLITICIAN :function(pageIndex, pageSize, name, featured) {
						var pageParam="";
						var nameParam="";
						var featuredParam="";
						var typeParam="";
						if(isNotUndefinedOrEmptyOrNull(pageIndex) && isNotUndefinedOrEmptyOrNull(pageSize)) {
							pageParam = "?&pos="+ pageIndex*pageSize +"&n="+pageSize;
						}
						if(isNotUndefinedOrEmptyOrNull(name)){
							nameParam="&name="+name;
						}
						if(isNotUndefinedOrEmptyOrNull(featured)){
							featuredParam="&featured="+featured;
						}

						return domain + contextPath + "/star/profiles/politician" + pageParam + nameParam + featuredParam;
					},
 
		STARPROFILE_COUNT : domain + contextPath + "/star/profiles/size",
		
		CONTEXT_PATH : contextPath,
		CREATE_OR_UPDATE : domain + contextPath + "/star/profiles",
		PARTNER : domain + contextPath + "/image/partners",
		PROFILE_EXISTS : function(name){
							return domain + contextPath + "/star/profiles/exists?name="+name;
						 }
	};
	
	function isNotUndefinedOrEmptyOrNull(data) {
		return typeof data !== 'undefined' && data!= null && data!=='';
	}
}());