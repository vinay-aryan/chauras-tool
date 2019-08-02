var isNewPath = false;
$(function() {
	
	$('#newMedia').live('click', function(event) {
		event.preventDefault();
		$("#mediaSaveLocationSelect").val('');
		$('#editMediaDiv').modal('show');
	});
	
	$("#btnEnterLoc").live("click", function(event) {
		event.preventDefault();
		$("#mediaViewLocationSelect").val($("#enterLocation").val());
		$('#getMediaForm').submit();
	});
	
	$('.edit_button').live('click', function(event) {
		event.preventDefault();
		
		var mediaLoc = $("#mediaViewLocationSelect").val();
		$("#mediaSaveLocationSelect").val(mediaLoc);
		$('#editMediaDiv').modal('show');
	});
	
	$('#addFiles').live('click', function(event) {
		event.preventDefault();
		var html = '<div class="fileInputGroup"><input id="file" type="file" name="file" size="50000000000" /><span></span><div>';
		$("div#mediaFilesEditDiv").append(html);
	});
	
	$('#removeFiles').live('click', function(event) {
		event.preventDefault();
		var fileInputElements = $('#mediaFilesEditDiv .fileInputGroup');
		var length = fileInputElements.length;
		if(length != 1){
			fileInputElements.first().remove();
		}
	});

	$('body').on("change", "input[name='file']", function(e) {
		var files = e.originalEvent.target.files;
		var fileName = files[0].name;
		var extension = files[0].name.split('.').pop();
		if(extension == 'png') {
			$(this).next('span').removeClass('text-green').addClass('text-red').html("Cannot upload a PNG image, Size="+Math.floor(files[0].size/1024) + "KB");
			$('#upload').prop('disabled', true);
		} else {
			$(this).next('span').removeClass('text-red').addClass('text-green').html("Size="+Math.floor(files[0].size/1024) + "KB");
			$('#upload').prop('disabled', false);
		}
	})

	$("img.showMediaInfo").bind('load', function() {
		var height = this.naturalHeight;
		var width = this.naturalWidth;
		$(this).parent().next().after("<div>Dimension="+width+"x"+height+"px</div>");
	});

	$('#editMediaForm').on('submit',function(event) {
		var isOk = true;
		var html = "";
		if(!isNewPath) {
			if($("[name=basePath]").val() == "") {
				event.preventDefault();
				isOk = false;
			}
		}
		else{
			if($("#alias").val() == null || $("#alias").val() == "" || $("#folderLoc").val() == null || $("#folderLoc").val() == "") {
				event.preventDefault();
				isOk = false;
			}
		}
		if($("#file").val() == ""){
			event.preventDefault();
			isOk = false;
		}
		if(isOk) {
			html = "Uploading !!!<img src='../resources/img/loader.gif'/>";
		}
		else{
			html = "Select folder and file!!!";
		}
		$("#result_site_add").html(html);
	});
	
});

function deleteImage(url) {
	if (confirm('Click OK to confirm delete')) {
		var data = {
				"url" : url	
		};
		var redirectUrl = "media/index?mediaViewLocationSelect="+$("#mediaViewLocationSelect").val()+"&mediaBasePath="+$("#mediaBasePath").val();
		if($("#searchCB").is(":checked")) {
			redirectUrl += "&searchCB=on&mediaBasePath="+$("#enterLocation").val();
		}
		$.ajax({
			url : 'media/deleteFile',
			data : data,
			type : "POST",
			success : function(res) {
				window.location.replace(redirectUrl);
			}
		});
	}
}

function setLocationParam() {
	$("#mediaViewLocationSelect1").val($("#mediaSaveLocationSelect").val());
	$("#mediaBasePath1").val($("#mediaBasePath").val());
}

function editFolder() {
	if($("#editFolderCB").is(":checked")) {
		isNewPath = true;
		$("#alias").prop("type","text");
		$("#folderLoc").prop("type","text");
		$("#mediaSaveLocationSelect").hide();
		$("#mediaSaveLocationSelect").val("");
	}
	else{
		isNewPath = false;
		$("#alias").prop("type","hidden");
		$("#folderLoc").prop("type","hidden");
		$("#mediaSaveLocationSelect").show();
	}
}

function searchManualEnteredLoc() {
	if($("#searchCB").is(":checked")) {
		$("#mediaBasePath").removeAttr("name");
		$("#enterLocation").prop("type","text");
		$("#enterLocation").attr("name","mediaBasePath");
		$("#btnEnterLoc").prop("type","button");
		$("#mediaBasePath").hide();
		$("#mediaBasePath").val("");
	}
	else{
		$("#enterLocation").removeAttr("name");
		$("#enterLocation").prop("type","hidden");
		$("#btnEnterLoc").prop("type","hidden");
		$("#mediaBasePath").attr("name","mediaBasePath");
		$("#mediaBasePath").show();
	}
}

function getFolders() {
	var url = "media/getFolders";
	var data = {
			basePath : $("[name=basePath]").val(),
			mediaSaveLocationSelect : $("[name=mediaSaveLocationSelect]").val()
	};
	var imageHtml = "Getting folders!!! <img src='../resources/img/loader.gif'/>";
	$("#result_site_add").html(imageHtml);
	$.post(url, data, function(data) {
		var folders = data["folders"];
		var selectToText = data["selectToText"];
		var basePath = data["basePath"];
		var html = "<option value=''>--select--</option>";
		for(var i = 0; i < folders.length; i++) {
			html += "<option value='"+ folders[i] +"'>"+ folders[i] +"</option>";
		}
		$("#mediaSaveLocationSelect").html(html);
		if(selectToText != undefined && selectToText != null && selectToText == "on") {
			$('#editBasePathCB').trigger('click');
			if(!$('#editBasePathCB').is(":checked")) {
				$('#editBasePathCB').trigger('click');
			}
		}
		if(basePath != undefined && basePath != null && $("#editBasePathCB").is(":checked")) {
			$("#basePathText").val(basePath);
		}
		$("#result_site_add").html("");
	});
}

function setAppendTimeStamp(){
    if($("#appendTimestampToFile").is(":checked")){
        $("#appendTS").val("true");
    }else{
        $("#appendTS").val("false");
    }
}

function editBasePath() {
	if($("#editBasePathCB").is(":checked")) {
		$("#basePath").removeAttr("name");
		$("#basePathText").prop("type","text");
		$("#basePathText").attr("name","basePath");
		$("#basePath").hide();
		$("#btnGetFolders").prop("type","button");
	} else{
		$("#basePathText").removeAttr("name");
		$("#basePathText").prop("type","hidden");
		$("#basePath").attr("name","basePath");
		$("#basePath").show();
		$("#btnGetFolders").prop("type","hidden");
	}
}