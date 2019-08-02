var isEdit = false;
var rowNumber = "";
var CMS_V1_SAVE_URL = 'gj/json/save/';
var CMS_V1_DELETE_URL = 'gj/json/delete';
var CMS_V1_GET_URL = 'gj/json/get';
var CMS_V1_INDEX_URL = 'gj/index';
var CMS_V1_GET_MODULES = 'gj/getModules';

var CMS_V2_SAVE_URL = 'gj/v2/json/save/';
var CMS_V2_DELETE_URL = 'gj/v2/json/delete';
var CMS_V2_GET_URL = 'gj/v2/json/get';
var CMS_V2_INDEX_URL = 'gj/v2/index';
var CMS_V2_GET_MODULES = 'gj/v2/getModules';

$(function () {

    var moduleId = getUrlParameter("moduleId");
    var siteId = getUrlParameter("siteId");
    var modified_module_name;
    var flag = false;
    var elements = 0;
    
    $("#save_new_name").prop("type", "hidden");
    if (moduleId == undefined || moduleId == "" || moduleId.indexOf("~") != -1) {
        $("#undo_last_version").prop("type", "hidden");
        $("#view_last_version").prop("type", "hidden");
        $("#rename_module").prop("type", "hidden");
        $("#activity_module").prop("type", "hidden");

    } else {
        $("#undo_last_version").prop("type", "button");
        $("#view_last_version").prop("type", "button");
        $("#rename_module").prop("type", "button");
        $(function () {
            var url = "gj/getStatus";
            var data = {
                moduleId: moduleId,
                siteId: siteId
            };
            $.post(url, data, function (res) {

                console.log("res is - " + res);
                if (res == "inactive") { //Not active
                    flag = true;
                } else { //Active
                    flag = false;
                }

                //flag is false when module is active
                console.log(flag);
                if (!flag) { //Module is active currently
                    $("#activity_module").prop("type", "button");
                }
                else { //Module is inactive currently
                    $("#activity_module").prop("type", "button").css('background-image', 'none').css('background-color', '#ff0000').prop("value", "Make Active");
                }

            });

        });


    }


    $('#editSiteForm').live('submit', function (event) {
        event.preventDefault();
        if (confirm('Click OK to confirm save')) {
            var analyticsId = $('#moduleSiteIdSel').val().trim();
            var moduleId1 = $('#moduleModuleIdSel').val().trim();
            
            var jsonData;

            console.log(jsonType);

            
            if($("#editDataTextarea").is(":visible")) {
                jsonData = $('#editDataTextarea').val().trim();
            }
            else{
                
                
                
                if(jsonType==1) {
                    
                    jsonData = [];
                    var tableObj = createJSONFromTable();
                    jsonData.push(tableObj);
                    
                    
                } else if(jsonType == 2) {
                    
                    jsonData = [];
                    var rows = document.getElementById("dataText").getElementsByTagName('tr');
                    var numberOfRows = rows.length;
                    var cols = 0;
                    var obj = {};
                    for(var i = 0; i < numberOfRows;i++) {
                        if((i%elements==0) && i!=0) {
                            console.log("object push - " + i);
                            jsonData.push(obj);
                            obj = {};
                        }
                        cols = rows[i].getElementsByTagName('td');
                        var field1 = cols[0].innerHTML;
                        var field2 = $(cols[1]).find('input').val();
                        if(field2 == null) {
                            var newArray = [];
                            var arrObj = {};
                            for(var k=i+1;k<=i+2;k++) {
                                cols = rows[k].getElementsByTagName('td');
                                 var f1 = cols[0].innerHTML;
                                 var f2 = $(cols[1]).find('input').val();
                                 arrObj[f1] = f2;
                            }
                            newArray.push(arrObj);
                            obj[field1] = newArray;
                            i=k-1;
                        } 
                        else {
                            obj[field1] = field2;
                        }
                        
                        if(i+1==numberOfRows) {
                            console.log("object push - " + i);
                            jsonData.push(obj);
                            obj = {};
                        }
                    }

                } 
                else{

                    jsonData = createJSONFromTable();

                }
            }

            console.log(jsonData);
            
            function createJSONFromTable() {
                
                var jsonDataObj = {};
                var rows = document.getElementById("dataText").getElementsByTagName('tr');
                var numberOfRows = rows.length;
                var i = 0;
                var cols = 0;
                for(i = 0; i < numberOfRows;i++) {
                    cols = rows[i].getElementsByTagName('td');
                    var field1 =cols[0].innerHTML;
                    var field2 = $(cols[1]).find('input').val();
                    jsonDataObj[field1] = field2;
                }
                
                return jsonDataObj;
                
            }

            
            if ($('#editCb').is(":checked")) {
                analyticsId = $('#moduleSiteIdText').val().trim();
                moduleId1 = $('#moduleModuleIdText').val().trim();
            }

            if (!isValidJson(jsonData)) {
                $('#parsley-data-special').show();
                $('#editDataTextarea').focus();
                result = false;
            }

            console.log(jsonData);

            var jData = "";
            
            if (typeof jsonData == 'string' || jsonData instanceof String) {
                jData = JSON.parse(jsonData);
            } else {
                jData = jsonData;
            }
            
            var value = {
                'data': jData,
                'circles': commaSepStringToArray(getKeywordFromSelect('Circle')),
                'deviceGroups': commaSepStringToArray(getKeywordFromSelect('DeviceSel')),
                'radio': commaSepStringToArray(getKeywordFromSelect('RadioSel')),
                'language': commaSepStringToArray(getKeywordFromSelect('LanguageSel'))
            };

            
            var data = {
                'analyticsId': analyticsId,
                'moduleId': moduleId1,
                'value': JSON.stringify(value),
                'isEdit': isEdit,
                'rowNumberStr': rowNumber
            };


            var result = true;
            if (analyticsId === "") {
                $('#parsley-siteId').show();
                result = false;

            }

            if ($('#editDataTextarea').val() === "") {
                $('#parsley-data').show();
                result = false;
            }

            if (value.deviceGroups === "" || value.deviceGroups == "null" || JSON.stringify(value.deviceGroups) == '[""]' || JSON.stringify(value.deviceGroups) == '["null"]') {
                $('#parsley-device').show();
                $('#moduleCircle').focus();
                result = false;
            }

            if (value.circles === "" || value.circles == "null" || JSON.stringify(value.circles) == '[""]' || JSON.stringify(value.circles) == '["null"]') {
                $('#parsley-circle').show();
                $('#moduleDeviceSel').focus();
                result = false;
            }

            if (value.radio === "" || value.radio == "null" || JSON.stringify(value.radio) == '[""]' || JSON.stringify(value.radio) == '["null"]') {
                $('#parsley-radio').show();
                $('#moduleRadioSel').focus();
                result = false;
            }

            if (value.language === "" || value.language === "null" || JSON.stringify(value.language) == '[""]' || JSON.stringify(value.language) == '["null"]') {
                $('#parsley-language').show();
                $('#moduleLanguageSel').focus();
                result = false;
            }
            if (moduleId1 === "") {
                $('#parsley-moduleId').show();
                $('#moduleModuleIdSel').focus();
                result = false;
            }

            $("#versionNumber").text();

            var url = $("#versionNumber").val() === undefined ? CMS_V1_SAVE_URL : CMS_V2_SAVE_URL;
            if (result) {
                $.post(url, data, function (res) {
                    if (res.indexOf("FAILED_STRING") === -1) {
                        $('.ms-spinner').hide();
                        $('#tab_contest').html(res);
                        $('#result_site_add').removeClass("msg-failure").addClass("msg-success").text(
                            "Site saved successfully.");
                        setTimeout(function () {
                            window.location.reload();
                        }, 500);

                    } else {
                        $('.ms-spinner').hide();
                        $('#result_site_add').removeClass("msg-success").addClass("msg-failure").text(
                            "Save operation unsucessful failed.");
                    }
                });
            }
        }
    });

    $('#rename_module').on('click', function (event) {

        var url = "gj/renameModule";

        if (flag) {
            //If flag is true - module is inactive, it cannot be renamed
            alert("Sorry!!! inactive modules cannot be renamed");

        }

        else {

            $('#rename_text').html('<input type="text" style="margin-top: 10px" id="rename_text_value" />').keyup(function () {

                modified_module_name = $("#rename_text_value").val();
                $("#save_new_name").prop("type", "button");

            });
            $("#save_new_name").click(function () {
                console.log("modified name is - -" + modified_module_name);

                var data = {
                    moduleId: moduleId,
                    siteId: siteId,
                    modifiedModuleName: modified_module_name
                };

                if (confirm('Click OK to change the module name from ' + moduleId + ' to ' + modified_module_name)) {

                    $.post(url, data, function (res) {
                        if (res.indexOf("FAILURE") === -1) {
                            setTimeout(function () {
                                window.location.reload();
                            }, 500);
                        } else {
                            alert("Changing module name failed!");
                        }
                    });
                    $("#save_new_name").prop("type", "hidden");
                    $("#rename_text_value").hide("slow");
                }


            });
        }


    });


    $("#activity_module").click(function () {

        var url = "gj/activity";

        var data = {
            moduleId: moduleId,
            siteId: siteId
        };

        if (!flag) {

            if (confirm('Click OK to change the module status from active to inactive')) {

                $(this).prop("value", "Make Active");
                console.log("status - inactive");
                data.status = "inactive";
                $(this).css('background-image', 'none').css('background-color', '#ff0000');

                $.post(url, data, function (res) {
                    if (res.indexOf("FAILURE") === -1) {
                        setTimeout(function () {
                            window.location.reload();
                        }, 500);
                        //alert("Module is INACTIVE now");
                    } else {
                        alert("Changing module status has failed!");
                    }
                });
                flag = true;
            }

        }
        else {

            if (confirm('Click OK to change the module status from inactive to active')) {


                $(this).prop("value", "Make Inactive");
                console.log("status - active");
                data.status = "active";
                $(this).css('background-image', 'none').css('background-color', 'blue');

                $.post(url, data, function (res) {
                    if (res.indexOf("FAILURE") === -1) {

                        //alert("Module is ACTIVE now");
                        setTimeout(function () {
                            window.location.reload();
                        }, 500);
                    } else {
                        alert("Changing module status has failed!");
                    }
                });
            }
            flag = false;
        }

    });


    $('#view_last_version').live('click', function (event) {
        var versionSign = "~0";
        event.preventDefault();
        var moduleId = getUrlParameter("moduleId");
        if (moduleId.indexOf("~") == -1) {
            var url = $("#versionNumber").val() === undefined ? CMS_V1_INDEX_URL : CMS_V2_INDEX_URL;
            window.location.href = url + "?siteId=" + $("#searchSiteId").val().trim() + "&moduleId=" + $("#searchModuleId").val().trim() + versionSign;
        }
        else {
            alert("Viewing last version only!");
        }
    });

    $('#undo_last_version').live('click', function (event) {
        event.preventDefault();
        var url = "gj/undo";
        var versionSign = "~0";
        var moduleId = getUrlParameter("moduleId");
        var siteId = getUrlParameter("siteId");
        var data = {
            moduleId: moduleId,
            siteId: siteId,
            versionSign: versionSign
        };
        if (confirm('Click OK to confirm undo')) {
            $.post(url, data, function (res) {
                if (res.indexOf("FAILURE") === -1) {

                    setTimeout(function () {
                        window.location.reload();
                    }, 500);
                } else {
                    alert("Undo to last version failed!");
                }
            });
        }
    });

    $('#newSite').live('click', function (event) {
        isEdit = false;
        event.preventDefault();
        $('#editSite select').val('');
        $("#idTextArea").val('');
        $("#editDataTextarea").val('');

        $("#dataText").hide();
        $("#edit_data").hide();
        $("#editDataTextarea").show();
        $(".formatJSON").show();

        $('#editSite').modal('show');
    });

    $('.delete_button').live('click', function (event) {

        var url = $("#versionNumber").val() === undefined ? CMS_V1_DELETE_URL : CMS_V2_DELETE_URL;


        if (confirm('Click OK to confirm delete')) {
            event.preventDefault();
            var ele = $(this);
            var id = ele.attr("name");
            var data = {
                'id': id
            };
            $.post(url, data, function (res) {

                if (res.indexOf("FAILED_STRING") === -1) {

                    setTimeout(function () {
                        window.location.reload();
                    }, 500);
                }
            });
        }
    });

    var showFlag = false;
    var previousRowNo = "";
    var jsonType = "";
    var firstPass = false;
    
    $('.edit_button').live('click', function (event) {

        var url = $("#versionNumber").val() === undefined ? CMS_V1_GET_URL : CMS_V2_GET_URL;

        isEdit = true;
        event.preventDefault();
        var ele = $(this);
        var id = ele.attr("name");
        var data = {
            'id': id
        };
        rowNumber = id;

        console.log("r = " + rowNumber + " pr " + previousRowNo);

        if(previousRowNo!=rowNumber) {
            showFlag = false;
            console.log("EMPTY");
            $("#dataText").empty();
        }
        previousRowNo = rowNumber;

        $.post(url, data, function (res) {
            var json = $.parseJSON(res);
            console.log("json  is - " + JSON.stringify(json.value.data));
            $('#editSite select').val('');
            $("#idTextArea").val('');
            $("#idTextArea").val(json.id);

            $("#editDataTextarea").hide();
            $("#dataText").show();
            $(".formatJSON").hide();
            
            if (isArray(json.value.data)) {
                if(!showFlag) {
                    var jsonArray = json.value.data;
                    if(!firstPass) {
                        if(jsonArray.length==1){
                            jsonType = 1;
                        }
                        else {
                            jsonType = 2;
                        }

                    }
                    console.log("its an - " + jsonArray.length);
                    var j = 0;
                    while(j<jsonArray.length) {
                        var jsonObj = jsonArray[j];
                        console.log("object " + JSON.stringify(jsonObj));
                        elements = objectSize(jsonObj);
                        console.log("number of elements - " + elements);
                        for (var k in jsonObj) {
                            createElement(jsonObj, k);
                        }
                        
                        j++;
                    }
                    showFlag = true;
                }
            }
            else {
                var dataObj = json.value.data;
                console.log(showFlag);
                if (!showFlag) {

                    for (var key in dataObj) {
                        if (dataObj.hasOwnProperty(key)) {
                            console.log(key + "-> " + dataObj[key]);
                            createElement(dataObj, key);
                        }
                    }

                    showFlag = true;
                }
            }
            
            function isArray(what) {
                return Object.prototype.toString.call(what) === '[object Array]';
            }

            function createElement(dataObj, key) {
                var newRow = $(document.createElement('tr')).attr("id", key);
                if (!isArray(dataObj[key])) {
                    newRow.html('<td style="font-weight: bold;font-style: italic">' + key + '</td>' +
                    '<td><input type="text" style="width: 465px;margin-bottom: 4px;margin-left: 15px" value="' + dataObj[key].toString() + '"></td>');
                    newRow.appendTo("#dataText");
                } else {
                    newRow.html('<td style="font-weight: bold;font-style: italic">' + key + '</td>');
                    console.log("created label");
                    newRow.appendTo("#dataText");
                    var jArray = dataObj[key];
                    for (var l = 0; l < jArray.length; l++) {
                        var jsonObj = jArray[l];
                        for (var k in jsonObj) {
                            createElement(jsonObj, k);
                        }
                    }
                }
                
            }
            
            function objectSize(obj) {
                var size = 0;
                for(var key in obj) {
                    console.log(key);
                    if (isArray(obj[key])) {
                        //obj[key] is an array having one element
                        console.log(obj[key]);
                        var array = obj[key];
                        for(var k=0;k<array.length;k++) {
                            size = size + objectSize(array[k]);
                            console.log("size in - " + size);
                        }
                        size = size + 1;
                    }
                    else {
                        size++;
                    }
                }
                console.log("size out - " + size);
                return size;
            }

            if (json.hasOwnProperty('analyticsId')) {
                $.each(json.analyticsId, function (index, value) {
                    $("#moduleSiteIdSel").val(json.analyticsId);
                });
            }
            if (json.hasOwnProperty('moduleId')) {
                $("#moduleModuleIdSel").val(json.moduleId)
            }
            if (json.hasOwnProperty('value')) {
                json = json.value;
                $("#editDataTextarea").val('');
                $("#editDataTextarea").val(JSON.stringify(json.data));
                if (json.hasOwnProperty('circles')) {
                    $.each(json.circles, function (index, value) {
                        $("#moduleCircle").val(json.circles)
                    });
                } else {
                    $("#moduleLanguage").val('pan')
                }

                $.each(json.deviceGroups, function (index, value) {
                    $("#moduleDeviceSel").val(json.deviceGroups)
                });

                if (json.hasOwnProperty('radio')) {
                    $.each(json.radio, function (index, value) {
                        console.log(json.radio);
                        $("#moduleRadioSel").val(json.radio)
                    });
                }

                if (json.hasOwnProperty('language')) {
                    $.each(json.language, function (index, value) {
                        $("#moduleLanguageSel").val(json.language)
                    });
                } else {
                    $("#moduleLanguageSel").val('pan')
                }
            }


            $('#editSite').modal('show');
        });
    });

    var getKeywordFromSelect = function (key) {
        var keyWords = "";
        if (!($('#module' + key).val() instanceof Array)) {
            keyWords += $('#module' + key).val()
            return keyWords;
        }

        for (i = 0; i < $('#module' + key).val().length; i++) {
            keyWords += $('#module' + key).val()[i];
            if (i < ($('#module' + key).val().length - 1)) {
                keyWords += ",";
            }
        }
        return keyWords;
    }

});

