$(document).ready(function () {
    $('#archival-type-selectpicker').on('change', function() {
        var archivalType = $(this).val()
        if(archivalType.toLowerCase() == "cards"){
            $(".package-filters").hide();
            $(".card-filters").show();
        } else if(archivalType.toLowerCase() == "packages"){
                $(".card-filters").hide();
                $(".package-filters").show();

        } else if(archivalType.toLowerCase() == "top10"){
            $(".card-filters").hide();
            $(".package-filters").hide();
        }

    });

    $("#archivePop").click(function(){
        showDateRange(true);
        $("#archiveManager").animate({ "right": "0px" }, "slow" );
        $(".overlay").fadeIn(200);
        return false;
    });

    $(".archiveClose ").click(function(){
        showDateRange(false);
        $("#archiveManager").animate({ "right": "-670px" }, "slow" );
        $(".overlay").fadeOut(200);
        return false;
    });

    // package-archive-manager
    $(".archive-package-data-load, #package-archive-manager-pager .am_prev, #package-archive-manager-pager .am_next").unbind('click').bind("click",function(event){

        event.preventDefault();
        var siteId = $(".siteIdSelector option:selected").val();
        var arpu = $(".arpuSelector option:selected").val();
        var device = $(".package-deviceTypeSelector option:selected").val();
        var timeRangeString = $(".package-datePickerArchiveListing").val();
        var fromDate;
        var toDate;
        if(timeRangeString && timeRangeString != "" ){
            var startEndDates = timeRangeString.split("-");
            var longStartDateTime = getDateTimeInLong(startEndDates[0]);
            var longEndDateTime = getDateTimeInLong(startEndDates[1]);
            fromDate = longStartDateTime;
            toDate = longEndDateTime;
        }

        var isArchive  = $(".package-archive:checked").val();

        // number of cards to be fetched in a single call
        var n = 5;
        var pos = 0;

        if($(this).hasClass("am_prev")) {
            var currentPageNum = parseInt($("#package-archive-manager-pager .am_curr_page").val());
            var prevPageNum = currentPageNum - 1;
            var totalPageNum = parseInt($("#package-archive-manager-pager .am_pages").text());
            if(prevPageNum<totalPageNum){
                $("#package-archive-manager-pager .am_next").show();
            }
            if (prevPageNum == 1) {
                $("#package-archive-manager-pager .am_prev").hide();
            }
            pos = (prevPageNum-1) * n;
            $("#package-archive-manager-pager .am_curr_page").val(prevPageNum);
        }

        if($(this).hasClass("am_next")){
            var currentPageNum = parseInt($("#package-archive-manager-pager .am_curr_page").val());
            var nextPageNum = currentPageNum + 1;
            if(nextPageNum>1){
                $("#package-archive-manager-pager .am_prev").show();
            }
            var totalPageNum = parseInt($("#package-archive-manager-pager .am_pages").text());
            if (nextPageNum == totalPageNum) {
                $("#package-archive-manager-pager .am_next").hide();
            }
            pos = (nextPageNum-1) * n;
            $("#package-archive-manager-pager .am_curr_page").val(nextPageNum);
        }

        var formData = {
            'siteId' : siteId,
            'arpu': arpu,
            'device': device,
            'fromTime':fromDate,
            'toTime':toDate,
            'num':n,
            'pos':pos,
            'archived':isArchive
        };

        $.ajax({
            type: 'GET',
            url: '/ip/toppage/getPackage',
            data: formData, // our data object
            beforeSend: function () {
                $("#archiveManager .feedListing").html($('#loader').html());
            },
            success:function (responseData) {
                $("#activePackages .feedListing").html(responseData);
                var totalCount = $(".aptl_tc").val();
                var num = $(".aptl_num").val();
                var pos = $(".aptl_pos").val();
                var numPages = 0;
                if(num > 0) {
                    numPages = Math.ceil(totalCount / num);
                    if (numPages > 0) {
                        var current_page_number = Math.floor(pos / num) + 1;
                        if (current_page_number == 1) {
                            $("#package-archive-manager-pager .am_prev").hide();
                        } else {
                            $("#package-archive-manager-pager .am_prev").show();
                        }
                        if (current_page_number == numPages) {
                            $("#package-archive-manager-pager .am_next").hide();
                        } else {
                            $("#package-archive-manager-pager .am_next").show();
                        }
                        $("#package-archive-manager-pager .am_curr_page").val(Math.floor(pos / num) + 1);
                        $("#package-archive-manager-pager").show();
                    }else{
                        $("#package-archive-manager-pager").hide();
                    }
                    $("#package-archive-manager-pager .am_pages").html(numPages);
                }
                console.log("Num "+totalCount+ " " + num + " "+ pos);
            }
        });
    });

    // on enter keypress load data
    $("#card-archive-manager-pager .am_curr_page").unbind('click').bind("keypress",function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            event.preventDefault();
            var cardType = $(".cardTypeSelector option:selected").val();
            var cardSubType = $(".cardSubTypeSelector option:selected").val();
            var device = $(".deviceTypeSelector option:selected").val();
            var circle = $(".circleSelector option:selected").val();
            var lang = $(".langSelector option:selected").val();
            var timeRangeString = $(".datePickerArchiveListing").val();
            var fromDate;
            var toDate;
            if(timeRangeString && timeRangeString != "" ){
                var startEndDates = timeRangeString.split("-");
                var longStartDateTime = getDateTimeInLong(startEndDates[0]);
                var longEndDateTime = getDateTimeInLong(startEndDates[1]);
                fromDate = longStartDateTime;
                toDate = longEndDateTime;
            }
            var cardState  = $(".am_active_archive:checked").val();

            // number of cards to be fetched in a single call
            var n = 5;
            var pos = 0;

            if($(this).hasClass("am_curr_page")){
                var currentPageNum = parseInt($(".am_curr_page").val());
                var totalPageNum = parseInt($("#card-archive-manager-pager .am_pages").text());
                if(isNaN(currentPageNum) || currentPageNum > totalPageNum || currentPageNum < 1){
                    alert("Incorrect Page no.");
                    currentPageNum = 1;
                    $("#card-archive-manager-pager .am_curr_page").val(1);
                }
                if(currentPageNum>1){
                    $("#card-archive-manager-pager .am_prev").show();
                }

                if (currentPageNum >= totalPageNum) {
                    $("#card-archive-manager-pager .am_next").hide();
                }

                pos = (currentPageNum-1) * n;

                $("#card-archive-manager-pager .am_curr_page").val(currentPageNum);

            }

            var formData = {
                'type': cardType,
                'subtype': cardSubType,
                'device': device,
                'circle': circle,
                'lang': lang,
                'fromDate':fromDate,
                'toDate':toDate,
                'cardState':cardState,
                'n':n,
                'pos':pos
            };

            $.ajax({
                type: 'GET', // define the type of HTTP verb we want to use (POST for our form)
                url: '/ip/cards/filter', // the url where we want to POST
                data: formData, // our data object
                beforeSend: function () {
                    $("#archiveManager .feedListing").html($('#loader').html());
                },
                success:function (responseData) {
                    $("#activecard .feedListing").html(responseData);
                    var totalCount = $(".actl_tc").val();
                    var num = $(".actl_num").val();
                    var pos = $(".actl_pos").val();
                    var numPages = 0;
                    if(num>0) {
                        numPages = Math.ceil(totalCount / num);
                        if (numPages > 0) {
                            var current_page_number = Math.floor(pos / num) + 1;
                            if (current_page_number == 1) {
                                $(".am_prev").hide();
                            }else{
                                $(".am_prev").show();
                            }
                            if (current_page_number == numPages) {
                                $(".am_next").hide();
                            } else{
                                $(".am_next").show();
                            }
                            $(".am_curr_page").val(Math.floor(pos / num) + 1);

                            $(".archiveManagerPager").show();
                        }else{
                            $(".archiveManagerPager").hide();
                        }
                        $(".am_pages").html(numPages);
                    }
                    console.log("Num "+totalCount+ " " + num + " "+ pos);

                }
            });
        }
    });

    $(".archiveListLoad,.am_prev,.am_next").unbind('click').bind("click",function(event){
        event.preventDefault();
        var cardType = $(".cardTypeSelector option:selected").val();
        var cardSubType = $(".cardSubTypeSelector option:selected").val();
        var device = $(".deviceTypeSelector option:selected").val();
        var circle = $(".circleSelector option:selected").val();
        var lang = $(".langSelector option:selected").val();
        var timeRangeString = $(".datePickerArchiveListing").val();
        var fromDate;
        var toDate;
        if(timeRangeString && timeRangeString != "" ){
            var startEndDates = timeRangeString.split("-");
            var longStartDateTime = getDateTimeInLong(startEndDates[0]);
            var longEndDateTime = getDateTimeInLong(startEndDates[1]);
            fromDate = longStartDateTime;
            toDate = longEndDateTime;
        }
        var cardState  = $(".am_active_archive:checked").val();

        // number of cards to be fetched in a single call
        var n = 5;
        var pos = 0;

        if($(this).hasClass("am_prev")) {
            var currentPageNum = parseInt($(".am_curr_page").val());
            var prevPageNum = currentPageNum - 1;
            var totalPageNum = parseInt($(".am_pages").text());
            if(prevPageNum<totalPageNum){
                $(".am_next").show();
            }
            if (prevPageNum == 1) {
                $(".am_prev").hide();
            }
            pos = (prevPageNum-1) * n;
            $(".am_curr_page").val(prevPageNum);
        }

        if($(this).hasClass("am_next")){
            var currentPageNum = parseInt($(".am_curr_page").val());
            var nextPageNum = currentPageNum + 1;
            if(nextPageNum>1){
                $(".am_prev").show();
            }
            var totalPageNum = parseInt($(".am_pages").text());
            if (nextPageNum == totalPageNum) {
                $(".am_next").hide();
            }
            pos = (nextPageNum-1) * n;
            $(".am_curr_page").val(nextPageNum);
        }

        var formData = {
            'type': cardType,
            'subtype': cardSubType,
            'device': device,
            'circle': circle,
            'lang': lang,
            'fromDate':fromDate,
            'toDate':toDate,
            'cardState':cardState,
            'n':n,
            'pos':pos
        };

        $.ajax({
            type: 'GET', // define the type of HTTP verb we want to use (POST for our form)
            url: '/ip/cards/filter', // the url where we want to POST
            data: formData, // our data object
            beforeSend: function () {
                $("#archiveManager .feedListing").html($('#loader').html());
            },
            success:function (responseData) {
                $("#activecard .feedListing").html(responseData);
                var totalCount = $(".actl_tc").val();
                var num = $(".actl_num").val();
                var pos = $(".actl_pos").val();
                var numPages = 0;
                if(num>0) {
                    numPages = Math.ceil(totalCount / num);
                    if (numPages > 0) {
                        var current_page_number = Math.floor(pos / num) + 1;
                        if (current_page_number == 1) {
                            $(".am_prev").hide();
                        }else{
                            $(".am_prev").show();
                        }
                        if (current_page_number == numPages) {
                            $(".am_next").hide();
                        } else{
                            $(".am_next").show();
                        }
                        $(".am_curr_page").val(Math.floor(pos / num) + 1);

                        $(".archiveManagerPager").show();
                    }else{
                        $(".archiveManagerPager").hide();
                    }
                    $(".am_pages").html(numPages);
                }
                console.log("Num "+totalCount+ " " + num + " "+ pos);

            }
        });
    });

});