$(document).ready(function() {
	showDateRange();
	// Feed Manger height
	var fm = ($(window).height() );
	$("#feedManager").css("height",fm);

    $("input[name=circleList]").change(function () {
        if ($(this).prop("checked")) {
            if ($(this).prop("id") == 'panCircle') {
                $("input[name=circleList]:not(#panCircle)").prop("checked", false);
            } else {
                $("#panCircle").prop("checked", false);
            }
        } else {
            if ($(this).prop("id") != 'panCircle') {
                $("#panCircle").prop("checked", false);
            } else {
                alert("Circle Field is required!");
            }
        }
        if ($("input[name=circleList]:not(#panCircle):checked").length == 0) {
            $("#panCircle").prop("checked", true);
        }
    });

	//Crickets sort
	$( ".disables-grey" ).sortable({});

    //functions related to expand/compress content block
    $("#draggablePanelList").on("dblclick","img",function(e){
        $(this).closest(".panel").toggleClass("collapsed");
        $(this).closest(".panel").find(".fa").toggleClass("fa-expand").toggleClass("fa-compress");
        toggleExpandCompressTitle($(this).closest(".panel").find(".fa"));
    });

    $("#draggablePanelList").on("click",".panel .fa-expand,.panel .fa-compress",function(){
        console.log("clicked expand");
        $(this).closest(".panel").toggleClass("collapsed");
        $(this).toggleClass("fa-expand").toggleClass("fa-compress");
        toggleExpandCompressTitle($(this));
    });

    function toggleExpandCompressTitle(elem){
        var compressedTitle = "Compress Content";
        var expandTitle = "Expand Content";
        if(elem.attr('data-original-title') == compressedTitle){
            elem.attr('data-original-title', expandTitle).parent().find('.tooltip-inner').html(expandTitle);
        }else if(elem.attr('data-original-title') == expandTitle){
            elem.attr('data-original-title', compressedTitle).parent().find('.tooltip-inner').html(compressedTitle);
        }
    }

    $("#collapseAll").click(function(){
        $("#draggablePanelList .panel").addClass("collapsed");
        $("#draggablePanelList .fa").removeClass("fa-compress").addClass("fa-expand");
        $("#draggablePanelList .fa").attr('data-original-title', "Expand Content");
    });
	
	// Switch button
	
	$('[data-toggle="tooltip"]').tooltip();
	

	// Feed Manager Show extra info
	$('.moreinfo').hide();
		$('.more').click(function (ev) {
		   var t = ev.target
		   $('#info' + $(this).attr('target')).toggle(100, function(){
			  console.log(ev.target)
			  $(t).html($(this).is(':visible')? 'Hide extra info' : 'Show extra info')
		   });
		   return false;
		});

    $('#feedManager').on("click",".edit",function(ev){
        var t = ev.target
        $('#edit' + $(this).attr('target')).toggle(100, function(){
            $(t).html($(this).is(':visible')? 'Hide Form' : 'Edit Feed')
        });
        return false;
    });

	
	$(".lock-deactive").click(function(){
		$(this).toggleClass('lock-active');
	});

    $(".date-clear").click(function(){
       $(this).closest(".col-md-8").find(".date-range").val('');
    });

	$('#archival-type-selectpicker').on('change', function() {
		  var archivalType = $(this).val()
		  if(archivalType.toLowerCase() == "cards"){
			  $(".package-filters").hide();
			  $(".card-filters").show();
		  } else {
			  if(archivalType.toLowerCase() == "packages"){
				  $(".card-filters").hide();
				  $(".package-filters").show();
				  
			  }   
		  }
	});

    $("#cardType,select[name=cardSubType],select[name=deviceGroup]").on("change",function(){
        $(".navLoader").show();
        $("#cardTypeForm").submit();
    });

    var url = location.href;
    if(url){
        if(url.match("/ip/cards")){
            $('select[name=selectSection]').val("cardDesign");
            $('.selectpicker').selectpicker('refresh');
        }else if(url.match("/ip/toppage")){
            $('select[name=selectSection]').val("topPage");
            $('.selectpicker').selectpicker('refresh');
    	}else if(url.match("/ip/entertainment")){
    		$('select[name=selectSection]').val("entertainment");
    		$('.selectpicker').selectpicker('refresh');
    	}
    }

    $("select[name=selectSection]").on("change",function(){
        var selection = $(this).val();
        $(".navLoader").show();
        if(selection == 'topPage'){
            location.href = "/ip/toppage";
        }
        if(selection == 'cardDesign'){
            location.href = "/ip/cards";
        }
        if(selection == 'entertainment'){
        	location.href = "/ip/entertainment/page";
        }
    });

	
    
    
	//Feed Manager Slide
	$("#feedPop").click(function(){
		$("#feedManager").animate({ "right": "0px" }, "slow" );
		$(".overlay").fadeIn(200);
        showDateRange(true);
		return false;
	});
	
	$(".feedClose").click(function(){
		$("#feedManager").animate({ "right": "-670px" }, "slow" );
		$(".overlay").fadeOut(200);
       $(".moreinfo").hide();
        showDateRange(false);
		return false;
	});

    $("#archivePop").click(function(){
        showDateRange(true);
        $("#archiveManager").animate({ "right": "0px" }, "slow" );
        $(".overlay").fadeIn(200);
        return false;
    });
    
    $(".archiveClose").click(function(){
        showDateRange(false);
        $("#archiveManager").animate({ "right": "-670px" }, "slow" );
        $(".overlay").fadeOut(200);
        return false;
    });


	    
		jQuery(function($) {
        var panelList = $('#draggablePanelList');
        panelList.sortable({
            handle: '.panel-heading', 
            update: function() {
                $('.panel', panelList).each(function(index, elem) {
                     var $listItem = $(elem),
                         newIndex = $listItem.index();
                });
            }
        });
    });
 });

