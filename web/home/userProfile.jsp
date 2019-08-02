<%--
  Created by IntelliJ IDEA.
  User: poorvank
  Date: 1/29/15
  Time: 11:50 AM
  To change this template use File | Settings | File Templates.
--%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>BSB Tool</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="shortcut icon"
        href="<c:url value="../resources/img/favicon.ico" />">
  <!-- Le styles -->
  <link href="<c:url value="/resources/css/bootstrap.min.css" />"
        rel="stylesheet">
  <style>
    body {
      padding-top: 60px;
      /* 60px to make the container go all the way to the bottom of the top bar */
    }
  </style>
  <link href="<c:url value="/resources/css/bootstrap-responsive.min.css" />"
        rel="stylesheet">
</head>
<body>
  <%@ include file="../common/nav.jsp"%>
  <script src="<c:url value="/resources/js/jquery.min.js" />"></script>
  <script src="<c:url value="/resources/js/jquery.tmpl.min.js" />"></script>
  <script src="<c:url value="/resources/js/dateformat.min.js" />"></script>
  <script src="<c:url value="/resources/js/bootstrap-modal.min.js" />"></script>
  <script>
    window.onload = getUserInfo();
    function getUserInfo() {
      $.get('/getUserInfo', function(res) {
        if (res.indexOf("Failed") == -1) {
          console.log(res);
          var obj = JSON.parse(res);
          $('#txt_name').val(obj.email);
          $("#welcome_text").text(obj.name);
        }
        else {
          alert("Updating Failed");
        }
      });
    }
    //Validate Email
    function ValidateEmail(email)
    {
      var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if(email.match(mailFormat)) {
        return true;
      }
      else {
        return false;
      }
    }
    function changeEmailId() {
      var email = $('#txt_name').val();
      if(!ValidateEmail(email)) {
        alert("Email Id has an incorrect format!");
      }
      else {
        var data = {
          "emailId" : email
        };
        $.post('/updateEmail', data, function(res) {
          if (res.indexOf("Failed") == -1) {
            alert("Profile Updated Successfully");
            setTimeout(function() {
              window.location.reload();
            }, 500);
          }else {
            alert("Error occurred while updating email");
          }
        });
      }
    }
  </script>
  <div class="container" style="margin-top: 100px">
    <span>Welcome <span id="welcome_text"></span>!!!</span>
    <br>Your Email ID - <input type="text" id="txt_name" style="margin-top: 6px" />
    <br><button id="changeEmail" onClick="changeEmailId();" class="btn btn-primary del_btn">Update</button>
  </div>

</body>
</html>

