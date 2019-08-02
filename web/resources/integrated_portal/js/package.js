$(document).ready(function() {	
		// Top page sortable boxes
	$(function() {
		$( "#sortable1" ).sortable({
			connectWith: ".connectedSortable",
            items:"li:not(.ui-state-disabled)",
			receive: function(event,ui){
				  var elem = $(ui.item).find('input[type="hidden"]');
				  var hrefElem = $(ui.item).find('a');
				  var count = ($('#sortable1').find('li').length)-1;
				  var newId = elem.prop("id")+count;
				  $('#sortable1 input#'+elem.prop("id")).prop("id",newId);
				  $('#sortable1 a#href-'+elem.prop("id")).prop("id",'href-'+newId);
			  }
		}).disableSelection();

		$("#sortable2" ).sortable({
			connectWith: ".connectedSortable",
			remove: function(event, ui) {
				ui.item.clone().appendTo('#sortable1');
				$(this).sortable('cancel');
			}
		}).disableSelection();
	});			
 });

// validate and submit package
function submitPackageForm() {
	$('#fail-alert-msg').css("color", "green").html("Submitting Package... Please Wait !!").show();
	var packageData = buildPackage();
	if(packageData){
		$.ajax({
			url : '/ip/toppage/package',
			type : 'POST',
			async: false,
			data : {
				"package" :packageData.toString()
			},
			success : function(responseData) {
				if(responseData == "OK"){
					window.location.reload();
					$('#fail-alert-msg').css("color", "green").html("Package Submitted !!").show();
				} else {
					$('#fail-alert-msg').css("color", "red").html(responseData+ "!!").show();
				}
			},
			error : function(e) {
				$('#fail-alert-msg').css("color", "green").html(e.message).show();
			}
		});
	} else {
		alert("Package Data is not valid!!");
	}
}

 function buildPackage(){
	 	var arpu = $( "#arpu option:selected" ).text();
	    var device = $("#device option:selected").val();
	    var siteId = $("#siteId option:selected").val();
	    var version = $("#version option:selected").val();
	    var mainBal = $("#mainBal option:selected").val();
	    var dataBal = $("#dataBal option:selected").val();
	    var xrat = $("#xrat option:selected").val();
	    var scheduled = $("span").hasClass("check-active");
	    var packageJson = {};
	    packageJson["arpu"] = arpu;
	    packageJson["deviceGroup"] = device;
	    packageJson["siteId"] = siteId;
	    packageJson["version"] = version;
	    packageJson["cardIdsList"] = [];
	    packageJson["cardTypesInfo"] = [];
	    if (mainBal.trim() != 'NONE' && dataBal.trim() != 'NONE'){
	    	packageJson["mainBal"] = mainBal;
	    	packageJson["dataBal"] = dataBal;
	    } else if ((mainBal.trim() == 'NONE' && dataBal.trim() != 'NONE')
	    		 	||(mainBal.trim() != 'NONE' && dataBal.trim() == 'NONE')){
	    	$('#fail-alert-msg').css("color", "red").html("Please select both mainBal and dataBal !").show();
	    	return false;
	    }
	    packageJson["xrat"] = xrat;
	    if(scheduled == true){
	    	var	schedulerElem = $(".check-active").parent().find('input');
	    	var ids = $(".check-active").prop("id");
	    	if(ids){
	    		ids = ids.split("-");
	    		if(ids[0] && ids.length > 1){
		    		packageJson["id"] = ids[0];
		    		packageJson["packageId"] = ids[1];
	    		}
	    	}
	    	if(schedulerElem.prop("value") != "Default"){
	    		scheduler = $(".check-active").parent().find('input').val();
	    		if(scheduler != null && scheduler != "" ){
	    			var startEndDates = scheduler.split("-");
	    			var longStartDateTime = getDateTimeInLong(startEndDates[0]);
	    			var longEndDateTime = getDateTimeInLong(startEndDates[1]);
	    			packageJson["openTime"] = longStartDateTime;
	    			packageJson["closeTime"] = longEndDateTime;
	    		}
	    	} else {
	    		packageJson["defaultPackage"] = true;
	    		packageJson["version"] = "A";
	    	}
	    } else {
	    	$('#fail-alert-msg').css("color", "red").html("Check active any package!").show();
	    	return false;
	    }
	    var failure = false;
//	  /*   alert(JSON.stringify(packageJson)); */
	    $('#sortable1 li').each(function() {    
				var inputElem = $(this).find('input[type="hidden"]');
				var cardIdElem = $(this).find('.cardId');
                 //get the type
				 if(inputElem.length > 0){
                 var type = inputElem.prop("name");
                 var subtype = inputElem.val();
                 var cardId = cardIdElem.prop("id");
                //get the subtype
                 if(cardId){
                	 packageJson.cardIdsList.push(cardId);
                 } else {
                   var card = getCard(type,subtype,device);
                     //push the object into the array
                 	if(card && card.cardId){
                 	  packageJson.cardIdsList.push(card.cardId);
                 	 cardId = card.cardId;
                 	} else {
                 		$('#fail-alert-msg').css("color", "red").html("Please create default card for "+type + "," +subtype+"!").show();
                 		failure = true;
                 		return false;
                 	}
                 } 
                 packageJson.cardTypesInfo.push({"defaultCardId":cardId,"type": type, "subType":subtype});
			}
        });
	     packageJson["status"] = "APPROVED";
	     console.log(JSON.stringify(packageJson));
	    if(failure){
	    	return false;
	    } 
	    return JSON.stringify(packageJson);
} 

 /*
  * getCard should return default card id only and it's call should be on when card subtype chosen    
  * 
  */

 function getCard(type,subtype,device){
		var varresponse = null;
		if(type && subtype && device){
			$.ajax({
				url : '/ip/toppage/getCards/'+type+'/'+subtype+'/'+device,
				type : "GET",
				async: false,
				success : function(responseData) {
					varresponse = responseData;
				}
			});	
		} else {
			return false
		}
		return varresponse;
	}

	 function updateTypeForSubTypeModel(elem){
		 $('#myModal .modal-body .msg').html("").show();
		 var typeSubtype = $(elem).attr('id');
		 var type = typeSubtype.split("-")[1];
		 var subtype = typeSubtype.split("-")[2];
		 $('#main_type').html(type); 
		 if(subtype){
			 $('#main_type').html(type+'-'+subtype);
			 $("#"+subtype).prop("checked", true);
		 } else {
			 var modalBodyEle = $('#myModal .modal-body');
			 modalBodyEle.addClass('loader');
			 modalBodyEle.find('.form-group').each(function(i){
					    var _radio = $(this).find("input[type='radio']");
					    _radio.prop('checked', false);
					});
			 modalBodyEle.removeClass('loader');
		 }
	 }

	 function setSubTypes(){
		 var mainType = $('#main_type').html();
		 var selectedField = 0;
		 if(mainType){
			 var selectedSubtype = $("input:radio[name=cardSubType]:checked").val();
			 var cardIdflag = setCardId();
			 if(selectedSubtype){
				 if(cardIdflag){	
					 $('#sortable1 input#'+mainType.toLowerCase()).val(selectedSubtype);
					 if(mainType.indexOf('-') < 0){
						 $('#sortable1 input#'+mainType.toLowerCase()).prop("id",mainType.toLowerCase()+"-"+selectedSubtype);
						 $('#sortable1 a#href-'+mainType.toLowerCase()).prop("id","href-"+mainType.toLowerCase()+"-"+selectedSubtype);
					 } else {
						 $('#sortable1 input#'+mainType.toLowerCase()).prop("id",mainType.split("-")[0]+"-"+selectedSubtype);
						 $('#sortable1 a#href-'+mainType.toLowerCase()).prop("id","href-"+mainType.split("-")[0]+"-"+selectedSubtype);
					 }
					 $('.modal-header .close').click();
				 }
			 } else {
				 $('#myModal .modal-body .msg').css("color", "red").html("choose any subtype!").show();
			 }
		 }
		 else{
			 $('#myModal .modal-body .msg').html("Main Type not set yet!").show();
		 }
	 }

	function updatePackageData(){
		var varresponse = null;
		var ids = $(".check-active").prop("id");
		var packageId = null;
		if(ids){
    		ids = ids.split("-");
    		if(ids[0]){
    			packageId = ids[0];
    		}
    	}
		if(packageId){
			$.ajax({
				url : '/ip/toppage/getPackage/'+packageId,
				type : "GET",
				async: false,
				success : function(responseData) {
					if(responseData){
						var sortable1body = "";
						var sortable2body = "";
						var cardTypes = responseData.cardTypesInfo;
						var cards = []
						if (responseData.version) {
							$("#version").val(responseData.version).change();
						}
						for(var cardType = 0; cardType < cardTypes.length; cardType++){
							sortable1body += "<li class=\"ui-state-default green-button\">"
								sortable1body += 		"<span class=\"green-line\"></span>"
										sortable1body +=        "<span class=\"text\">"+cardTypes[cardType].type+"</span>"
										sortable1body +=        "<span id=\""+cardTypes[cardType].defaultCardId+"\" class=\"add\" data-toggle=\"modal\" data-target=\"#myModal\">"
											sortable1body +=    "<input id=\"" +cardTypes[cardType].type+"-"+cardTypes[cardType].subTypes+"\" type=\"hidden\" name=\""+cardTypes[cardType].type+"\" value=\""+cardTypes[cardType].subTypes+"\"/>"
											sortable1body +=    "<a href=\"#\" onclick=\"updateTypeForSubTypeModel(this)\" id=\"href-"+cardTypes[cardType].type+"-"+cardTypes[cardType].subTypes+"\"></a>"
											sortable1body +=    "</span>"
												sortable1body +=  "</li>";
							cards.push(cardTypes[cardType].type);
						}
						
						var allcardtypes = $("#allcardtypes").val();
						var allcardtypes = allcardtypes.split(",")
						for(var cardIndex = 0; cardIndex < allcardtypes.length; cardIndex++){
//							if(cards.indexOf(allcardtypes[cardIndex].toLowerCase()) < 0){
							sortable2body += "<li class=\"ui-state-default green-button\">"
										  + "<span class=\"green-line\"></span>"
										  + "<span class=\"text\">" + allcardtypes[cardIndex].toLowerCase() + "</span>"
										  + "<span class=\"add\" data-toggle=\"modal\" data-target=\"#myModal\">"
									      + "<input id=\""+allcardtypes[cardIndex].toLowerCase()+"\" type=\"hidden\" name=\""+allcardtypes[cardIndex].toLowerCase()+"\" value=\"\" />"
									      + "<a href=\"#\" onclick=\"updateTypeForSubTypeModel(this)\" id=\"href-"+allcardtypes[cardIndex].toLowerCase()+"\"></a>"
									      +"</span>"
									      +"</li>"
//							}
						}
						$('#sortable1').html('<li class="green-button ui-state-disabled"></li>');
						$('#sortable1').append(sortable1body);
						$('#sortable2').html(sortable2body);
					}
				}
			});
		}
	}
	
	function setCardId(){
		var mainType = $('#main_type').html();
		var subtype = $("input:radio[name=cardSubType]:checked").val();
		var device = $("#device option:selected").val();
		var type = $('#sortable1 input#'+mainType.toLowerCase()).prop("name")
		var cardElem = $('#sortable1 input#'+mainType.toLowerCase()).parent();
		var card = getCard(type,subtype,device);	
		if(card && card.cardId){
			cardElem.prop("id",card.cardId);
			return true;
		} else {
			$('#myModal .modal-body .msg').css("color", "red").html("Card doesn't exist!. Please create default card for "+type + "," +subtype+"!").show();
			return false;
		}
	}
	