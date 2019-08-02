$(document).ready(function () {

	$('.selectpicker').selectpicker();
	showDateRangeOnActive();

    var langTextElement;
    var extraContentFileds = $('#extraContentFileds').val();
    if(extraContentFileds){
    	var extraFields = extraContentFileds.split(",");
    	 for(var i=0;i < extraFields.length;i++){
    		 var idField = ".cardContent-" + extraFields[i];
    		 $(idField).show();
    	 }
    }

    $('body').on('click', '.input-group-addon', function () {
        textElement = $(this).prev();
        var modalDiv = $('#myModal');
        modalDiv.find('input.entext').first().val('');
        modalDiv.find('input.hitext').first().val('');

        if (textElement.val() != null && textElement.val() != "") {
            var textData = JSON.parse(textElement.val());
            modalDiv.find('input.entext').first().val(textData.en);
            modalDiv.find('input.hitext').first().val(textData.hi);
        }
    });

    $('body').on('click', 'input.mutliLinugal', function () {   
        textElement = $(this);
        var modalDiv = $('#myModal');
        modalDiv.find('input.entext').first().val('');
        modalDiv.find('input.hitext').first().val('');

        if (textElement.val() != null && textElement.val() != "") {
            var textData = JSON.parse(textElement.val());
            modalDiv.find('input.entext').first().val(textData.en);
            modalDiv.find('input.hitext').first().val(textData.hi);
        }
        $('#myModal').modal('show');

    });

    $('.modal').on('shown.bs.modal', function() {
        $(this).find('input.entext').focus();
    });

    $('body').on('change', 'select.compatibleDeviceGroupSelector', function() {
    	var listDeviceGroup = "";
    	if($(this).val() != null) {
    		$.each($(this).val(), function(index, value) {
        		listDeviceGroup = listDeviceGroup+""+value+";";
        	})
    	}
    	$(this).nextAll('input').val(listDeviceGroup);
    });

    var providerList = $('div#providerList').text();
    var contentPartnerList = {};
    if(providerList != null && providerList != '') {
    	contentPartnerList = JSON.parse($('div#providerList').text());
    }

    autoCompleteOpt = {
        	source: contentPartnerList, 
        	minLength: 0, 
        	response: function( event, ui ) {
    	    	if(ui.content.length >= 6) {
    	    		$("ul.ui-autocomplete").addClass("heightAutocomplete");
    	    	}else{
    	    		$("ul.ui-autocomplete").removeClass("heightAutocomplete");
    	    	}
        	}
        };

    $("input[name='contentPartner']").on("focus.autocomplete", null , function() {
    	$(this).autocomplete(autoCompleteOpt);
    });

    $("input[name='cardContentPartner']").on("focus.autocomplete", null , function() {
    	$(this).autocomplete(autoCompleteOpt);
    });

    $("body").on("focusout","input[name=contentImageUrl]",function(){
        //console.log("Focus out "+ $(this).val());
        var imageUrl = $(this).val();
        console.log('Image url: '+ imageUrl);
        if(imageUrl){
            if(validateUrl(imageUrl)){
                console.log('valid Image url');
                $(this).closest(".row").find(".changeImg img").attr("src",imageUrl);
            }else{
                console.log("not a valid Image url");
            }
        }
    });

    $("body").on("focusout","input[name=appRating]",function(){
        //console.log("Focus out "+ $(this).val());
        var appRating = $(this).val();
        appRating = appRating?appRating.trim():"";
        $(this).val(appRating);
        if(appRating){
            if(isNaN(appRating)){
                $(this).css( {
                    "background-color": "#FFBABA"
                });
               alert("Please enter rating value between 0 and 5");
               $(this).focus();
               return;
            }
            var appRatingNum = parseFloat(appRating);
            if(isNaN(appRatingNum) || appRatingNum <0 || appRating>5){
                $(this).css( {
                    "background-color": "#FFBABA"
                });
                alert("Please enter rating value between 0 and 5");
                $(this).focus();
                return;
            }
            $(this).val(appRatingNum);
        }
        $(this).css({"backgroundColor":"#fff"});
    });

    $("body").on("focusout","input[name*='Url']",function(){
        //console.log("Focus out "+ $(this).val());
        var url = $(this).val();
        if(url){
            if(!validateUrl(url)){
                $("#cardDataSubmit").prop("disabled",true);
                $(this).css( {
                    "background-color": "#FFBABA"
                });
                $(this).focus();
                console.log("Entered Url is not valid url");
            }
            else{
                if($(this).attr("name")=='contentUrl'){
                    var contentCategory = $(this).closest(".panel").find("select[name=contentCategory]").val();
                    var enableSuggestion = false;
                    if(contentCategory && contentCategory.startsWith("VAS_")){
                        enableSuggestion = false;
                    }
                    if(enableSuggestion){
                        var suggestedPackType = suggestPackType(url);
//                    Selecting suggested pack
                        if(suggestedPackType && confirm("Selecting "+suggestedPackType+" as packType. Do you want to continue with this change?")){
                            $(this).closest(".panel").find("select[name='packtype']").val(suggestedPackType);
                            $(this).closest(".panel").find("select[name='packtype']").selectpicker('refresh');
                            $(this).closest(".panel").find("input[name='showDataPack']").val(true);
                            $(this).closest(".panel").find("input[name='showDataPack']").closest('.toggleSwitch').find('span').removeClass("active");
                        }else{
                            $(this).closest(".panel").find("input[name='showDataPack']").val(false);
                            $(this).closest(".panel").find("input[name='showDataPack']").closest('.toggleSwitch').find('span').addClass("active");
                            /*$(this).closest(".panel").find(".toggleSwitch span input").val(false);
                             $(this).closest(".panel").find(".toggleSwitch span").addClass("active");*/
                        }
                    }
                }
                $(this).css({"backgroundColor":"#fff"});
                $("#cardDataSubmit").prop("disabled",false);
            }
        }else{
            $(this).css({"backgroundColor":"#fff"});
            $("#cardDataSubmit").prop("disabled",false);
        }
    });

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

    $("input[name=languageList]").change(function () {
        if ($(this).prop("checked")) {
        } else {
            if ($("input[name=languageList]:checked").length == 0) {
                alert("Language field is required!");
                $("input[name=languageList]").prop("checked", true);
            }
        }
    });
    
    $("#selectedTab").click(function(){
    	$(".paginationBox").hide();    	
    	
    });

    $('.saveLang').click(function () {
        var modalDiv = $(this).parents('#myModal');
        var entext = modalDiv.find('input.entext').first().val();
        var hitext = modalDiv.find('input.hitext').first().val();
        if(entext.trim().length> 0 || hitext.trim().length>0){
            var textData = {};
            textData.en = entext;
            textData.hi = hitext;
            textElement.val(JSON.stringify(textData));
        }else{
            textElement.val("");
        }
        modalDiv.find('.close').click();
    });

    $('#cardDataSubmit').click(function (e) {
        e.preventDefault();
        var dateRangeInput = $('#scheduler-row').find('span.check-active').next('input.date-range').val();
        var cardType = $('#cardTypeObj').val();
        $('select.compatibleDeviceGroupSelector').trigger("change");
        if(cardType && cardType.toLowerCase() == 'cricket'){
        	updateMatchPriorty();
        }
        if (dateRangeInput) {
            var dateList = dateRangeInput.split("-");
            var longStartTime = getDateTimeInLong(dateList[0]);
            var longEndTime = getDateTimeInLong(dateList[1]);
            $('#openTime').val(longStartTime);
            $('#closeTime').val(longEndTime);
            $('#defaultCard').val("false");
            if(!validateCardForm(false)){
                return;
            }
        } else {
            var selectionValue = $('#scheduler-row span.check-active').next('input.scheduleS').val();
            var defaultCard = false;
            if(selectionValue=='Default'){
                defaultCard = true;
            }
            $('#openTime').val("0");
            $('#closeTime').val("0");
            $('#cardDataForm [name=circleList]').val();
            if(!validateCardForm(defaultCard)){
                return;
            }
        }
        /*Validate card content before saving*/
        if(!validateCardContent()){
            return;
        }

        $.ajax({
            url: '/ip/cards/submit',
            type: 'POST',
            data: $('#cardDataForm').serialize(),
            beforeSend:function(){
                //$(".imgSaveLoad").show();
                $(".navLoader").show()
                $("#cardDataSubmit").prop("disabled",true);
            },
            success: function (result) {
                //$(".imgSaveLoad").hide();
            	var resultObj = JSON.parse(result);
            	if(resultObj.status == "failure" ) {
            		$('#fail-alert-msg').html(resultObj.errorMsg).show();
            		alert("FAILED !!! ");
            		$(".navLoader").hide();
            		$("#cardDataSubmit").prop("disabled",false);
            	} else {
            		$(".imgSaveLoad").parent().html("Saved");
            		alert("Card Saved Successfully !!");
                    $('p.createdC').html('Saved : ' + $.now());
                    window.location.reload();
            	}
            }
        });
    });

    $('.input-group-addon.schedulerCheck').click(function () {
        var cardUniqueId = $(this).closest(".row").children('.cardDataId').html();
        var cardTypeId = $('#cardTypeId').val();
        window.location = '/ip/cards?cardTypeId=' + cardTypeId + "&id=" + cardUniqueId;
    });

    $("#addNewContent").click(function (e) {
        _panel = $(".content-panel .panel").clone();
        _panel.find('.bootstrap-select').remove();
        _panel.find('select').selectpicker();
        _panel.find("input[name='contentPartner']").autocomplete(autoCompleteOpt);
        $('#draggablePanelList').prepend(_panel);
        /*_panel.show();*/
    });

    $('#scheduler').daterangepicker({
        timePicker: true,
        minDate: moment(),
        opens: 'left',
        timePickerIncrement: 30,
        format: 'MM/DD/YYYY h:mm A'
    }, function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });

    $("#scheduler-row").on("click", ".check-deactive", function () {
        $(".check-deactive").removeClass("check-active");
        $(this).toggleClass('check-active');
    });
    
    $('#draggablePanelList').on('click', '.removeCardContent', function() {
        var removeContent = confirm("Do you want to remove the content?");
        if(!removeContent){
            return false;
        }
    	$(this).closest('.panel').remove();
    });

    // Feed Manger height
    var fm = ($(window).height() );
    $("#feedManager").css("height", fm);

    var tabH = $(".topFeedSec").height() + 150;
    $("#feedManager .tab-content").css("height", fm - tabH);

    $(".check-deactive").click(function () {
        $(this).toggleClass('check-active');
    });
    $(".lock-deactive").click(function () {
        $(this).toggleClass('lock-active');
    });

    //Feed Manager Slide
    $("#feedPop").click(function () {
        $("#feedManager").animate({"right": "0px"}, "slow");
        $(".overlay").fadeIn(200);
        showDateRange(true);
        $("#previous").hide();
        var cardType = $("#cardType").val();
        if (cardType == "VIDEO") {
            var feedUrl = "/ip/ingestionfeed?src=video";
        }
        else {
            var feedUrl = "/ip/ingestionfeed?src=onebasket";
        }
        if ($('#showfeedListing').html().toString() == '') {
            showFeedContent(feedUrl, "showfeedListing", "feed");
        }

        return false;
    });

    $(".feedClose").click(function () {
        $("#feedManager").animate({"right": "-670px"}, "slow");
        $(".overlay").fadeOut(200);
        return false;
    });


    $("#searchIcon").click(function () {
        var queryString = "";

        var timeRangeString = $(".feedDatePicker").val();
        var fromDate;
        var toDate;
        if (timeRangeString && timeRangeString != "") {
            var startEndDates = timeRangeString.split("-");
            var longStartDateTime = getDateTimeInLong(startEndDates[0]);
            var longEndDateTime = getDateTimeInLong(startEndDates[1]);
            fromDate = longStartDateTime;
            toDate = longEndDateTime;
            queryString = queryString + "toDate=" + toDate + "&fromDate=" + fromDate;
        }

        var language = $("#language").val();
        if (language != "") {
            queryString = queryString + "&lang=" + language;
        }

        var publisher = $("#publisher").val();
        if (publisher != "") {
            queryString = queryString + "&publisher=" + publisher;
        }

        var category = $("#category").val();
        if (category != "") {
            queryString = queryString + "&category=" + category;
        }

        var keyword = $("#keyword").val();
        if (keyword != "") {
            queryString = queryString + "&q=" + keyword;
        }

        var fromPrice = $("#fromPrice").val();
        if(fromPrice != "") {
        	queryString = queryString + "&fromPrice=" + fromPrice;
        }

        var toPrice = $("#toPrice").val();
        if(toPrice != "") {
        	queryString = queryString + "&toPrice=" + toPrice;
        }
        
        var coverageRate = $("#coverageRate").val();
        if(coverageRate != "") {
        	queryString = queryString + "&coverageRate=" + coverageRate;
        }

        var src = $("#dataSource").val();

        if (src != "") {

            queryString = queryString + "&src=" + src;
            var selectedClass = $("#ingestedFeedTab").attr("class");
            var feedUrl = "/ip/ingestionfeed?" + queryString;
            showFeedContent(feedUrl, "showfeedListing", "feed");
            if (selectedClass != 'active') {
                $("#ingestedFeedTab").addClass("active");
                $("#subscriptionTab").removeClass();
            }
            $("#pageNumber").val(1);


            return;
        }
        else {

            var selectedClass = $("#ingestedFeedTab").attr("class");
            if (selectedClass == 'active') {
                queryString = queryString + "&src=onebasket";
                var feedUrl = "/ip/ingestionfeed?" + queryString;
                showFeedContent(feedUrl, "showfeedListing", "feed");
                $("#pageNumber").val(1);
            }
            else {
                queryString = queryString + "&src=subscription";
                var feedUrl = "/ip/ingestionfeed?" + queryString;
                showFeedContent(feedUrl, "showSubscriptionfeedListing", "subscription");
                $("#subscription_pageNumber").val(1);
            }
        }
    });

    /*$(".input-group-addon").on("click", function(){
     var cardId = $(this).parents(".row").find(".cardDataId").html();
     $.ajax({
     url: "/ip/getCardById?id=" + cardId,
     success: function (result) {
     alert(result);
     }
     });

     });*/

    //Remove Selected Feed
    $('.feedDelete').click(function () {
        $(this).parent().parent().remove();
    });

    $('#dataSource').on('change', function () {
        var feedUrl = "/ip/ingestionfeed?src=" + this.value;
        showFeedContent(feedUrl, "showfeedListing");
        
        if(this.value == "news" ){
        	$.ajax({
                url: "/ip/ingestionfeed/getNewsProviders",
                success: function (result) {
                    var obj = $.parseJSON(result);
                    var options = '<select name="publisher" id="publisher" class="selectpicker show-tick form-control" data-live-search="false"><option value="">Provider </option>'
                        ;
                    for (var key in obj) {
                        options = options + "<option value='" + obj[key] + "'>" + obj[key] + "</options>";
                    }
                    options = options + "</select>";
                    $("#publisherSelectedFeed").html(options);


                }
            });

            var newsCategoryUrl = "/ip/ingestionfeed/getNewsCategories?src=news&lang=en"

            $.ajax({
                url: newsCategoryUrl,
                success: function (result) {
                    var obj = $.parseJSON(result);
                    var options = '<select name="category" id="category" class="selectpicker show-tick form-control" data-live-search="false"><option value="">Category </option>';

                    for (var key in obj) {
                        options = options + "<option value='" + key + "'>" + obj[key] + "</options>";
                    }
                    options = options + "</select>";
                    $("#categorySelectedFeed").html(options);

                }
            });
        }
        else if(this.value == "video"){
        	 var videoCategoryUrl = "/ip/ingestionfeed/getVideosCategories?lang=en";
             var partnerUrl = "/ip/ingestionfeed/getPhotoVideoPartners";

            fetchPartnerForVideoPhoto(partnerUrl);

                 $.ajax({
                     url: videoCategoryUrl,
                     success: function (result) {
                         var obj = $.parseJSON(result);
                         var options = '<select name="category" id="category" class="selectpicker show-tick form-control" data-live-search="false"><option value="">Category </option>';

                         for (var key in obj) {
                             options = options + "<option value='" + key + "'>" + obj[key] + "</options>";
                         }
                         options = options + "</select>";
                         $("#categorySelectedFeed").html(options);

                     }
                 });
        }
        else if(this.value == "photos"){
       	 var photoCategoryUrl = "/ip/ingestionfeed/getImagesCategories?lang=en";
         var partnerUrl = "/ip/ingestionfeed/getPhotoVideoPartners";
         fetchPartnerForVideoPhoto(partnerUrl);

                $.ajax({
                    url: photoCategoryUrl,
                    success: function (result) {
                        var obj = $.parseJSON(result);
                        var options = '<select name="category" id="category" class="selectpicker show-tick form-control" data-live-search="false"><option value="">Category </option>';

                        for (var key in obj) {
                            options = options + "<option value='" + key + "'>" + obj[key] + "</options>";
                        }
                        options = options + "</select>";
                        $("#categorySelectedFeed").html(options);

                    }
                });
       }
        
        else{
        	 var defaultCategoryUrl = "/ip/ingestionfeed/getDefaultCategories";
            var defaultPartnerUrl = "/ip/ingestionfeed/getDefaultProviders";
            fetchDefaultProviders(defaultPartnerUrl);
        	$.ajax({
                url: defaultCategoryUrl,
                success: function (result) {
                    var obj = $.parseJSON(result);
                    var options = '<select name="category" id="category" class="selectpicker show-tick form-control" data-live-search="false"><option value="">Category </option>';

                    for (var key in obj) {
                        options = options + "<option value='" + key + "'>" + obj[key] + "</options>";
                    }
                    options = options + "</select>";
                    $("#categorySelectedFeed").html(options);

                }
            });
        }
        
        
        var selectedClass = $("#subscriptionTab").attr("class");
        
        
        
        
        if(selectedClass == "active"){
            $("#ingested").addClass(" in active");
            $("#ingestedFeedTab").addClass("active");
            $("#subscriptionTab").removeClass("active");
            $("#subscription").removeClass("in active");
        }
        $("#totalPages").html($("#pageCount").val());
        $("#pageNumber").val(1);

    });
    $('#subscriptionTab').click(function () {
        $(".paginationBox").hide();
        $("#subscriptionPagination").show();
        $("#subscription_previous").hide();

        clearFeedForm();
        var _html = $('#showSubscriptionfeedListing').html().toString();
        if ($("#subscriptionTab").attr("class") != "active" && $('#showSubscriptionfeedListing').html().toString() == '') {
            var feedUrl = "/ip/ingestionfeed?src=subscription";
            showFeedContent(feedUrl, "showSubscriptionfeedListing", "subscription");
        }
    });

    $('#ingestedFeedTab').click(function () {
        $(".paginationBox").hide();
        $("#ingestedPagination").show();
        $("#totalPages").html($("#pageCount").val());
    });

//        //Check boxes in feed manager
//        $('input[type="checkbox"].check_feed').checkbox({
//            buttonStyle: 'btn-link btn-large',
//            checkedClass: 'icon-check',
//            uncheckedClass: 'icon-check-empty'
//        });

    jQuery(function ($) {
        var panelList = $('#draggablePanelList');
        panelList.sortable({
            handle: '.panel-heading',
            update: function () {
                $('.panel', panelList).each(function (index, elem) {
                    var $listItem = $(elem),
                        newIndex = $listItem.index();
                });
            }
        });
    });


});

