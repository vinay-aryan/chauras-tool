
$('.more').unbind('click').click(moreClick);

function moreClick(){
    var ele = $(this);
    ele.next('.moreinfo').toggle(100, function () {
        ele.html($(this).is(':visible') ? 'Hide extra info' : 'Show extra info');
    });
}


$(".feedCheckBox").find("input[type=checkbox]").unbind('change').change(function () {
    var checkEle = $(this).val();
    if (this.checked) {
        _panel = $(".content-panel .panel").clone();
        _panel.find('.bootstrap-select').remove();
        _panel.find('select').selectpicker();
        _panel.find("input[name='contentPartner']").autocomplete(autoCompleteOpt)
        var img = $('#' + checkEle + ' #col1 img').attr('src');
        var title = $('#' + checkEle + ' #col2 h5').html();
        var publisher = $('#' + checkEle + ' #col2 .moreinfo .pub').html();
        var provider = $('#' + checkEle + ' #col2 .providerDiv').html();
        var allDetails = $('#' + checkEle + ' #col2 .moreinfo').html();
        var contentId = $('#' + checkEle + ' #col2 .contentIdDiv').html();
        var photoCount = $('#' + checkEle + ' #col2 .photoCount')?$('#' + checkEle + ' #col2 .photoCount').html():"";
        var videoDuration = $('#' + checkEle + ' #col2 .videoDuration')?$('#' + checkEle + ' #col2 .videoDuration').html():"";
        var vcode = $('#' + checkEle + ' #col2 .vcode')?$('#' + checkEle + ' #col2 .vcode').html():"";
        var comvivaSongId = $('#' + checkEle + ' #col2 .comvivaSongId')?$('#' + checkEle + ' #col2 .comvivaSongId').html():"";
        var artist = $('#' + checkEle + ' #col2 .artist')?$('#' + checkEle + ' #col2 .artist').html():"";
        var album = $('#' + checkEle + ' #col2 .album')?$('#' + checkEle + ' #col2 .album').html():"";
        var songLanguage = $('#' + checkEle + ' #col2 .songLanguage')?$('#' + checkEle + ' #col2 .songLanguage').html():"";
        var previewUrl = $('#' + checkEle + ' #col2 .previewUrl')?$('#' + checkEle + ' #col2 .previewUrl').html():"";
        var url = $('#' + checkEle + ' .moreinfo .url').html();
        var source = $('#' + checkEle + ' #col2 .sourceDiv').html();
        _panel.attr('id', 'panel_' + checkEle);
        _panel.find('.img-circle img').attr('src', img);
        _panel.find('#contentId').val(contentId);
        _panel.find('#contentSource').val(source);
        _panel.find('#contentTitle').val('{"en":"' + title + '"}');
        _panel.find('#contentUrl').val(url);
        _panel.find('#contentImageUrl').val(img);
        _panel.find('#contentPartner').val(provider);
        _panel.find("#photoCount").val(photoCount);
        _panel.find("#videoDuration").val(videoDuration);
        _panel.find("#vCode").val(vcode);
        _panel.find("#comvivaSongId").val(comvivaSongId);
        _panel.find("#artist").val(artist);
        _panel.find("#album").val(album);
        _panel.find("#previewUrl").val(previewUrl);
        _panel.find("#songLanguage").val(songLanguage);
        $('#draggablePanelList').prepend(_panel);

        _myfeed = $("#myfeed").clone();
        _myfeed.attr('id', 'myfeed_' + checkEle);
        _myfeed.find('.col-md-2 img').attr('src', img);
        _myfeed.find('#info1').html(allDetails);
        _myfeed.find('.col-md-10 h5').html(title);
        _myfeed.find('.feedDelete').attr('onclick', 'feedDelete('+checkEle+')');
        _myfeed.find('.more').click(moreClick);
        _myfeed.show();
        $("#selectedFeed").prepend(_myfeed);
        _panel.show();
    }
    else {
        $('#panel_' + checkEle).remove();
        $('#myfeed_' + checkEle).remove();
    }
});

function feedDelete(id){
    alert('delete action!');
    var panel_id = "panel_"+id;
    var feed_id = "myfeed_"+id;
    $('#'+panel_id).remove();
    $('#'+feed_id).remove();
}

$("form.edit-feed-form").off("submit");
$("form.edit-feed-form").on("submit",function( event ) {
        event.preventDefault();
        var form = $(this);
        var title = $(this).find("input[name=fd_title]").val();
        var description = $(this).find("textarea[name=fd_desc]").val();
        var status = "";
        console.log("title " + title);
        title = title?title.trim():"";
        description = description?description.trim():"";
        if(title.length==0){
            status="Title cannot be empty";
            console.log(status);
            $("#feedManager .feed_status").html(status);
            $("#feedManager .feed_status").css("color","red");
            $("#feedManager .feed_status").show();
            return false;
        }
        if(title.length > 60){
            status="Title length cannot be greater than 60 chars";
            console.log(status);
            $("#feedManager .feed_status").html(status);
            $("#feedManager .feed_status").css("color","red");
            $("#feedManager .feed_status").show();
            return false;
        }
        console.log("desc " + description);
        description = description.trim();
        if(description.length > 200){
            status = "Description cannot be greater than 200 chars"
            $("#feedManager .feed_status").html(status);
            $("#feedManager .feed_status").css("color","red");
            $("#feedManager .feed_status").show();
            return false;
        }
        console.log("title: "+ title+ " Descri: "+ description);
        $(this).find("input[name=fd_title]").val(title);
        $(this).find("textarea[name=fd_desc]").val(description);
        //form validation

        $(this).find('input[type="submit"]').prop('disabled', true);
        $.ajax({
            type: $(this).attr('method'),
            url: $(this).attr('action'),
            data: $(this).serialize(),
            success: function (data) {
                console.log("Data: "+data);
                var response = JSON.parse(data);
                if(response.responseCode=="0"){
                    $("#feedManager .feed_status").html("Update Successful!");
                    $("#feedManager .feed_status").css("color","green");
                    $("#feedManager #keyword").val("");
                    $("#searchIcon").click();
                }else{
                    $("#feedManager .feed_status").html("Update failed!");
                    $("#feedManager .feed_status").css("color","red");

                }
                form.find('input[type="submit"]').prop('disabled', false);
                $("#feedManager .feed_status").show();
                setTimeout(function(){$("#feedManager .feed_status").hide()},10000);
            }
        });
});
$("form.delete-feed-form").off("submit");
$("form.delete-feed-form").on("submit",function( event ) {
    event.preventDefault();
    var form = $(this);
    $(this).find('input[type="submit"]').prop('disabled', true);
    if(!confirm("Do you want to delete the feed?")){
        form.find('input[type="submit"]').prop('disabled', false);
        return false;
    }
    $.ajax({
        type: $(this).attr('method'),
        url: $(this).attr('action'),
        data: $(this).serialize(),
        success: function (data) {
            console.log("Data: "+data);
            var response = JSON.parse(data);
            if(response.responseCode=="0"){
                $("#feedManager .feed_status").html("Deleted successfully!");
                $("#feedManager .feed_status").css("color","green");
                $("#feedManager #keyword").val("");
                $("#searchIcon").click();
            }else{
                $("#feedManager .feed_status").html("Deletion failed!");
                $("#feedManager .feed_status").css("color","red");
            }
            form.find('input[type="submit"]').prop('disabled', false);
            $("#feedManager .feed_status").show();
            setTimeout(function(){$("#feedManager .feed_status").hide()},10000);
        }

    });
});