var commaSepStringToArray = function (commaString) {
    var json = [];
    var toSplit = commaString.split(",");
    for (var i = 0; i < toSplit.length; i++) {
        json.push(toSplit[i]);
    }
    return json;
};

function isValidJson(json) {
    try {
        JSON.parse(json);
        return true;
    } catch (e) {
        return false;
    }
}

function searchByModuleId() {
    var url = $("#versionNumber").val() === undefined ? CMS_V1_INDEX_URL : CMS_V2_INDEX_URL;
    window.location.replace(url + "?siteId=" + $("#searchSiteId").val().trim() + "&moduleId=" + $("#searchModuleId").val().trim());
}

function searchBySiteId() {

    var requestUrl = $("#versionNumber").val() === undefined ? CMS_V1_INDEX_URL : CMS_V2_INDEX_URL;

    $.ajax({
        url: requestUrl,
        data: {
            'siteId': $("#searchSiteId").val().trim()
        },
        success: function (res) {

        }
    });
}

function checkEditModuleId() {

    if ($('#editModuleIdCb').is(":checked")) {
        $("#searchModuleId").hide();
        $("#searchModuleIdText").prop("type", "text");
        $("#searchSiteId").hide();
        $("#searchSiteIdText").prop("type", "text");
        $("#searchEditedButton").prop("type", "button");
    } else {
        $("#searchModuleId").show();
        $("#searchModuleIdText").prop("type", "hidden");
        $("#searchSiteIdText").prop("type", "hidden");
        $("#searchSiteId").show();
        $("#searchEditedButton").prop("type", "hidden");
    }
}