// Switch button
$("body").on("click",".toggleSwitch",function() {
    var span = $(this).find('span');
    if(span.hasClass('active')){
        $(this).find('input').val(true);
    } else {
        $(this).find('input').val(false);
    }
    span.toggleClass("active");
});

$( window ).resize(function() {
  var fm = ($(window).height() );
	$("#feedManager").css("height",fm)	;
});

function getDateTimeInLong(dateTime){
	 var a=dateTime.trim().split(" ");
	 var date=a[0].split("/");
	 var time=a[1].split(":");
	 var dateObj = new Date(date[2],date[0]-1 ,date[1],time[0],time[1]);
	 longDate = dateObj.getTime();
	 return longDate
 }

$("#addNewContent").click(function (e) {
	if($('#draggablePanelList li').length < 10){
		_panel = $(".content-panel .panel").clone();            
		$('#draggablePanelList').prepend(_panel);
	} else {
		alert("Oops! content limit is reached. 10 contents are already added.");
	}
});

$( document ).ready(function() {

    $("#draggablePanelList").on("focusout", "input[name=videoUrl]" ,function() {
        var a = $(this).val();
        var imageUrl = getYoutubeImageUrlFromYoutubeUrl(a);
        if(imageUrl){
            $(this).closest(".row").find(".changeImg img").attr("src",imageUrl);
            $(this).closest(".row").find("input[name=thumbnailUrl]").val(imageUrl);
        }
    });

	$("#draggablePanelList").on("focusout", "input[name=thumbnailUrl]" ,function() {
		var a = $(this).val();
		var imgValue = $(this).closest(".row").find(".changeImg img").attr("src",a);
	});

	$("#creationTime").change(function () {
		$("#lastUpdatedDate").val($('#creationTime').val());
	});

//	$('#videoUrl').change(function(){
//	autoFillContentFields();
//	});

});

var url = location.href;
if(url){
    if(url.match("/ip/entertainment/page")){
        $('select[name=subSection]').val("landingPage");
        $('.selectpicker').selectpicker('refresh');
    }
    else if(url.match("/ip/entertainment/list/.*")){
        $('select[name=subSection]').val("editList");
        $('.selectpicker').selectpicker('refresh');
	}
    else if(url.match("/ip/entertainment/list")){
        $('select[name=subSection]').val("listCreation");
        $('.selectpicker').selectpicker('refresh');
	}
}

$("select[name='subSection']").on("change",function(){
	var selection = $(this).val();
	if(selection == 'landingPage'){
		location.href = "/ip/entertainment/page";
	}
	if(selection == 'listCreation'){
		location.href = "/ip/entertainment/list";
	}	
});

function isValidList(){
	var message = '';
	if(!$('#deviceGroupSelect').val()){
		message += "select device group\n"; 
	}
	if(!$('#listTitle').val()){
		message += "List Title Empty \n";
	}
	if(!$('#listDesc').val()){
		message += "List Description is Empty \n";
	}
	if($('#draggablePanelList li').length <= 0){
		message += "0 content added \n";
	}
	if(message == ''){
		return true;
	}
	else{
		alert(message);
		return false;
	}
}