// to store autocomplete Option as global variable
var autoCompleteOpt = null;

$(window).resize(function () {
    var fm = ($(window).height() );
    $("#feedManager").css("height", fm);
    var tabH = $(".topFeedSec").height() + 150;
    $(".tab-content").css("height", fm - tabH);
});


function addCardSchedulerRow() {
    var defaultCardDataId = $('#scheduler-row').find('.row:nth-child(2)').first().find('.cardDataId').html();
    if (defaultCardDataId == null || !defaultCardDataId.trim()) {
        alert('Please create a default card first');
        return;
    }
    addSchedulerRow();
    $('#scheduler-row').find('.input-group-addon').removeClass('check-active');
    $('#scheduler-row').find('.row').last().find('.input-group-addon').addClass('check-active');
    $('#cardUniqueId').val('');
    $('#defaultCard').val('false');
    $('#creationDate').val(0);
    $('#lastUpdated').val(0);
}

function next(src) {
    src = getSource(src);

    var totalPageNumber = $("#" + src + "pageCount").val();

    var pageNumber = $("#" + src + "pageNumber").val();
    pageNumber = parseInt(pageNumber) + 1;

    $("#" + src + "previous").show();
    var n = $("#" + src + "n").val();
    $("#" + src + "pageNumber").val(pageNumber);
    getData(pageNumber, n);
};

