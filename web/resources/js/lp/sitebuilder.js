function deleteModSeq(deletedModuleName) {
	var moduleNameArray = $('.moduleNameTdClass');
	var moduleEditNameArray = $('.editModuleNameTdClass');
	showDeletePopup();
	attachToYesDelete(function() {
		hideDeletePopup();

		$( ".sorting-class" ).html( '');
		var i=0;
		var j=0;
		for(i=0;i<moduleNameArray.length;i++){
			if(moduleNameArray[i].id != deletedModuleName){
				var editTitle = $(moduleEditNameArray[i]).val();
				appendToModuleSequence(moduleNameArray[i].id,j,editTitle);
				j++;
			}
		}
	});
}

function deletePopularLink(deletedModuleId) {
	showDeletePopup();
	attachToYesDelete(function() {
		hideDeletePopup();
		var data = {
				'id' : deletedModuleId,
				'siteId': $('#idPopLinkSeq').val().trim()
		};
		$.post('lp/popLink/delete/', data, function(res) {
			if (res.indexOf("FAILED_STRING") === -1) {
				$('table').remove('#'+deletedModuleId);
			}
		});
	});
}

$(function() {
	$('#editSiteForm').live('submit', function(event) {
		event.preventDefault();
		$('#save_new_site').prop('disabled', true);
		var bannerObj = {
				'banner1' : getKeywordFromSelect('Banner1'),
				'banner2' : getKeywordFromSelect('Banner2'),
				'banner3' : getKeywordFromSelect('Banner3'),

			}
		var dataPacksObj = {
				'type' : $('#editDatapackType').val().trim(),
				'mediaType' : $('#editDatapackMediaType').val().trim()
			}
		var vasObj = {
				"vasmusic":$('#editVasMusicTextarea').val().trim(),
			    "vasvideo":$('#editVasVideoTextarea').val().trim(),
			    "vaswallpaper":$('#editVasWallpaperTextarea').val().trim(),
			    "vasgame":$('#editVasGamesTextarea').val().trim()
			}
		var analyticsId = $('#editSiteIdTextarea').val().trim();
		//handled for cricket in cricket pass 4-S-1
		if($('#editSiteIdTextarea').val().trim().indexOf('4-') === -1){
			analyticsId = '4-LP-'+$('#editSiteIdTextarea').val().trim();
		}
		var value ={
				'analyticsId' : analyticsId,
				'title' : $('#editTitleTextarea').val().trim(),
				'slug' : $('#editSlugTextarea').val().trim(),
				'photoKeyword' : getKeywordFromTab('photo'),
				'videoKeyword' : getKeywordFromTab('video'),
				'newsKeyword' : getKeywordFromTab('news'),
				'twitterIds' : commaSepStringToArray(getKeywordFromTab('twitterids')),
				'twitterHandles' : commaSepStringToArray(getKeywordFromTab('twitterhandle')),
				'circles' : commaSepStringToArray(getKeywordFromSelect('Circle')),
				'deviceGroups' : commaSepStringToArray(getKeywordFromSelect('DeviceSel')),
				'bannerIds':bannerObj,
				"subscriptionModule":$('#editHotCkeckTextarea').val().trim(),
				'vasPackages':vasObj,
				'dataPacks':dataPacksObj
		};
		var data = {
				'id': $('#idTextArea').val().trim(),
				'value':JSON.stringify(value)
				              
		};
		var result = true;
		if($('#editSiteIdTextarea').val() ===""){
			$('#parsley-siteId').show();
			result=false;

		}
		if($('#editTitleTextarea').val() ===""){
			$('#parsley-title').show();
			result=false;
		}
		if($('#editSlugTextarea').val() ===""){
			$('#parsley-slug').show();
			result=false;
		}
		var slug = value.slug;
		if(slug.match(/^[a-z0-9-_]+$/) ===null){
			$('#parsley-slug-special').show();
			$('#editSlugTextarea').focus();
			result=false;
		}
		if(data.deviceGroups ===""){
			$('#parsley-device').show();
			result=false;
		}
		 

		if(result){
			$.post('lp/lpData/save/', data, function(res) {
				if (res.indexOf("FAILED_STRING") === -1) {
					$('.ms-spinner').hide();
					$('#tab_contest').html(res);
					$('#result_site_add').removeClass("msg-failure").addClass("msg-success").text(
							"Site saved successfully.");
					setTimeout(function() {
						window.location.replace("lp/index.html");
					}, 500);
					
				}else {
					$('#save_new_site').prop('disabled', false);
					$('.ms-spinner').hide();
					$('#result_site_add').removeClass("msg-success").addClass("msg-failure").text(
							"Save operation unsucessful failed.");
				}
			});
		}
	});
	
	$('#newSite').live('click', function(event) {
		event.preventDefault();
		$('select').val('');
		$("#idTextArea").val('');
		$("#editSiteIdTextarea").val('');
		$("#editSiteIdTextarea").attr('readonly',false);
		$("#editTitleTextarea").val('');
		$("#editSlugTextarea").val('');
		$("#moduleBanner1").val('');
		$("#moduleBanner2").val('');
		$("#moduleBanner3").val('');
		$("#editDatapackType").val('');
		$("#editDatapackMediaType").val('');
		$("#photo-keyWords-tags").val('');
		$("#video-keyWords-tags").val('');
		$("#news-keyWords-tags").val('');
		$("#twitterids-keyWords-tags").val('');
		$("#twitterhandle-keyWords-tags").val('');
		$("#editVasMusicTextarea").val('');
		$("#editVasVideoTextarea").val('');
		$("#editVasWallpaperTextarea").val('');
		$("#editVasGamesTextarea").val('');
		$("#editHotCkeckTextarea").val('');
		initTabs('photo');
		initTabs('video');
		initTabs('news');
		initTabs('twitterids');
		initTabs('twitterhandle');
		$('#editSite').modal('show');
		
	});
	$('.edit_popularLinks_btn').live('click', function(event) {
		event.preventDefault();
		var ele = $(this);
		var siteId = ele.attr("name");
		var data = {
				'siteId' : siteId
		};
		$.post('lp/popLink/get', data, function(res) {
			var json = $.parseJSON(res);
			$( ".popularLinkClass" ).html( '');
			$.each(json, function(i, item) {
				var _id = item._id;
				var start = _id.lastIndexOf(":");
				var id = _id.substring(start+1);
				appendToPopularLink(item.value.name,item.value.link,item.value.thumbnailUrl,id.trim());

			});
			$("#idPopLinkSeq").val(siteId);
			$('#editPopLink').modal('show');
		});
	});
	
	$("#add_popLink_btn").on('click', function(event) {
		appendToPopularLink('','','',new Date().getTime())
	});
	
	$("#submit_popLink_btn").on('click', function(event) {
		var titles = $('.popLinkName');
		var urls = $('.popLinkUrl');
		var imageUrl = $('.popLinkImageUrl');
		var ids = $('.popLinkId');
		var i = 0;
		var json = [];
		for(i=0;i<titles.length;i++){
			if($(titles[i]).val() != '' || $(urls[i]).val() !='' || $(imageUrl[i]).val()!=''){
				var linkObj = {
						"_id":$(ids[i]).val(),
						"name":$(titles[i]).val(),
						"link":$(urls[i]).val(),
						"thumbnailUrl":$(imageUrl[i]).val()
				};
				json.push(linkObj);
			}
			
		}
		var data = {
				'siteId': $('#idPopLinkSeq').val().trim(),
				'value':JSON.stringify(json)
		};
		$.post('lp/popLink/save/', data, function(res) {
			if (res.indexOf("FAILED_STRING") === -1) {
				$('.ms-spinner').hide();
				$('#result_popLink_add').removeClass("msg-failure").addClass("msg-success").text("Links saved successfully.");
				setTimeout(function() {
					$('#editPopLink').modal('hide');
					window.location.replace("lp/index.html");
				}, 2000);
			}else {
				$('.ms-spinner').hide();
				$('#result_popLink_add').removeClass("msg-success").addClass("msg-failure").text("Links save operation unsucessful failed.");
			}
		});

	});
	$('.edit_bigStory_btn').live('click', function(event) {
		var ele = $(this);
		var id = ele.attr("name");
		var data = {
				'id' : id
		};
		$.post('lp/lpData/get', data, function(res) {
			var json = $.parseJSON(res);
			var bigStory = json.bigStory;
			$("#idBigText").val('');
			$("#idBigText").val(json.id);
			
			$("#editBigStoryHeadingTextarea").val('');
//			$("#editBigStoryTitleTextarea").val('');
			$("#editBigStoryDescTextarea").val('');
			$("#editBigStoryImageTextarea").val('');
			$("#editBigStoryLinkTextarea").val('');
			$("#editBigStoryType").val('');
			$("#editSubStory1Heading").val('');
			$("#editSubStory1Link").val('');
			$("#editSubStory1Type").val('');
			$("#editSubStory2Heading").val('');
			$("#editSubStory2Link").val('');
			$("#editSubStory2Type").val('');
			
			if(bigStory!=null && bigStory!=''){
				$("#editBigStoryHeadingTextarea").val(bigStory.mainStoryHeading);
//				$("#editBigStoryTitleTextarea").val(bigStory.mainStoryTitle);
				$("#editBigStoryDescTextarea").val(bigStory.mainStoryDesc);
				$("#editBigStoryImageTextarea").val(bigStory.mainStoryImage);
				$("#editBigStoryLinkTextarea").val(bigStory.mainStoryLink);
				$("#editBigStoryType").val(bigStory.mainStoryType);

				$("#editSubStory1Heading").val(bigStory.subStory1Heading);
				$("#editSubStory1Link").val(bigStory.subStory1Link);
				$("#editSubStory1Type").val(bigStory.subStory1Type);

				$("#editSubStory2Heading").val(bigStory.subStory2Heading);
				$("#editSubStory2Link").val(bigStory.subStory2Link);
				$("#editSubStory2Type").val(bigStory.subStory2Type);
			}
		});
		
		$('#editBigStoryModule').modal('show');
	});
	
	$("#editBigStoryModuleForm").live('submit', function(event) {
		event.preventDefault();
		var bigStoryObj = {
				'mainStoryHeading':$('#editBigStoryHeadingTextarea').val().trim(),
//				'mainStoryTitle': $("#editBigStoryTitleTextarea").val().trim(),
				'mainStoryDesc':$('#editBigStoryDescTextarea').val().trim(),
				'mainStoryImage':$('#editBigStoryImageTextarea').val().trim(),
				'mainStoryLink':$('#editBigStoryLinkTextarea').val().trim(),
				'mainStoryType':$('#editBigStoryType').val().trim(),
				
				'subStory1Heading':$('#editSubStory1Heading').val().trim(),
				'subStory1Link':$('#editSubStory1Link').val().trim(),
				'subStory1Type':$('#editSubStory1Type').val().trim(),
				
				'subStory2Heading':$('#editSubStory2Heading').val().trim(),
				'subStory2Link':$('#editSubStory2Link').val().trim(),
				'subStory2Type':$('#editSubStory2Type').val().trim(),
			}
		var value={
				'bigStory':bigStoryObj
		};

		var data = {
				'id': $('#idBigText').val().trim(),
				'value':JSON.stringify(value)
		};
		$.post('lp/lpData/save/', data, function(res) {
			if (res.indexOf("FAILED_STRING") == -1) {
				$('.ms-spinner').hide();
				$('#result_bigStory_add').removeClass("msg-failure").addClass("msg-success").text("Big Story saved successfully.");
				setTimeout(function() {
					$('#editBigStoryModule').modal('hide');
					window.location.replace("lp/index.html");
				}, 2000);
			}else {
				$('.ms-spinner').hide();
				$('#result_bigStory_add').removeClass("msg-success").addClass("msg-failure").text("Big Story save operation unsucessful failed.");
			}
		});
		
	});
	
	$('.edit_richText_btn').live('click', function(event) {
		var ele = $(this);
		var id = ele.attr("name");
		var data = {
				'id' : id
		};
		
		$.post('lp/lpData/get', data, function(res) {
			var json = $.parseJSON(res);
			var richText = json.richText;
			$("#idRichText").val('');
			$("#idRichText").val(json.id);
			$("#editorMainDiv").html('');
			if(richText != null && richText!=''){
				$.each(richText, function(i, item) {
				    addEditor(item);
				});
			}
		});
		
		$('#editRichTextModule').modal('show');
	});
	
	$("#submit_richText_btn").on('click', function(event) {
		var richText = $('.jqte_editor');
		
		
		var i=0;
		var newRichText = '';
		for(i=0;i<richText.length;i++){
			newRichText += $(richText[i]).html();
			if(i!=richText.length -1){
				newRichText +=',';
			}
		}
		var value={
			'richText':commaSepStringToArray(newRichText)
		};
		
		var data = {
				'id': $('#idRichText').val().trim(),
				'value':JSON.stringify(value)
		};
		$.post('lp/lpData/save/', data, function(res) {
			if (res.indexOf("FAILED_STRING") == -1) {
				$('.ms-spinner').hide();
				$('#result_richText_add').removeClass("msg-failure").addClass("msg-success").text("Rich Text saved successfully.");
				setTimeout(function() {
					$('#editRichTextModule').modal('hide');
					window.location.replace("lp/index.html");
				}, 2000);
			}else {
				$('.ms-spinner').hide();
				$('#result_richText_add').removeClass("msg-success").addClass("msg-failure").text("Rich Text save operation unsucessful failed.");
				}
			});
		
	});
	
	
	$('.edit_module_btn').live('click', function(event) {
		event.preventDefault();
		var ele = $(this);
		var id = ele.attr("name");
		var data = {
				'id' : id
		};

		$.post('lp/lpData/get', data, function(res) {
			var json = $.parseJSON(res);
			var modSeq = json.moduleSequence;
			$("#idModSeq").val('');
			$("#idModSeq").val(json.id);
			$( ".sorting-class" ).html( '');
			if(modSeq != null && modSeq!=''){
				$.each(modSeq, function(i, item) {
					var itemArr = item.split(":");
					if(itemArr.length == 2)
						appendToModuleSequence(itemArr[0],i,itemArr[1]);
					else
						appendToModuleSequence(itemArr[0],i,"");
				});
			}
		});
		
		$('#editModuleSeq').modal('show');
		
	});
	
	$("#add_modseq_btn").on('click', function(event) {
		
		var addedModule = $('#modseq_module').val();
		var isModulePresent = false;
		var moduleNameArray = $('.moduleNameTdClass');
		var moduleEditNameArray = $('.editModuleNameTdClass');
		
		$( ".sorting-class" ).html( '');
		var i=0;
		
		for(i=0;i<moduleNameArray.length;i++){
			if(moduleNameArray[i].id == addedModule){
				isModulePresent = true;
			}
			var editTitle = $(moduleEditNameArray[i]).val();
			appendToModuleSequence(moduleNameArray[i].id,i,editTitle);
		}
		if(!isModulePresent){
			appendToModuleSequence(addedModule,i,"");
		}
			
	});
	
	$("#submit_modseq_btn").on('click', function(event) {
		var moduleNameArray = $('.moduleNameTdClass');
		var moduleEditNameArray = $('.editModuleNameTdClass');
		var i=0;
		var newModuleSeq = '';
		for(i=0;i<moduleNameArray.length;i++){
			newModuleSeq += moduleNameArray[i].id;
			var editTitle = $(moduleEditNameArray[i]).val();
			newModuleSeq += ":"+editTitle;
			if(i!=moduleNameArray.length -1){
				newModuleSeq +=',';
			}
		}
		var value={
			'moduleSequence':commaSepStringToArray(newModuleSeq)
		};
		
		var data = {
				'id': $('#idModSeq').val().trim(),
				'value':JSON.stringify(value)
		};
		$.post('lp/lpData/save/', data, function(res) {
			if (res.indexOf("FAILED_STRING") === -1) {
				$('.ms-spinner').hide();
				$('#result_modseq_add').removeClass("msg-failure").addClass("msg-success").text("Sequence saved successfully.");
				setTimeout(function() {
					$('#editModuleSeq').modal('hide');
					window.location.replace("lp/index.html");
				}, 2000);
			}else {
				$('.ms-spinner').hide();
				$('#result_modseq_add').removeClass("msg-success").addClass("msg-failure").text("Sequence save operation unsucessful failed.");
				}
			});
		
	});
	
	$( ".sorting-class" ).on( "sortbeforestop", function( event, ui ) {
		var moduleNameArray = $('.moduleNameTdClass');
		var moduleEditNameArray = $('.editModuleNameTdClass');
		$( ".sorting-class" ).html( '');
		var i=0;
		for(i=0;i<moduleNameArray.length;i++){
			var editTitle = $(moduleEditNameArray[i]).val();
			appendToModuleSequence(moduleNameArray[i].id,i,editTitle);
		}
	});
	
	
	$('.edit_button').live('click', function(event) {
		
		event.preventDefault();
		var ele = $(this);
		var id = ele.attr("name");
		var data = {
		'id' : id
		};

		$.post('lp/lpData/get', data, function(res) {
			var json = $.parseJSON(res);
			$('select').val('')
			$("#idTextArea").val('');
			$("#idTextArea").val(json.id);
			$("#editSiteIdTextarea").val('');
			$("#editSiteIdTextarea").val(json.analyticsId);
			$("#editSiteIdTextarea").attr('readonly',true);
			$("#editTitleTextarea").val('');
			$("#editTitleTextarea").val(json.title);
			$("#editSlugTextarea").val('');
			$("#editSlugTextarea").val(json.slug);
			
			$("#moduleBanner1").val('');
			$("#moduleBanner2").val('');
			$("#moduleBanner3").val('');
			$("#editVasMusicTextarea").val('');
			$("#editVasVideoTextarea").val('');
			$("#editVasWallpaperTextarea").val('');
			$("#editVasGamesTextarea").val('');
			$("#editHotCkeckTextarea").val('');
			$("#editHotCkeckTextarea").val(json.subscriptionModule);
			
			$('#editor').html('')
			$( "#editor" ).append(json.richText);
			
			
			var vasPackage = json.vasPackages;
			if(vasPackage!=null){
				$("#editVasMusicTextarea").val(vasPackage.vasmusic);
				$("#editVasVideoTextarea").val(vasPackage.vasvideo);
				$("#editVasWallpaperTextarea").val(vasPackage.vaswallpaper);
				$("#editVasGamesTextarea").val(vasPackage.vasgame);
			}
			
			var banner = json.bannerIds;
			if(banner!=null){
				$("#moduleBanner1").val(banner.banner1);
				$("#moduleBanner2").val(banner.banner2);
				$("#moduleBanner3").val(banner.banner3);
			}
			
			$("#editDatapackType").val('');
			var dataPack = json.dataPacks;
			if(dataPack != null && dataPack.hasOwnProperty('type')){
				$("#editDatapackType").val(json.dataPacks.type);
			}
			$("#editDatapackMediaType").val('');
			if(dataPack != null && dataPack.hasOwnProperty('mediaType')){
				$("#editDatapackMediaType").val(json.dataPacks.mediaType);
			}
			
			if(json.hasOwnProperty('circles')){
				$.each(json.circles, function(index, value){
					$("#moduleCircle").val(json.circles )
				});
			}else{
				$("#moduleLanguage").val('pan' )
			}
			
			$.each(json.deviceGroups, function(index, value){
				$("#moduleDeviceSel").val(json.deviceGroups )
			});
//			if(json.hasOwnProperty('languages')){
//				$.each(json.languages, function(index, value){
//					$("#moduleLanguage").val(json.languages )
//				});
//			}else{
//				$("#moduleLanguage").val('en' )
//			}
			
			$("#photo-keyWords-tags").val('');
			$("#photo-keyWords-tags").val(json.photoKeyword);
			initTabs('photo');
			
			$("#video-keyWords-tags").val('');
			$("#video-keyWords-tags").val(json.videoKeyword);
			initTabs('video');
			
			$("#news-keyWords-tags").val('');
			$("#news-keyWords-tags").val(json.newsKeyword);
			initTabs('news');
			
			$("#twitterids-keyWords-tags").val('');
			$("#twitterids-keyWords-tags").val(json.twitterIds);
			initTabs('twitterids');
			
			$("#twitterhandle-keyWords-tags").val('');
			$("#twitterhandle-keyWords-tags").val(json.twitterHandles);
			initTabs('twitterhandle');
			
			
			$('#editSite').modal('show');
		});
	});

	


	$('#no_delete').live('click',function() {
		hideDeletePopup();
	});
	
	function hideDeletePopup() {
		$('#deletePopup').modal('hide');
	}

	function attachToYesDelete(newFunction) {
		$('#yes_delete').unbind('click');
		$('#yes_delete').click(newFunction);
	}
	

	function showDeletePopup() {
		$('#deletePopup').modal('show');
	}
	
	var getKeywordFromTab = function(key){
		event.preventDefault();
      	var keyWords="";
		for(i=0;i<$('#'+key+'-tags').find('.tm-tag').length;i++){
			keyWords+=$('#'+key+'_keyWords_tags_' +(i+1)+' span').html();
			if(i<($('#'+key+'-tags').find('.tm-tag').length -1)){
				keyWords+=",";
			}
		}
		return keyWords;
		
	};
	var getKeywordFromSelect = function(key){
		var keyWords="";
		if(!($('#module'+key).val() instanceof Array)){
			keyWords+=$('#module'+key).val()
			return keyWords;
		}

		for(i=0;i<$('#module'+key).val().length;i++){
			keyWords+=$('#module'+key).val()[i];
			if(i<($('#module'+key).val().length-1)){
				keyWords+=",";
			}
		}
		return keyWords;
	}
    
	 var initTabs = function(key){
		 	
			$("#"+key+"-keyWords-tags").tagsManager();
			var stringarray="";
			var finalString = "";
			stringArray =$("#"+key+"-keyWords-tags").val();
			for(i=0;i<stringArray.length;i++){
				if(stringArray[i] != '[' && stringArray[i] != ']'){
					finalString+=stringArray[i];
				}
			}
			var finalArray =finalString.split(',');
			$("#"+key+"-keyWords-tags").tagsManager('empty');
			for(var i=0;i<finalArray.length;i++) {
				if((finalArray[i].indexOf("c_")===-1)){
					$("#"+key+"-keyWords-tags").tagsManager('pushTag',finalArray[i]);
				}
			}
		};
});


