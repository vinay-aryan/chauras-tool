var StarProfileModule = (function($, URLS){
	
	var starprofiles = [];
	var partners = [];
	var totalCount = 0;
	var pageIndex = 0;
	var pageSize = 10;
	var pages = [];
	var selectedName = '';
	var isFeatured = '';
	var profileType='';
	return {
		init : initialize
	};

	function initialize() {
		$('#dp1').datepicker(
				{ 
					format : '#DD# #MMM# #YYYY#',
					onRender: function(date) {
								var nowTemp = new Date();
								var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
								return date.valueOf() > now.valueOf() ? 'disabled' : '';
							  }
				});
		tagsInit();
		updateStarProfileClickBinding();
		createStarProfileClickBinding();
		alertBinding();
		bindNameFilter();
		bindFeaturedFilter();
		bindTypeFilter();
		loadPartners();
		loadProfiles();
	}
	function tagsInit() {
		$(".tm-input").off();
		var tagsInputLength = $(".tm-input").length;
		for(var i=0;i<tagsInputLength;i++) {
			$(".tm-input:eq("+i+")").tagsManager();
		}
	}
	function loadPartners() {
		console.log('Load partners called.');
		$.getJSON(URLS.PARTNER).done(function(data) {
			partners = data;
			applyPartnerTemplate();
			createProfileClickBinding();
		}).fail(function(jqxhr, textStatus, error) {
			console.log('Fetch failed for partners');
		});
	}
	function loadProfiles() {
		console.log('Load profiles called.');
		$.getJSON(URLS.STARPROFILE(pageIndex, pageSize, selectedName, isFeatured, profileType)).done(function(profiles){
			totalCount = profiles.total;
			starprofiles = $.map(profiles.result, function(profile) {
								var newProfile = JSON.parse(profile);
				  				return newProfile;
							});
			updateMaxPageIndex();
			updatePages();
			applyStarTemplate();
			applyPageTemplate();
			bindPagingActions();
			editProfileClickBinding();
			toggleControls();
		}).fail(function(){
				console.log('Fetch failed for profiles.');
		});
	}
	
	function toggleControls() {
		$('.spinner').toggle();
		$('#starprofile-complete').toggle();
	}
	
	function alertBinding() {
		$('#success-alert button').off();
		$('#error-alert button').off();
		$('#success-alert button').click(function(){
			$('#success-alert').hide();
		});
		$('#error-alert button').click(function(){
			$('#error-alert').hide();
		});
	}
	
	function bindNameFilter() {
		$('#name-filter-button').off();
		$('#name-filter-button').click(function(e){
			e.preventDefault();
			selectedName = $('#name-filter-text').val();
			resetPageParams();
			toggleControls();
			loadProfiles();
		});
	}
	
	
	function bindFeaturedFilter() {
		$('#featured-filter').off();
		$('#featured-filter').change(function(){
			isFeatured = $(this).val();
			resetPageParams();
			toggleControls();
			loadProfiles();
		});
	}
	
	function bindTypeFilter() {
		$('#politician-featured-filter').off();
		$('#politician-featured-filter').change(function(){
			profileType = $(this).val();
			resetPageParams();
			toggleControls();
			loadProfiles();
		});
	}
	
	function editProfileClickBinding() {
		$('.editProfile').off();
		$('.editProfile').click(function(e){
			e.preventDefault();
			resetEditProfileForm();
			$('#name').attr("readonly",false);
			$('#updateProfile').show();
			$('#createProfile').hide();
			$("#partners-div").hide();
			var data = $(this).tmplItem().data;
			fillForm(data);
			$('#myModal').modal();
			$('#tabs a').click(function(e) {
				e.preventDefault();
				$(this).tab('show')
			});
			$('#tabsUrl a').click(function(e) {
				e.preventDefault();
				$(this).tab('show')
			});
		});
	}
	function createProfileClickBinding() {
		$('#profile-create').off();
		$('#profile-create').click(function(e){
			e.preventDefault();
			resetEditProfileForm();
			$("#partners-div").show();
			$('#updateProfile').hide();
			$('#createProfile').show();
			$('#name').attr("readonly",false);
			$('#myModal').modal();
			$('#tabs a').click(function(e) {
				e.preventDefault();
				$(this).tab('show')
			});
			$('#tabsUrl a').click(function(e) {
				e.preventDefault();
				$(this).tab('show')
			});
		});
	}
	
	function addClickBinding(element) {
		$('#'+element+'-add').off();
		$('#'+element+'-add').click(function(e){
			e.preventDefault();
			var length = $("#"+element+" div").length;
			//for updating the html with textbox values
			$("#"+element+" div input").each(function() {
			     $(this).attr('value', $(this).val());
			});
			var htmlContent = $("#"+element).html();
			htmlContent += getMapBasedHtml(element, length + 1, "", "");
			$("#"+element).html(htmlContent);
			removeClickBinding(element);
		});
	}
	
	function removeClickBinding(element) {
		$("."+ element + "Remove").off();
		$("."+ element + "Remove").click(function(e){
			e.preventDefault();
			$(this).parent().remove();
		});
	}
	
	function resetEditProfileForm() {
		$("#editProfileForm")[0].reset();
		fillDate('');
		emptyTags("otherNames-tags","otherNames");
		emptyTags("siblings-tags","siblings");
		emptyTags("children-tags","children");
		emptyTags("galleryIds-tags","galleryIds");
		emptyTags("awards-tags","awards");
		emptyTags("movies-tags","movies");
	}
	
	function fillForm(data) {
		var moviesId = "movies";
		var awardsId = "awards";
		$("#_id").val(data._id);
		$("#name").val(data.name);
		$("#featured").val(""+data.featured);
		$("#summary").val(data.summary);
		var bio = jQuery.parseJSON(data.fullBio)
		for (var loc in bio)
		{
			$("#fullBio_"+loc).val(bio[loc]);
		}

		$("#trivia").val(data.trivia);
		$("#placeOfBirth").val(data.placeOfBirth);
		$("#height").val(data.height);
		$("#spouse").val(data.spouse);
		$("#vasId").val(data.vasId);
		$("#blogUrl").val(data.blogUrl);
		$("#twitterUrl").val(data.twitterUrl);
		$("#facebookUrl").val(data.facebookUrl);
		
		var wikiUrl = jQuery.parseJSON(data.wikipediaUrl)
		for (var loc in wikiUrl)
		{
			$("#wikipediaUrl_"+loc).val(wikiUrl[loc]);
		}

		fillDate(data.dob);
		pushTags('otherNames', data.otherNames);
		pushTags('siblings', data.siblings);
		pushTags('children', data.children);
		pushTags('galleryIds', data.galleryIds);
		pushTags('movies', data.movies);
		pushTags('awards', data.awards);
	}
	
	function updateStarProfileClickBinding() {
		$("#updateProfile").off();
		$("#updateProfile").click(function(e){
			e.preventDefault();
			var matchedProfiles = $.grep(starprofiles, function(e){ return e._id == $("#_id").val(); });
			var matchedProfile = matchedProfiles[0];
			
			matchedProfile.featured = $("#featured").val().toLowerCase() === 'true';
			updateProfileString(matchedProfile , "name");
			updateProfileString(matchedProfile , "summary");

							var bio = JSON.parse(matchedProfile.fullBio);
							for(var loc in bio){
								updateJSONString(bio,"fullBio",loc,matchedProfile);
							}
							matchedProfile.fullBio = JSON.stringify(bio);
							
							

			updateProfileString(matchedProfile , "trivia");
			updateProfileString(matchedProfile , "placeOfBirth");
			updateProfileString(matchedProfile , "height");
			updateProfileString(matchedProfile , "spouse");
			updateProfileString(matchedProfile , "vasId");
			updateProfileString(matchedProfile , "blogUrl");
			updateProfileString(matchedProfile , "twitterUrl");
			updateProfileString(matchedProfile , "facebookUrl");
							
			var url = JSON.parse(matchedProfile.wikipediaUrl);
			for(var loc in url){
				updateJSONString(url,"wikipediaUrl",loc,matchedProfile);
			}
			matchedProfile.wikipediaUrl = JSON.stringify(url);
			
			

			updateProfileString(matchedProfile , "dob");
			updateProfileArray(matchedProfile, "otherNames");
			updateProfileArray(matchedProfile, "siblings");
			updateProfileArray(matchedProfile, "children");
			updateProfileArray(matchedProfile, "galleryIds");
			updateProfileArray(matchedProfile, "awards");
			updateProfileArray(matchedProfile, "movies");

			
			if(matchedProfile.editMetaData.galleryIdsEditInfo) {
				applyStarTemplate();
			}
			$.post(URLS.CREATE_OR_UPDATE, JSON.stringify(matchedProfile))
			.	done(function(data) {
					firstPage();
					toggleControls();
					loadProfiles();
					$('#success-alert').show();
				}).fail(function(){
					console.log("Update to database failed");
					$('#error-alert').show();
				});
			$('#myModal').modal('hide');
		});
	}
	function isValid(profile) {
		var urlreg = /^$|^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
		if(urlreg.profile.wikipediaUrl && urlreg.profile.blogUrl && urlreg.profile.twitterUrl && urlreg.profile.facebookUrl) {
			return true;
		} else {
			alert("Please correct url format.");
		}
	}
	function createStarProfileClickBinding() {
		$("#createProfile").off();
		$("#createProfile").click(function(e){
			e.preventDefault();
			$.get(URLS.PROFILE_EXISTS($('#name').val().trim()))
				.done(function(data) {
					if(data == 'false') {
						create();
					}else{
						alert("Profile with name ** "+$('#name').val().trim()+" ** already exists.");
					}
				}).fail(function(){
					console.log("Exception on server side.");
					$('#error-alert').show();
				});
		});
	}
	function create() {
		var newProfile = {
				name 		:	$('#name').val().trim(),
				summary 	:	$('#summary').val().trim(),
			
			fullBio : {
				en : $('#fullBio_en').val().trim(),
				hi : $('#fullBio_hi').val().trim(),
				ta : $('#fullBio_ta').val().trim(),
				te : $('#fullBio_te').val().trim(),
				mr : $('#fullBio_mr').val().trim(),
				bn : $('#fullBio_bn').val().trim(),
				ml : $('#fullBio_ml').val().trim(),
				gu : $('#fullBio_gu').val().trim(),
				kn : $('#fullBio_kn').val().trim(),
				pa : $('#fullBio_pa').val().trim(),
			},
				trivia 		: 	$('#trivia').val().trim(),
				placeOfBirth: 	$('#placeOfBirth').val().trim(),
				height		: 	$('#height').val().trim(),
				spouse 		: 	$('#spouse').val().trim(),
				vasId 		:	$('#vasId').val().trim(),
				blogUrl	 	: 	$('#blogUrl').val().trim(),
				twitterUrl 	: 	$('#twitterUrl').val().trim(),
				facebookUrl : 	$('#facebookUrl').val().trim(),
			
			wikipediaUrl : {
				en : $('#wikipediaUrl_en').val().trim(),	
				hi : $('#wikipediaUrl_hi').val().trim(),
				ta : $('#wikipediaUrl_ta').val().trim(),
				te : $('#wikipediaUrl_te').val().trim(),
				mr : $('#wikipediaUrl_mr').val().trim(),
				bn : $('#wikipediaUrl_bn').val().trim(),
				ml : $('#wikipediaUrl_ml').val().trim(),
				gu : $('#wikipediaUrl_gu').val().trim(),
				kn : $('#wikipediaUrl_kn').val().trim(),
				pa : $('#wikipediaUrl_pa').val().trim(),
			},
				dob 		: 	$('#dob').val().trim(),
				otherNames 	: 	getTagValue("otherNames"),
				siblings 	: 	getTagValue("siblings"),
				children 	: 	getTagValue("children"),
				galleryIds 	: 	getTagValue("galleryIds"),
				awards 		: 	getTagValue("awards"),
				movies 		: 	getTagValue("movies"),
				featured  	: 	$("#featured").val().toLowerCase() === 'true',
				partnerid	:	$('#partners-filter').val()
		};
		$.post(URLS.CREATE_OR_UPDATE, JSON.stringify(newProfile))
		.	done(function(data) {
				console.log(data);
				firstPage();
				toggleControls();
				loadProfiles();
				$('#success-alert').show();
			}).fail(function(){
				console.log("Update to database failed");
				$('#error-alert').show();
			});
		$('#myModal').modal('hide');
	}
	function updateProfileMap(profile, element) {
		var names = $('.'+element+'name').map(function() {
		    return $(this).val().trim();
		});
		var values = $('.'+element+'year').map(function() {
		    return $(this).val().trim();
		});
		var obj = {};
		for(var i=0; i<names.length;i++) {
			if(names[i] !== '') {
				obj[names[i]] = values[i];
			}
		}
		if(!_.isEqual(profile[element],obj)) {
			profile.editMetaData[element + "EditInfo"] = true;
			profile[element] = obj;
		}
	}
	
	function updateProfileArray(profile, element) {
		var tagArray = getTagValue(element);
		if(!_.isEqual(tagArray, profile[element])) {
			profile.editMetaData[element + "EditInfo"] = true;
			profile[element] = tagArray;
		}
	}

	function getTagValue(element) {
		var tagValues = $('input[name="hidden-'+element+'-tags"]').val();
		tagValues = tagValues==''? [] : tagValues.split(';');
		return tagValues;
	}
	
	function updateProfileString(profile, element) {
		var value = $("#" + element).val().trim();
		if(profile[element] == null && value=='') {
			return;
		}
		if (profile[element] !== value) {
			profile.editMetaData[element + "EditInfo"] = true;
			profile[element] = value;
		}
	}
	function updateJSONString(profile,element,loc,matchedProfile){
		var value = $("#" + element+"_"+loc).val().trim();
		console.log("printing          "+value);
		console.log(value);
		if (profile[loc] == null && value == '') {
			return;
		}
		if (profile[loc] !== value) {
			matchedProfile.editMetaData[element + "EditInfo"] = true;
			profile[loc] = value;
		}
	}
	
	function mapBasedData(elementId, data) {
		var shouldApplyRemoveClickBinding = false;
		if(typeof data !== 'undefined' && data!= null) {
			var htmlContent = '';
			var i = 1;
			for (var key in data) {
			  if (data.hasOwnProperty(key)) {
				  htmlContent += getMapBasedHtml(elementId, i, key, data[key]);
				  i++;
				  shouldRemoveClickBinding=true;
			  }
			}
			$('#'+elementId).html(htmlContent);
		}
		if(shouldApplyRemoveClickBinding) {
			removeClickBinding(elementId);
		}
	}
	
	function getMapBasedHtml(elementId, i, key, value) {
		var htmlContent = '';
		htmlContent += '<div>';
		htmlContent += '<input style="margin-right:5px; margin-top:5px;"  type="text"  value="'+key+'" class="input-xlarge '+elementId+'name"/>';
		htmlContent += '<input style="margin-right:5px;margin-top:5px;"  class="'+elementId+'year" type="text"  value="'+value+'"/>';
		htmlContent += '<button style="margin-right:5px;margin-top:5px;" class="btn btn-small '+elementId+'Remove">Remove</button>';
		htmlContent += '</div>';
		return htmlContent;
	}
	
	function fillDate(data) {
		$('div#dp1').attr('data-date',data);
		$('div#dp1 input').val(data);
	}
	
	function emptyTags(elementId, startsWith) {
		if($('span[id^="'+startsWith+'"].tm-tag').length > 0) {
			$("#"+elementId).tagsManager('empty');
		}
	}
	
	function pushTags(elementId, array) {
		if(typeof array !== 'undefined' && array != null) {
			for(var i=0;i<array.length;i++) {
				$("#"+elementId+"-tags").tagsManager('pushTag',array[i]);
			}
		}
	}

	function applyStarTemplate() {
	    var renderedHtml = $("#starNameTemplate").tmpl(starprofiles);
		$("#starProfileBody").html(renderedHtml);
		
	}
	
	function applyPartnerTemplate() {
		console.log('applyPartnerTemplate  called.');
		var renderedHtml = $("#partnerTemplate").tmpl(partners);
		$("#partners-filter").html(renderedHtml);
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
			loadProfiles();
		});
		
		$('#paging-Next').click(function(e){
			e.preventDefault();
			if($(this).parent().hasClass('disabled')) {
				return;
			}
			nextPage();
			toggleControls();
			loadProfiles();
		});
		$('#paging-First').click(function(e){
			e.preventDefault();
			if($(this).parent().hasClass('disabled')) {
				return;
			}
			firstPage();
			toggleControls();
			loadProfiles();
		});
		$('#paging-Last').click(function(e){
			e.preventDefault();
			if($(this).parent().hasClass('disabled')) {
				return;
			}
			lastPage();
			toggleControls();
			loadProfiles();
		});
		
		$('.paging-change').click(function(e){
			e.preventDefault();
			if($(this).parent().hasClass('active')) {
				return;
			}
			moveToPage($(this).text());
			toggleControls();
			loadProfiles();
		});
	}
	
}(jQuery,URLS));