function previous(src) {
    src = getSource(src);
    var pageNumber = $("#" + src + "pageNumber").val();
    pageNumber = parseInt(pageNumber) - 1;
    var n = $("#" + src + "n").val();
    $("#" + src + "pageNumber").val(pageNumber);


    getData(pageNumber, n);
   
};


function fetchDefaultProviders(partnerUrl){
    $.ajax({
        url: partnerUrl,
        success: function (result) {
            var obj = $.parseJSON(result);

            var options = '<select name="publisher" id="publisher" class="selectpicker show-tick form-control" data-live-search="false"><option value="">Provider </option>'
                ;
            for (var key in obj) {
                options = options + "<option value='" + obj[key] + "'>" + obj[key] + "</options>";
            }
            options = options + "</select>";
            $("#publisherSelectedFeed").html(options);


        }
    });
}
function fetchPartnerForVideoPhoto(partnerUrl){
    $.ajax({
        url: partnerUrl,
        success: function (result) {
            var obj = $.parseJSON(result);

            var options = '<select name="publisher" id="publisher" class="selectpicker show-tick form-control" data-live-search="false"><option value="">Provider </option>'
                ;
            for (var key in obj) {
                options = options + "<option value='" + obj[key].id + "'>" + obj[key].name + "</options>";
            }
            options = options + "</select>";
            $("#publisherSelectedFeed").html(options);


        }
    });
}