$('#saveData').click(function (e) {

	e.preventDefault();
	if(!isValidList()){
		return;
	}
	$("#loader").show();
	var listTitle = $('#listTitle').val();
	var listDesc = $('#listDesc').val();	
	var circleList = [];
	$("input[name='circleList']:checked").each(function() {
		circleList.push(this.value)
	});

    var listId = $("input[name=listId]").val().trim();
	var deviceGroupList = $('#deviceGroupSelect').val();
	var creationTimeInMilis = $('#creationTime').val();
	var publishTime = $('#publishTime').val();
	var publishTimeInMilis = Date.parse(publishTime?publishTime:Date());
	var listType = $('#listType').val();
	var listCategory = $('#listCategory option:selected').val();
	var isFeatured = $('#isFeatured option:selected').val();
    if(listCategory){
        listCategory = listCategory.toLowerCase().replace(/\s+/g,"_");
    }
	var showOnTop = $('#showOnTop').val()?$('#showOnTop').val():"No";
	var priority = $('input[name=priority]')?$('input[name=priority]').val():null;
	var listCreatedUser = $('input[name=listCreatedUser]').val();
	var listModifiedUser = $('input[name=listModifiedUser]').val();
    var tagsList = [];

	var formDataJson = {};
	var contentList = [];

    formDataJson["listId"] = listId;
	formDataJson["id"] = $('#objId').val().trim() == '' ? null: $('#objId').val().trim();
	formDataJson["listTitle"] = listTitle;
	formDataJson["listDesc"] = listDesc;
	formDataJson["circles"] = circleList;
	formDataJson["deviceGroup"] = deviceGroupList;
	formDataJson["creationDate"] = creationTimeInMilis?creationTimeInMilis:0;
	formDataJson["publishTime"] =  publishTimeInMilis;	
	formDataJson["listType"] = listType;
	formDataJson["listCategory"] = listCategory;
	formDataJson["isFeatured"] = isFeatured;
	formDataJson["showOnTop"] = showOnTop;
	formDataJson["priority"] = priority;
    formDataJson["createUserId"]=listCreatedUser;
    formDataJson["modifiedUserId"]=listModifiedUser;
    var LIST_CATEGORY_PREFIX = "category_";
    var DEVICE_GROUP_PREFIX = "dg_";
    var LIST_TYPE_PREFIX = "listtype_";
    var CIRCLE_PREFIX = "circle_";
    var FEATURED_PREFIX = "featured_";
    var ENABLED_ON_TOP_PAGE_PREFIX = "enabledontop_";
    var ALL_CIRCLES = "circle_all";
    for(var t=0;circleList && t<circleList.length;t++){
        var circle = circleList[t];
        if(circle == "pan"){
            tagsList.push(ALL_CIRCLES);
            break;
        }
        tagsList.push(CIRCLE_PREFIX+circle);
    }

    for(var t=0;deviceGroupList && t<deviceGroupList.length;t++){
        var dg = deviceGroupList[t];
        if(dg == "S"){
            tagsList.push(DEVICE_GROUP_PREFIX+"supersmart");
        }
        else if(dg == "NS") {
            tagsList.push(DEVICE_GROUP_PREFIX + "smart");
            tagsList.push(DEVICE_GROUP_PREFIX + "middle");
            tagsList.push(DEVICE_GROUP_PREFIX + "low");
        }
    }
    if(listType){
        tagsList.push(LIST_TYPE_PREFIX+listType.toLowerCase());
    }
    if(listCategory){
        tagsList.push(LIST_CATEGORY_PREFIX+listCategory.toLowerCase());
    }
    if(isFeatured){
        tagsList.push(FEATURED_PREFIX+isFeatured.toLowerCase());
    }
    if(showOnTop){
        tagsList.push(ENABLED_ON_TOP_PAGE_PREFIX+showOnTop.toLowerCase());
    }
    formDataJson["tagsList"]=tagsList;
	$('#draggablePanelList li').each(function() {

        var id = $(this).find("input[name=contentId]").val().trim()==''?null:$(this).find("input[name=contentId]").val().trim();
		var subListTitle = $(this).find("input[name=subListTitle]").val().trim();
		var subListDesc = $(this).find("input[name=subListDesc]").val().trim();
		var videoUrl = $(this).find("input[name=videoUrl]").val().trim();
		var thumbnailUrl = $(this).find("input[name=thumbnailUrl]").val().trim();
		var courtesyText = $(this).find("input[name=courtesyText]").val().trim();
		var albumName = $(this).find("input[name=albumName]").val().trim();
		var genre = $(this).find("input[name=genre]").val().trim();
		var tags = $(this).find("input[name=tag]").val().trim();
		var createdUserId = $(this).find("input[name=contentCreatedUser]").val().trim();
		var modifiedUserId = $(this).find("input[name=contentModifiedUser]").val().trim();
		var creationDate = $(this).find("input[name=contentCreatedAt]").val().trim();
        var generList = genre.split(",").filter(function(value){
            return value? value.trim() != '' : false;
        });
        var tagList = tags.split(",").filter(function(value){
            return value? value.trim() != '' : false;
        });
		contentList.push({
            'subListTitle' : subListTitle,
			'subListDesc' : subListDesc,
			'videoUrl' : videoUrl,
			'thumbnailUrl' : thumbnailUrl,
			'courtesyText' : courtesyText,
			'albumName' : albumName,
			'genre' : generList,
			'tags'  : tagList,
            'createUserId':createdUserId,
            'modifiedUserId':modifiedUserId,
            'id':id,
            'creationDate':creationDate
		});

	});


	formDataJson["contentList"] = contentList;

	console.log(JSON.stringify(formDataJson));

	$.ajax({
		url : '/ip/entertainment/list',
		type : 'POST',
		data : {"list" :JSON.stringify(formDataJson)},
		async: false,		
		success : function(data){
			if (!data.match("FAILED")) {
				alert("Data Saved SuccessFully");
				$("#loader").show();
                window.location = "/ip/entertainment/list/"+data;
			}
			else{
				alert("Some ERROR occured, Data Not Saved");
				$("#loader").hide();
			}
		}
	});
});


