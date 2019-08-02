<%--
  Created by IntelliJ IDEA.
  User: poorvank
  Date: 1/30/15
  Time: 3:10 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="html" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
  <div class="block_user">
    <jsp:include page="header.jsp" />
    <jsp:include page="../common/nav.jsp" />
    <h3 class="fancy" style="margin-left: 50px; margin-bottom: 35px">Block Users</h3>

    <form method="post" id="userDisplay">
      <p
              style="display: inline; font-style: italic; font-weight: bold; font-size: 16px; margin-left: 50px;">SELECT
        USER</p>
      <select name="UserName" id="select_block_user"  style="display: block; margin-left: 50px; margin-bottom: 50px;">
        <option value="">Choose User</option>
        <c:forEach var="user" items="${users}">
          <option value="${user.username}" >${user.username}</option>
        </c:forEach>
      </select>
    </form>
    <input type="button" id="block_module" value="Block" class="btn btn-primary" style="margin-left: 50px; margin-top: 30px;" >
    <input type="button" id="unblock_module" value="Unblock" class="btn btn-primary" style="margin-left: 50px; margin-top: 30px;">
  <script>


    $(document).ready(function() {

      var username;

      $("#block_module").prop("type","hidden");
      $("#unblock_module").prop("type","hidden");


      $("#block_module,#unblock_module").click(function(){
        var buttonClick = $(this).val();
        console.log(buttonClick);
        var url = "/users/updateBlockUsers";
        if(username == undefined || username == null || username.trim() == "") {
          alert("No user Selected ");
          return;
        }
        console.log(username);
        var data = {
          "username" : username,
          "blockStatus" : $(this).val()
        };
        console.log(data);
        $.post(url,data,function(res) {
          console.log(res);
          if(res.indexOf("FAILED")==-1) {
            if(buttonClick === "Block") {
              alert("Blocked");
            }
            else {
              alert("Unblocked")
            }
            setTimeout(function() {
              window.location.reload()
            },400);
          }
          else{
            alert("Blocking not possible");
          }
        });

      });


      $("#select_block_user").on('change',function() {
        username = $(this).val();
        if(username == undefined || username == null || username.trim() == "") {
          $("#block_module").prop("type","hidden");
          $("#unblock_module").prop("type","hidden");
          return;
        }

        console.log("name- " + username);
        var url = "/users/getBlockStatus";

        var data = {
          "username" : username
        };

        $.post(url, data, function(res) {

          if (res.indexOf("FAILURE") === -1) {
            console.log(res);
            if(res.indexOf("true") == -1) {
              $("#block_module").prop("type","button");
              $("#unblock_module").prop("type","hidden");
            } else {
              $("#unblock_module").prop("type","button");
              $("#block_module").prop("type","hidden");
            }
          } else {
            console.log("blockUser FAILED !!!");
          }

        });

      });

    });

  </script>
</body>
</html>
