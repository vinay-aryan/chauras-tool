var URLS = (function() {
	var domain = location.protocol+"//"+window.location.host;
	var contextPath = getContextPath();
		
	return {
		GALLERY_PHOTO_UPLOAD : function(galleryid) {
									return  domain + contextPath +"/image/galleries/"+galleryid+"/upload"
								},
		GALLERY_DELETE : domain + contextPath +"/image/galleries/photos/delete",
		GALLERY_CREATE : domain + contextPath +"/image/galleries/create",
		GALLERY_UPLOAD :  domain + contextPath +"/image/galleries/photos/upload",
		GALLERY_SIZE : function(galleryid) {
							return domain + contextPath +"/image/galleries/"+galleryid+"/size";
						},
		GALLERY_PHOTOS : domain + contextPath +"/image/galleries/photos",
		GALLERY : function(pageIndex, pageSize, categoryid, galleryid, partnerid, title, language, sortKey, sortVal) {
					var categoryParam = "";
					var partnerParam = "";
					var galleryParam ="";
					var titleParam ="";
					var langParam ="";
					var pageParam="";
					var sortKeyParam="";
					var sortValParam="";
					if(isNotUndefinedOrEmptyOrNull(sortKey)) {
						sortKeyParam = "&sortKey="+sortKey;
					}
					if(isNotUndefinedOrEmptyOrNull(sortVal)) {
						sortValParam = "&sortVal="+sortVal;
					}
					if(isNotUndefinedOrEmptyOrNull(categoryid)) {
						categoryParam = "&categoryid="+categoryid;
					}
					if(isNotUndefinedOrEmptyOrNull(galleryid)) {
						galleryParam = "&galleryid="+galleryid;
					}
					if(isNotUndefinedOrEmptyOrNull(partnerid)) {
						partnerParam = "&partnerid="+partnerid;
					}
					if(isNotUndefinedOrEmptyOrNull(partnerid)) {
						partnerParam = "&partnerid="+partnerid;
					}
					if(isNotUndefinedOrEmptyOrNull(title)){
						titleParam="&title="+title;
					}
					if(isNotUndefinedOrEmptyOrNull(language)){
						langParam="&lang="+language;
					}
					if(isNotUndefinedOrEmptyOrNull(pageIndex) && isNotUndefinedOrEmptyOrNull(pageSize)) {
						pageParam = "?&pos="+ pageIndex*pageSize +"&n="+pageSize;
					}
					return domain + contextPath +"/image/galleries"+pageParam+categoryParam+galleryParam+partnerParam+titleParam+langParam+sortKeyParam+sortValParam;
				  },
		CATEGORY : function(language) {
					 var langParam="";
					 if(isNotUndefinedOrEmptyOrNull(language)){
						langParam="&lang="+language;
				 	 }
					 return domain + contextPath + "/image/categories?"+langParam;
				   },
		PARTNER : domain + contextPath + "/image/partners",
		
		PHOTO : function(pageIndex, pageSize, galleryid) { 
					var pageParam="";
					var galleryParam ="";
					if(isNotUndefinedOrEmptyOrNull(galleryid)) {
						galleryParam = "&galleryid="+galleryid;
					}
					if(isNotUndefinedOrEmptyOrNull(pageIndex) && isNotUndefinedOrEmptyOrNull(pageSize)) {
						pageParam = "?&pos="+ pageIndex*pageSize +"&n="+pageSize;
					}
					return domain + contextPath + "/image/photos"+pageParam+galleryParam;
				},
		GALLERY_BY_ID : function(id){
							return domain+contextPath+"/image/galleries/id/"+id;
						},
		GALLERY_COPY : function(id){
			return domain+contextPath+"/image/galleries/"+id+"/copy";
		},
		GALLERY_DELETE : function(id){
			return domain+contextPath+"/image/galleries/"+id+"/delete";
		}
				
	};
	
	function isNotUndefinedOrEmptyOrNull(data) {
		return typeof data !== 'undefined' && data!= null && data!=='';
	}
}());