$('.savePageData').click(function (e) {

	e.preventDefault();
	$("#loader").show();
	var contentList = [];

	$('#draggablePanelList li').each(function(index) {
		var listId = $(this).data("id");
        console.log(index,listId);
		contentList.push({'id' : listId,'priority':index});
	});

    if(contentList.length>10){
        alert("Priority Limit (10) exceeded!! Please remove some items");
        $("#loader").hide();
        return;
    }
	console.log(JSON.stringify(contentList));

	$.ajax({
		url : '/ip/entertainment/page',
		type : 'POST',
		data : {"page":JSON.stringify(contentList)},
		success : function(data){
			if (!data.match("FAILED")) {
				alert("Updated priority successfully");
				$("#loader").hide();
			}else{
				alert("Some ERROR occured, Data Not Saved");
				$("#loader").hide();
			}
            location.href = "/ip/entertainment/page";
		},
		error: function(e){
			console.log(e);
		}
	});
});

$('#loadData,.paginationBox .f_am_prev,.paginationBox .f_am_next').unbind("click").bind("click",function (e) {
	e.preventDefault();
	$("#loader").show();
	var circle = $('.topFeedSec #circleSelect option:selected').val();
	var device = $('.topFeedSec #deviceGroupSelect option:selected').val();
	var listId = $('.topFeedSec .feed-listid').val();
	var dateRange = $('.topFeedSec .feedDatePicker').val();
    var fromDate;
    var toDate;
    if (dateRange) {
        var startEndDates = dateRange.split("-");
        var longStartDateTime = getDateTimeInLong(startEndDates[0]);
        var longEndDateTime = getDateTimeInLong(startEndDates[1]);
        fromDate = longStartDateTime;
        toDate = longEndDateTime;
    }

	var formdata = {
		'device' : device,
		'circle' : circle
	};
    if(fromDate && toDate){
        formdata['fromTime'] = fromDate;
        formdata['toTime'] = toDate;
    }
    if(listId){
        formdata['id'] = listId;
    }

    var n = 10;
    var pos = 0;
    if($(this).hasClass("f_am_prev")) {
        var currentPageNum = parseInt($("#ingestedPagination #f_pageNumber").val());
        var prevPageNum = currentPageNum - 1;
        var totalPageNum = parseInt($("#ingestedPagination #f_totalPages").text());
        if(prevPageNum<totalPageNum){
            $(".f_am_next").show();
        }
        if (prevPageNum == 1) {
            $(".f_am_prev").hide();
        }
        pos = (prevPageNum-1) * n;
        $("#ingestedPagination #f_pageNumber").val(prevPageNum);
    }

    if($(this).hasClass("f_am_next")){
        var currentPageNum = parseInt($("#ingestedPagination #f_pageNumber").val());
        var nextPageNum = currentPageNum + 1;
        if(nextPageNum>1){
            $(".f_am_prev").show();
        }
        var totalPageNum = parseInt($("#ingestedPagination #f_totalPages").text());
        if (nextPageNum == totalPageNum) {
            $(".f_am_next").hide();
        }
        pos = (nextPageNum-1) * n;
        $("#ingestedPagination #f_pageNumber").val(nextPageNum);
    }

    formdata["num"]=n;
    formdata["pos"]=pos;

	$.ajax({
		url : '/ip/entertainment/ajax/list',
		type : 'GET',
		data : formdata,
		contentType : false,
		success : function(data){
			console.log("success");
			$("#loader").hide();
			$('#responseDiv').html(data);
            var total_num = $('#responseDiv').find(".actl_tc").val();
            var num = $('#responseDiv').find(".actl_num").val();
            var pos = $('#responseDiv').find(".actl_pos").val();

            var numPages = 0;
            if(num>0) {
                numPages = Math.ceil(total_num / num);
                if (numPages > 0) {
                    var current_page_number = Math.floor(pos / num) + 1;
                    if (current_page_number == 1) {
                        $("#ingestedPagination .f_am_prev").hide();
                    }else{
                        $("#ingestedPagination .f_am_prev").show();
                    }
                    if (current_page_number == numPages) {
                        $("#ingestedPagination .f_am_next").hide();
                    } else{
                        $("#ingestedPagination .f_am_next").show();
                    }
                    $("#ingestedPagination #f_pageNumber").val(Math.floor(pos / num) + 1);

                    $("#ingestedPagination").show();
                }else{
                    $("#ingestedPagination").hide();
                }
                console.log(numPages);
                $("#ingestedPagination #f_totalPages").html(numPages);
            }
		},
		error: function(e){
			console.log(e);
		}
	});
});