$('#no_delete').live('click',function() {
	hideDeletePopup();
});

function hideDeletePopup() {
	$('#deletePopup').modal('hide');
}

function attachToYesDelete(newFunction) {
	$('#yes_delete').unbind('click');
	$('#yes_delete').click(newFunction);
}

function showDeletePopup() {
	$('#deletePopup').modal('show');
}


$('#no_activate').live('click',function() {
	hideActivatePopup();
});


function hideActivatePopup() {
	$('#activatePopup').modal('hide');
}

function attachToYesActivate(newFunction) {
	$('#yes_activate').unbind('click');
	$('#yes_activate').click(newFunction);
}

function showActivatePopup() {
	$('#activatePopup').modal('show');
}

$('.del_btn').live('click',function() {
	event.preventDefault();
	var ele = $(this);
	var id = ele.attr("id");
	var data = {
			'id' : id
	};
	showDeletePopup();
	attachToYesDelete(function() {
		hideDeletePopup();
		$('.ms-spinner').show();
		$.post('lp/site/remove', data, function(res) {
			if (res.indexOf("FAILED_STRING") === -1) {
				$('.ms-spinner').hide();
				$('#tab_contest').html(res);
				$('#result_question_add').removeClass("msg-failure").addClass("msg-success").text(
						"Site deactivated successfully.");
				setTimeout(function() {
					window.location.replace("lp/index.html");
				}, 2000);
			} else {
				$('.ms-spinner').hide();
				$('#result_question_add').removeClass("msg-success").addClass("msg-failure").text(
						"Site deactivation failed.");
			}
		});
	});
});