function searchSiteModuleEdited() {
    var url = $("#versionNumber").val() === undefined ? CMS_V1_INDEX_URL : CMS_V2_INDEX_URL;

    window.location.replace(url + "?siteId=" + $("#searchSiteIdText").val().trim() + "&moduleId=" + $("#searchModuleIdText").val().trim());
}

function checkEdit() {
    if ($('#editCb').is(":checked")) {
        $("#moduleModuleIdSel").hide();
        $("#moduleModuleIdText").prop("type", "text");
        $("#moduleSiteIdSel").hide();
        $("#moduleSiteIdText").prop("type", "text");
    } else {
        $("#moduleModuleIdSel").show();
        $("#moduleModuleIdText").prop("type", "hidden");
        $("#moduleSiteIdText").prop("type", "hidden");
        $("#moduleSiteIdSel").show();
    }

}

function selectAll(id, isSelect) {
    $('#' + id + ' option').prop('selected', isSelect);
}

function getModules() {

    var url = $("#versionNumber").val() === undefined ? CMS_V1_GET_MODULES : CMS_V2_GET_MODULES;

    $("#loadingAjaxImage").show();
    var data = {
        'siteId': $("#moduleSiteIdSel").val().trim()
    };
    var html = "";
    var moduleJson = [""];
    $.post(url, data, function (res) {
        $("#loadingAjaxImage").hide();
        moduleJson = res;
        html += '<option value="" selected="selected" >Choose Module</option>';
        for (var i = 0; i < moduleJson.length; i++) {
            html += '<option value="' + moduleJson[i] + '">' + moduleJson[i] + '</option>';
        }
        $("#moduleModuleIdSel").html(html);
    });

}

function prettyJson() {
    var json = $("#editDataTextarea").val();
    var jsonParse = $.parseJSON(json);
    if (jsonParse != null) {
        if ($('#jsonPretty').is(":checked")) {
            $("#editDataTextarea").val(JSON.stringify(jsonParse, null, 4));
        }
        else {
            $("#editDataTextarea").val(JSON.stringify(jsonParse));
        }
    }
}

function uncheckCheckBoxes() {
    $('#jsonPretty').attr('checked', false);
    $('#editCb').attr('checked', false);

}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
} 