$('.loadPageData').click(function (e) {
	e.preventDefault();
	$("#loader").show();
	
	var circle = $("input[name=circleList]:checked").val();
	var device = $('#deviceGroupSelect').val();
	
	var formdata = {
		'device' : device,
		'circle' : circle
	};
	
	$.ajax({
		url : '/ip/entertainment/page',
		type : 'GET',
		data : formdata,
		contentType : false,
		success : function(data){
			console.log("success");
			$("#loader").hide();
			$('#draggablePanelList').html(data);
		},
		error: function(e){
			console.log(e);
		}
	});
});


$("body").on("click",".editList",function(e){
	e.preventDefault();
	var id = $(this).attr("data-value");
	location.href="/ip/entertainment/list/"+id;
});

$("body").on("click",".removeListItem",function(e){
    e.preventDefault();
    if(confirm("Do you want to remove this list? ")){
        $(this).closest(".panel").remove();
    }
});

$('#dataSource').on('change', function () {
	$('#searchBox').css('display', 'none');
	$('#top10Search').css('display', 'block');
});

function addCardSchedulerRow() {
//    var defaultCardDataId = $('#scheduler-row').find('.row:nth-child(2)').first().find('.cardDataId').html();
//    if (defaultCardDataId == null || !defaultCardDataId.trim()) {
//        alert('Please create a default card first');
//        return;
//    }
    addSchedulerRow();
    $('#scheduler-row').find('.input-group-addon').removeClass('check-active');
    $('#scheduler-row').find('.row').last().find('.input-group-addon').addClass('check-active');
    $('#cardUniqueId').val('');
    $('#defaultCard').val('false');
    $('#creationDate').val(0);
    $('#lastUpdated').val(0);
}

function showDateRange(enablePastDate){
    $('.date-range').prop("readonly",true);
	$('.date-range').daterangepicker({
		timePicker: true,
		minDate: enablePastDate?0:moment(),
		opens: 'left',
		timePickerIncrement: 1,
		format: 'MM/DD/YYYY HH:mm'
	  }, function(start, end, label) {
		console.log(start.toISOString(), end.toISOString());
	  });
	
	$('.singledate').daterangepicker({
		timePicker: true,
        singleDatePicker : true,
        showDropdowns: true,
        startDate:moment(),
        format : 'MM/DD/YYYY HH:mm'
	}, function(start, end, label) {
		console.log(start.toISOString(), end.toISOString());
	});
}

