
    $(document).ready(function(){
    	initTabs();
    });
	function uploadFormData(){
	  var oMyForm = new FormData();
	  oMyForm.append("file", file1.files[0]);

	 
	  $.ajax({
	    url: '/recommended/uploadFile.html',
	    data: oMyForm,
	    dataType: 'text',
	    processData: false,
	    contentType: false,
	    type: 'POST',
	    success: function(data){
	    	document.getElementById("uploadThumbnail").innerHTML = $(data).find('#uploadThumbnail').html();
	    }
	  });
	}
	
 var initTabs = function(){
		$("#keyWords-tags").tagsManager();
		var stringarray="";
		var finalString = "";
		stringArray =$('#keyWords-tags').val();
		for(i=0;i<stringArray.length;i++){
			if(stringArray[i] != '[' && stringArray[i] != ']'){
				finalString+=stringArray[i];
			}
		}
		var finalArray =finalString.split(',');
		$("#keyWords-tags").tagsManager('empty');
		for(var i=0;i<finalArray.length;i++) {
			if((finalArray[i].indexOf("c_")===-1)){
				$("#keyWords-tags").tagsManager('pushTag',finalArray[i]);
			}
		}
	};
	
	var submitFinalData =function() {
		
		
			var keyWords="";var circles = "";
			for(i=0;i<$('.tm-tag').length;i++){
				keyWords+=$('#keyWords_tags_' +(i+1)+' span').html();
				if(i<($('.tm-tag').length -1)){
					keyWords+=",";
				}
			}
			for(i=0;i<$('#moduleCircle').val().length;i++){
				if(i==0){
					keyWords+=",";
				}
				keyWords+="c_"+$('#moduleCircle').val()[i];
				circles+=$('#moduleCircle').val()[i];
				if(i<($('#moduleCircle').val().length-1)){
					keyWords+=",";
					circles+=",";
				}
			}
			var data = {
					'objId' : $('#objId').val(),
					'title' : $('#title').val(),
					'site' : $('#site').val(),
					'description' : $('#description').val(),
					'releaseDate' : $('#releaseDate').val(),
					'textUrl' : $('#textUrl').val(),
					'thumbnailUrl' : $('#thumbnailUrl').val(),
					'keyWords' : keyWords,
					'circles'  : circles,
					'publisher' : $('#publisher').val()
					
					};
			var result = true;
//			if($('#objId').val() ===""){
//				$('#parsley-objId').show();
//				result=false;
//				
//			}
			if($('#title').val() ===""){
				$('#parsley-title').show();
				result=false;
				
			}
			 if($('#description').val() ===""){
				$('#parsley-description').show();
				result=false;
			}
			 if($('#releaseDate').val() ===""){
				$('#parsley-date').show();
				result=false;
			}
			 if($('#textUrl').val() ===""){
				$('#parsley-url').show();
				result=false;
			}
//			 if($('#thumbnailUrl').val() ===""){
//				$('#parsley-thumbnail').show();
//				result=false;
//			}
			 if($('#site').val() ===""){
				$('#parsley-site').show();
				result=false;
			}
			 if(keyWords ===""){
				$('#parsley-keyword').show();
				result=false;
			}
	
			if(result){
			  $.post('recommended/basic/save/', data, function(res) {
				  $('#parsley-objId').hide();
				  $('#parsley-title').hide();
				  $('#parsley-description').hide();
				  $('#parsley-date').hide();
				  $('#parsley-url').hide();
				  $('#parsley-thumbnail').hide();
				  $('#parsley-site').hide();
				  $('#parsley-keyword').hide();
				if (res.indexOf("FAILEDEDIT") === -1) {
					$('#module_result_basic_info').show();
					
					$('#module_upload').hide();
					$('#moduleSave').hide();
				} else {
					$('#module_result_basic_info_failure').show();
					$('#moduleSave').hide();
					
				}
			  });
			}
		
	};