$('.activate_btn').live('click',function() {
	event.preventDefault();
	var ele = $(this);
	var id = ele.attr("id");
	var data = {
			'id' : id
	};
	showActivatePopup();
	attachToYesActivate(function() {
		hideActivatePopup();
		$('.ms-spinner').show();
		$.post('lp/site/activate', data, function(res) {
			if (res.indexOf("FAILED_STRING") === -1) {
				$('.ms-spinner').hide();
				$('#tab_contest').html(res);
				$('#result_question_add').removeClass("msg-failure").addClass("msg-success").text(
						"Site activated successfully.");
				setTimeout(function() {
					window.location.replace("lp/index.html");
				}, 2000);
			}else {
				$('.ms-spinner').hide();
				$('#result_question_add').removeClass("msg-success").addClass("msg-failure").text(
						"Site activation failed.");
			}
			
		});
	});
});
var commaSepStringToArray = function(commaString){
	var json = [];
	var toSplit = commaString.split(",");
	for (var i = 0; i < toSplit.length; i++) {
		json.push(toSplit[i]);
	}
//	return JSON.stringify(json);
	return json;
};

var appendToModuleSequence = function(item,index,editTitle){
	var elementHtml= '<div style="padding:5px 0 ;width:100%;margin: 20px 0;">'+
					'<table class="table table-bordered table-striped table-hover">'+
						'<tr>'+
							'<td style="width:10%">'+(index+1)+'</td>'+
							'<td style="width:25%" class="moduleNameTdClass" id="' +item+'">'+ item +'</td>'+
							'<td style="width:30%" id="' +item+'"><input type="text" class="editModuleNameTdClass" value="'+editTitle +'"/></td>'+
							'<td style="width:35%" ><input type="button" class="btn btn-danger" id ="' + item + '" onclick="deleteModSeq(this.id)" value="delete"></td>'+
						'</tr>'+
					'</table>'+
					'</div>';
	$( ".sorting-class" ).append( elementHtml);
}