function showDateRangeOnActive(enablePastDate){
	var dateElement = $('.input-group-addon.schedulerCheck.check-active').next('input.date-range');
	dateElement.prop("readonly",true);
	dateElement.daterangepicker({
		timePicker: true,
		minDate: enablePastDate?0:moment(),
		opens: 'left',
		timePickerIncrement: 1,
		format: 'MM/DD/YYYY HH:mm'
	  }, function(start, end, label) {
		console.log(start.toISOString(), end.toISOString(), label);
	  });
}

function addSchedulerRow(){
	var schedulerBody = "<div class=\"row\">"
                        +"<div class=\"form-group clearfix\">"
                        +"<div class=\"col-sm-12 col-sm-10\">"
                        +"<div class=\"input-group\">"
                        +"<span class=\"input-group-addon check-deactive\"></span>"
                        +"<input type=\"text\" class=\"form-control scheduleS date-range\" placeholder=\"click to Schedule\">"
                        +"</div>"
                        +"</div>"
                        +"</div>"
                        +"</div>";
	$('#scheduler-row').append(schedulerBody);
	showDateRange();	
}

//Feed Manger height
var fm = ($(window).height() );
$("#feedManager").css("height", fm);

var tabH = $(".topFeedSec").height() + 220;
$("#feedManager .tab-content").css("height", fm - tabH);

$(".check-deactive").click(function () {
    $(this).toggleClass('check-active');
});
$(".lock-deactive").click(function () {
    $(this).toggleClass('lock-active');
});

$(window).resize(function () {
    var fm = ($(window).height() );
    $("#feedManager").css("height", fm);
    var tabH = $(".topFeedSec").height() + 20;
    $(".tab-content").css("height", fm - tabH);
});

$("body").on("click",".removeContent",function(e){
    e.preventDefault();
    var isRemove = confirm("Do you want to remove this content?");
    if(isRemove){
        $(this).closest("li.panel").remove();
        return;
    }
});

$("#list-cat-group").on("keyup",".listCategory > .dropdown-menu > .bs-searchbox > input",function(){

    var noResults = $(this).closest(".dropdown-menu").find(".no-results");
    if(noResults && noResults.length>0){
        var enteredText = $(this).val();
        var addText = "Add '"+enteredText+"'";
        if($(this).closest(".dropdown-menu").find("#add-categories") && $(this).closest(".dropdown-menu").find("#add-categories").length >0){
            $(this).closest(".dropdown-menu").find("#add-categories").data("categories",enteredText);
            $(this).closest(".dropdown-menu").find("#add-categories").html(addText);
            $(this).closest(".dropdown-menu").find("#add-categories").show();
        }else{
            $(this).closest(".dropdown-menu").append("<button class='btn btn-primary btnColor' id='add-categories' data-categories='"+enteredText+"'>"+addText+"</button>");

        }
    }else{
        if($(this).closest(".dropdown-menu").find("#add-categories")){
            $(this).closest(".dropdown-menu").find("#add-categories").hide();
        }
    }
});

$("#list-cat-group").on("click",".dropdown-menu #add-categories",function(e){
    e.preventDefault();
    if($(this).data("categories") && $(this).data("categories").trim()==''){
        alert("Empty category are not allowed to be added");
        return;
    }
    var categoryName = encodeURI($(this).data("categories").trim());
    var newCatKey = $(this).data("categories").trim().toLowerCase().replace(/\s+/g,"_");
    console.log(newCatKey);
    $.ajax({
        url : '/ip/entertainment/add-category/'+categoryName,
        type : 'GET',
        success : function(data){
            $(".listCategory optgroup").html("");
            for(var t=0;data && t<data.length;t++){
                $(".listCategory optgroup").append($("<option></option>").attr("value",data[t]).text(data[t].replace(/(_)+/g," ")));
            }
            $(".listCategory").val(newCatKey);
            $('.selectpicker').selectpicker('refresh');
            console.log("success: "+data);
        },
        error: function(e){
            console.log(e);
        }
    });
    if($("#add-categories")){
        $("#add-categories").hide();
    }
});

function getYoutubeImageUrlFromYoutubeUrl(url) {
    var videoId = extractVideoIdFromYoutubeUrl(url);
    var uImg = "http://img.youtube.com/vi/";
    var endPart = "/0.jpg";
    if (videoId && videoId.length >= 11) {
        return uImg + videoId + endPart;
    }
    return "";
}

function extractVideoIdFromYoutubeUrl(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if ( match && match[7].length >= 11 ){
        return match[7];
    }else{
        console.log("Could not extract video ID.");
        return "";
    }
}