function getSource(src) {
    if (src == "subscription") {
        src = "subscription_"
    }
    else {
        src = ""
    }
    return src;

}


function  clearFeedForm(){
    $('#dataSource').val("");
    $('#language').val("");
    $('#publisher').val("");
    $('#publisher').val("");
    $(".feedDatePicker").val("");
    $("#category").val();
    $("#keyword").val();
}

    function getData(pageNumber, n) {

        var pos = ((pageNumber - 1) * parseInt(n));
        var src = $("#dataSource").val();
        

        var queryString = "";

        var language = $("#language").val();
        if (language != "") {
            queryString = queryString + "&lang=" + language;
        }

        var publisher = $("#publisher").val();
        if (publisher != "") {
            queryString = queryString + "&publisher=" + publisher;
        }

        var category = $("#category").val();
        if (category != "") {
            queryString = queryString + "&category=" + category;
        }

        var keyword = $("#keyword").val();
        if (keyword != "") {
            queryString = queryString + "&q=" + keyword;
        }

        var fromPrice = $("#fromPrice").val();
        if(fromPrice != "") {
        	queryString = queryString + "&fromPrice=" + fromPrice;
        }

        var toPrice = $("#toPrice").val();
        if(toPrice != "") {
        	queryString = queryString + "&toPrice=" + toPrice;
        }

        var coverageRate = $("#coverageRate").val();
        if(coverageRate != "") {
        	queryString = queryString + "&coverageRate=" + coverageRate;
        }

        queryString = queryString + "&rows=" + n + "&start=" + pos;
        

        if (src != "") {
        	
        	if($("#pageNumber").val() == 1){
        		$("#previous").hide();
        	}

            queryString = queryString + "&src=" + src;
            var selectedClass = $("#ingestedFeedTab").attr("class");
            var feedUrl = "/ip/ingestionfeed?" + queryString;
            showFeedContent(feedUrl, "showfeedListing", "feed");
            if (selectedClass != 'active') {
                $("#ingestedFeedTab").addClass("active");
                $("#subscriptionTab").removeClass();
            }

            return;
        }
        else {
        	if($("#pageNumber").val() == 1){
        		$("#previous").hide();
        	}

            var selectedClass = $("#ingestedFeedTab").attr("class");
            if (selectedClass == 'active') {
                queryString = queryString + "&src=onebasket";
                var feedUrl = "/ip/ingestionfeed?" + queryString;
                showFeedContent(feedUrl, "showfeedListing", "feed");
            }
            else {
            	
            	if($("#subscription_pageNumber").val() == 1){
            		$("#subscription_previous").hide();
            	}
                queryString = queryString + "&src=subscription";
                var feedUrl = "/ip/ingestionfeed?" + queryString;
                showFeedContent(feedUrl, "showSubscriptionfeedListing", "subscription");
            }
        }
    }
    

    function showFeedContent(feedUrl, divId, src) {
        var date = new Date();
        var time = date.getMilliseconds();
        $.ajax({
            url: feedUrl + "&t=" + time,

            beforeSend: function () {
                $("#" + divId).html($('#loader').html());
            },

            success: function (result) {
                $("#" + divId).html(result);
                // Feed Manager Show extra info
                $('.moreinfo').hide();

                if (src == "subscription") {
                    $("#subscription_totalPages").html($("#subscription_pageCount").val());
                    $("#subscriptionPagination").show();
                }
                else {
                    $("#totalPages").html($("#pageCount").val());
                    $("#ingestedPagination").show();
                }
            },
            error: function(e){
                console.log(e);
                $("#" + divId).find(".loaderImg").hide();
                $("#" + divId).html("No Contents");
                if(src == "subscription"){
                    $("#subscriptionPagination").hide();
                }else{
                    $("#ingestedPagination").hide();
                }
            }
        });
    }

    function validateCardContent(){
        var titles = $("#draggablePanelList input[name=contentTitle]");
        var description = $("#draggablePanelList input[name=contentDescription]");
        var contentUrls = $("#draggablePanelList input[name=contentUrl]");
        var buttonTexts = $("#draggablePanelList input[name=buttonText]");
        var cardType = $("select[name=cardType]").val();
        var langList = $("input[name=languageList]");

//        checking for content url
        for(var i=0;i<titles.length;i++){
            var titleVal = titles[i].value;
            var contentUrl = "";
            if(contentUrls[i]){
               contentUrl = contentUrls[i].value;
            }
            titleVal = titleVal?titleVal:"{}";

            if(titleVal){
                var titleObj = JSON.parse(titleVal);

                if((titleObj['en'] && titleObj['en'].trim().length > 0) || (titleObj['hi'] && titleObj['hi'].trim().length > 0)){
                    if(contentUrl.trim().length<=0){
                        var isAppDownloadEnabled = $('input[name=appDownloadEnabled]');
                        if(isAppDownloadEnabled){
                            var isEnabled = isAppDownloadEnabled[i].value;
                            if(isEnabled == 'true'){
                                if(($('input[name=contentPlayStoreLinkUrl]')[i].value.trim().length <= 0 && $('input[name=contentAppStoreLinkUrl]')[i].value.trim().length <= 0 && $('input[name=contentWindowsStoreUrl]')[i].value.trim().length <= 0 && $('input[name=contentBBAppWorldUrl]')[i].value.trim().length <= 0)){
                                    $('#fail-alert-msg').html("At least one App download Url should be present").show();
                                    return false;
                                }
                            }else{
                                $('#fail-alert-msg').html("Content Url should not be empty for content #" + (i+1)).show();
                                return false;
                            }
                        }else{
                            $('#fail-alert-msg').html("Content Url should not be empty for content # "+ (i+1)).show();
                            return false;
                        }
                    }
                }
            }
            var buttonText = "";
            if(buttonTexts[i]){
                buttonText = buttonTexts[i].value;
            }
            if(buttonText){
                var buttonTextObj = JSON.parse(buttonText);
                if((buttonTextObj['en'] && buttonTextObj['en'].trim().length > 0) || (buttonTextObj['hi'] && buttonTextObj['hi'].trim().length > 0)){
                    if(contentUrl.trim().length<=0){
                        var isAppDownloadEnabled = $('input[name=appDownloadEnabled]');
                        if(isAppDownloadEnabled){
                            var isEnabled = isAppDownloadEnabled[i].value;
                            if(isEnabled == 'true'){
                                if(($('input[name=contentPlayStoreLinkUrl]')[i].value.trim().length <= 0 && $('input[name=contentAppStoreLinkUrl]')[i].value.trim().length <= 0 && $('input[name=contentWindowsStoreUrl]')[i].value.trim().length <= 0 && $('input[name=contentBBAppWorldUrl]')[i].value.trim().length <= 0)){
                                    $('#fail-alert-msg').html("At least one App download Url should be present").show();
                                    return false;
                                }
                            }else{
                                $('#fail-alert-msg').html("Content Url should not be empty for content #"+(i+1)).show();
                                return false;
                            }
                        }else{
                            $('#fail-alert-msg').html("Content Url should not be empty for content #"+(i+1)).show();
                            return false;
                        }
                    }
                }
            }
        }
//      checking for redirect link url
        var elementHeaders = $("#draggablePanelList input[name=elementHeader]");
        var elementHeaderLinks = $("#draggablePanelList input[name=elementHeaderLink]");
        for(var i=0;i<elementHeaders.length;i++){
            var elementHeader = elementHeaders[i].value;
            var elementHeaderLink = elementHeaderLinks[i].value;
            if(elementHeader){
                var elementHeaderObj = JSON.parse(elementHeader);
                if((elementHeaderObj['en'] && elementHeaderObj['en'].trim().length > 0) || (elementHeaderObj['hi'] && elementHeaderObj['hi'].trim().length > 0)){
                    if(elementHeaderLink.trim().length<=0){
                        $('#fail-alert-msg').html("Element Header Link should not be empty for content #"+(i+1)).show();
                        return false;
                    }
                }
            }
        }
//      checking for related link url
        var relatedLinkTitles = $("#draggablePanelList input[name=contentRelatedLinkTitle]");
        var relatedLinkUrls = $("#draggablePanelList input[name=contentRelatedLinkUrl]");
        for(var i=0;i<relatedLinkTitles.length;i++){
            var relatedLinkTitle = relatedLinkTitles[i].value;
            var relatedLinkUrl = relatedLinkUrls[i].value;
            if(relatedLinkTitle){
                var relatedLinkTitleObj = JSON.parse(relatedLinkTitle);
                if((relatedLinkTitleObj['en'] && relatedLinkTitleObj['en'].trim().length > 0) || (relatedLinkTitleObj['hi'] && relatedLinkTitleObj['hi'].trim().length > 0)){
                    if(relatedLinkUrl.trim().length<=0){
                        $('#fail-alert-msg').html("Related Url link should not be empty").show();
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function validateCardForm(defaultCard){
        $('#fail-alert-msg').hide();
        if(defaultCard){
            if($("input[name=circleList]:checked").length==1 && $("input[name=languageList]:checked").length == 2){
                if($("input[name=circleList]:checked").val() == 'pan'){
                    return true;
                }else{
                    $('#fail-alert-msg').html("Circle should be pan").show();
                    return false;
                }
            }else{
                $('#fail-alert-msg').html("Circle should be pan and Language should be en and hi").show();
                return false;
            }

        }else{
            var dateval = $('#scheduler-row').find('span.check-active').next('input.date-range').val();
            if(!dateval){
                $('#fail-alert-msg').html("Please Select schedule time range.").show();
                return false;
            }
        }
        return true;
    }

    function validateUrl(value){
//        var regexpUrl = /\b((?:[a-z][\w\-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]|\((?:[^\s()<>]|(?:\([^\s()<>]+\)))*\))+(?:\((?:[^\s()<>]|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?������������������������������������������������]))/i
        var regexpUrl =  /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
        return regexpUrl.test(value);
    }
    
    function updateMatchPriorty(){
    	var idsInOrder = $("#disables-grey").sortable("toArray");
    	$.ajax({
    		url : '/ip/cards/updateLiveMatchPriortyOrder',
    		type : 'POST',
    		data : {
    			"matchList" : idsInOrder.toString()
    		},
    		success : function(responseData) {
    			console.log("Top Match Priority update request has been sent to System. It might take some time to reflect on production. Thank You !!")
    		},
    		error : function(e) {
    			console.log("error :" + e.message)
    		}
    	});
    }

    function extractDomain(url) {
        var domain;
        //find & remove protocol (http, ftp, etc.) and get domain
        if (url.indexOf("://") > -1) {
            domain = url.split('/')[2];
        }
        else {
            domain = url.split('/')[0];
        }
        //find & remove port number
        domain = domain.split(':')[0];
        return domain;
    }

    function getUrlMatcherToPackMap() {
        var urlMatcherToPack = new Array();
        urlMatcherToPack["facebook"] = "IFB-Facebook";
        urlMatcherToPack["twitter"] = "IFB-Twitter";
        urlMatcherToPack["whatsapp"] = "IFB-Whatsapp";
        urlMatcherToPack["youtube"] = "IFB-YouTube";
        urlMatcherToPack["makemytrip"] = "IFB-travel2";
        urlMatcherToPack["goibibo"] = "IFB-travel1";
        urlMatcherToPack["myntra"] = "IFB-ecomm1";
        urlMatcherToPack["snapdeal"] = "IFB-ecomm2";
        urlMatcherToPack["flipkart"] = "IFB-ecomm3";
        urlMatcherToPack["quikr"] = "IFB-classified1";
        urlMatcherToPack["olx"] = "IFB-classified2";
        urlMatcherToPack["hwgo"] = "HWGO";
        urlMatcherToPack["vimeo"] = "IFB-Vimeo";
        urlMatcherToPack["hike"] = "IFB-hike";
        urlMatcherToPack["wynk"] = "IFB-wynkapp";
        urlMatcherToPack["default"] = "IFB-Packs";
        return urlMatcherToPack;
    }

    function isEmpty(str) {
        return (!str || 0 === str.trim().length);
    }

    function suggestPackType(url){
        var domain = extractDomain(url);
        var splittedDomain = domain?domain.split('.'):new Array();
        var domainLen=splittedDomain.length;
        var urlPacksMap = getUrlMatcherToPackMap();
        for(var t=0;t<domainLen;t++){
            var key = splittedDomain[t].toLowerCase();
            if(key in urlPacksMap){
                console.log("Suggested pack type" + urlPacksMap[key] + " for url " + url);
                return urlPacksMap[key];
            }
        }
        console.log("Suggested pack type" + urlPacksMap["default"] + " for url " + url);
        return urlPacksMap["default"];
    }