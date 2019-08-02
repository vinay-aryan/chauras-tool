function uploadImageData(){
	var inputFile = document.querySelector("#file1");
	var formData = new FormData();
	formData.append("file", inputFile.files[0]);
	//enable loading image//
	$("#loader").show();
	$.ajax({
		url : '/splash/uploadFile.html',
		type : 'POST',
		data : formData,
		cache :false,
		contentType : false,
		processData : false,
		success : function(data){
			console.log("success");
			console.log(data);
			document.getElementById("uploadThumbnail").innerHTML = $(data).find('#uploadThumbnail').html();
			$("#loader").hide();
		},
		error: function(e){
			alert("Size is greater than 500 KB");
			console.log(e);
			$("#loader").hide();
		}
	});
}

function activateSplash(id,siteName,circle,status){
	
	console.log(id);
	 
	var data = {
			'mId' : id,
			'siteName' : siteName,
			'circle' : circle,
			'status' : status
			
	};
	$.post('/splash/module/activate', data, function(res) {
		window.location.replace("splash/index.html");
		console.log("res:"+res);
	});
}

function deActivateSplash(id){
	
	console.log(id);
	 
	var data = {
			'mId' : id
	};
	$.post('/splash/module/deactivate', data, function(res) {
		window.location.replace("splash/index.html");
		console.log("res:"+res);
	});
	
}


function submitFinalData(){
	console.log("inside submit");
	var circles="";
	console.log(circles);
	var objId = document.getElementById("objId").value;
	var status = document.getElementById("status").value;
	var thumbnailUrl = document.getElementById("thumbnailUrl").value;
	var ext = thumbnailUrl.substring(thumbnailUrl.lastIndexOf('.') + 1);
	var lowerExt = ext.toLowerCase();
		if(lowerExt == 'jpg' || lowerExt == 'jpeg'){
			console.log("correct format");
		}
		else{
			alert("Image format not Supported, Upload jpg or jpeg format only");
			return false;
		}
	var title = document.getElementById("title").value;
	var site = document.getElementById("site").value;
	var description = document.getElementById("description").value;
	var textUrl = document.getElementById("textUrl").value;
	var publisher = document.getElementById("publisher").value;
	var circleList = document.getElementById("moduleCircle");
	for (i = 0; i< circleList.options.length ;i++) {
	    if (circleList.options[i].selected) {
	    	if(circles!=""){
	    		circles+=",";
	    	}
	    	circles += circleList.options[i].value;
	    	
	    }
	    console.log(circles);
	}
	
	var data = {
			'objId' : $('#objId').val(),
			'status' : $('#status').val(),
			'title' : $('#title').val(),
			'site' : $('#site').val(),
			'description' : $('#description').val(),
			'textUrl' : $('#textUrl').val(),
			'thumbnailUrl' : $('#thumbnailUrl').val(),
			'circles'  : circles,
			'publisher' : $('#publisher').val()
			
			};
	
	console.log(data.objId);
	
	var result = true;
	
	if($('#thumbnailUrl').val() ===""){
		$('#parsley-thumbnailUrl').show();
		result=false;
	}
	if($('#title').val() ===""){
		$('#parsley-title').show();
		result=false;
	}
	if($('#site').val() ===""){
		$('#parsley-site').show();
		result=false;
	}
	if($('#description').val() ===""){
		$('#parsley-description').show();
		result=false;
	}
	if($('#textUrl').val() ===""){
		$('#parsley-url').show();
		result=false;
	}
	if($('#publisher').val() ===""){
		$('#parsley-publisher').show();
		result=false;
	}
	if(circles ===""){
		$('#parsley-circle').show();
		result=false;
	}
	console.log("result id " + result);
	console.log("inside data result:"+ data.objId);
	
		if(result){
			console.log("inside result");
			$("#loader").show();
			$.ajax({
				url : 'splash/basic/save/',
				data : data,
				cache : false,
				type : 'POST',
				success : function(res){
					
					$('#parsley-thumbnail').hide();
					$('#parsley-title').hide();
					$('#parsley-site').hide();
					$('#parsley-description').hide();
					$('#parsley-url').hide();
					$('#parsley-publisher').hide();
					$('#parsley-circle').hide();
					
					$("#loader").hide();
					if (res.indexOf("FAILEDEDIT") === -1) {
						$('#module_result_basic_info').show();
						
						$('#module_upload').hide();
						$('#moduleSave').hide();
					} else {
						$('#module_result_basic_info_failure').show();
						$('#moduleSave').hide();
						
					}
					
				}
			});
			
		}
}