var appendToPopularLink = function(name,link,thumbnailUrl,id){
	var elementHtml = '<table class="table table-bordered table-striped" id="'+id+'">'+
		'<tr>'+
			'<td>'+
				'<input type="hidden" class="popLinkId" value="'+id+'"/>'+
			'</td>'+
		'</tr>'+
		'<tr>'+
			'<td>TITLE : </td>'+
			'<td>'+
				'<input style="width: 90%;margin-bottom: 0px;" class="popLinkName" type="text" value="'+name+'" rows="1"/>'+
			'</td>'+
		'</tr>'+
		'<tr>'+
			'<td>URL : </td>'+
			'<td>'+
				'<input style="width: 90%;margin-bottom: 0px;" class="popLinkUrl"  type="text" value="'+link+'" rows="1">'+
			'</td>'+
		'</tr>'+
		'<tr>'+
			'<td>IMAGE URL : </td>'+
			'<td>'+
				'<input style="width: 90%;margin-bottom: 0px;" class="popLinkImageUrl"  type="text" value="'+thumbnailUrl+'" rows="1">'+
			'</td>'+
		'</tr>'+
		'<tr style="width: 100%">'+
				'<td>ACTIONS : </td>'+
				'<td><input type="button" class="btn btn-danger" id ="' + id + '" onclick="deletePopularLink(this.id)" value="delete"></td>'+
		'</tr>'+
	   '</table>'
		
	$( ".popularLinkClass" ).append( elementHtml);
}
