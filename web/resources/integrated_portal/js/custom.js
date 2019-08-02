$(document).ready(function() {	
	// Feed Manger height
	var fm = ($(window).height() );
	$("#feedManager").css("height",fm);

	//Crickets sort
	$( ".disables-grey" ).sortable({});
	
	// Switch button
	$( ".switch" ).click(function() {
		if($('.switch span').hasClass('active')){
			$('.switch input').val(true);
			$('#liveMatchList').show();
		} else {
			$('.switch input').val(false);
			$('#liveMatchList').hide();
		}
		$('.switch span').toggleClass("active");
	});
	
    $('.scheduleS').prop("readonly",true);
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
		return false;
	});
	
	$(".feedClose").click(function(){
		$("#feedManager").animate({ "right": "-670px" }, "slow" );
		$(".overlay").fadeOut(200);
       $(".moreinfo").hide();
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
/*
function getSubTypes(type){	
	var modalBodyEle = $('#myModal .modal-body');
	var subTypeVal = $('#'+type.toLowerCase()).val();
	var subtypes = (subTypeVal) ? subTypeVal.split(",") : '';
	modalBodyEle.addClass('loader');
	modalBodyEle.find('.form-group').hide();
	$.ajax({
		url : '/ip/toppage/getsubtypes?type='+type,
		type : "GET",	
		success : function(responseData) {
			//console.log(responseData);
			if(responseData && responseData.length > 0){
				var modalBodyData="";
				for(var rd = 0; rd<responseData.length; rd++){
					modalBodyData += "<div style='display:none;' class=\"form-group clearfix\">";
					modalBodyData += "       	<div class=\"col-md-5 lineH\"><input checked='' type=\"checkbox\" id='"+responseData[rd].toLowerCase()+"' name='"+responseData[rd].toLowerCase()+"' \/>&nbsp;&nbsp;<label for='"+responseData[rd].toLowerCase()+"'>"+responseData[rd]+"<\/label><\/div>";
					modalBodyData += "       <\/div>";
				}
				modalBodyEle.html(modalBodyData + "<span style='display:none' id='main_type'>"+type+"</span>");
				modalBodyEle.find('.form-group').each(function(i){
					var _checkbox = $(this).find("input[type='checkbox']");
					if(subtypes && subtypes.indexOf(_checkbox.prop('name').toLowerCase()) >= 0){
						_checkbox.prop("checked", true);
					}
					else{
						_checkbox.prop("checked", false);
					}
				});
				modalBodyEle.removeClass('loader');
				modalBodyEle.find('.form-group').show();
			}
		},
		error : function(e) {
			alert("error :" + e.message)
		}
	});
}
*/
function showDateRange(enablePastDate){
    $('.date-range').prop("readonly",true);
	$('.date-range').daterangepicker({
		timePicker: true,
		minDate: enablePastDate?0:moment(),
		opens: 'left',
		timePickerIncrement: 1,
		format: 'MM/DD/YYYY HH:mm'
	  }, function(start, end, label) {
		console.log(start.toISOString(), end.toISOString(), label);
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
