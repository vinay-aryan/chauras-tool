<%--
  Created by IntelliJ IDEA.
  User: poorvank
  Date: 1/16/15
  Time: 2:37 PM
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
	<div>
		<div class="manage_user_Roles">
			<jsp:include page="header.jsp" />
			<jsp:include page="../common/nav.jsp" />
			<h3 class="fancy" style="margin-left: 50px; margin-bottom: 35px">Manage
				User Roles</h3>

			<form action="/users/manageRoles" method="post" id="userManagement">
				<p
					style="display: inline; font-style: italic; font-weight: bold; font-size: 16px; margin-left: 50px;">SELECT
					USER</p>
				<select name="UserName" id="userSelect1"
					style="display: block; margin-left: 50px; margin-bottom: 50px;"
					onchange="getRolesForUser1()">
					<c:forEach var="user" items="${users}">
						<option value="${user.username}">${user.username}</option>
					</c:forEach>
				</select>
				<p
					style="display: inline; font-style: italic; font-weight: bold; font-size: 16px; margin-left: 50px;">SELECT
					ROLE(s)</p>
				<c:forEach var="role" items="${roles}">
					<tr>
						<td><input type="checkbox" name="userRoles1"
							style="margin-bottom: 4px; margin-left: 10px; margin-right: 5px;"
							value="${role.getRoleName()}">${role.getRoleName()}</td>
					</tr>
				</c:forEach>
			</form>
			<input type="button" onClick="updateRoles();" value="Done"
				class="btn btn-primary" style="margin-left: 50px; margin-top: 30px">

		</div>
		<script>
			window.onload = getRolesForUser1();

			function updateRoles() {
				var userName = $("#userSelect1").val();
				var userRoles = new Array();
				$.each($("input[name='userRoles1']:checked"), function() {
					userRoles.push($(this).val());
				});
				console.log(userRoles + " " + userName);
				if (userName == undefined || userName == null) {
					alert("No user selected");
					return;
				}
				if (userRoles == undefined || userRoles == null) {
					return;
				}
				var url = "/users/manageUser";
				var data = {
					"username" : userName.toString(),
					"roles" : userRoles.toString(),
					"action" : "overWrite"
				};
				$.post(url, data, function(res) {
					if (res.indexOf("FAILURE") === -1) {
						alert("User management Successful");
						setTimeout(function() {
							window.location.reload();
						}, 500);
					} else {
						alert("User management FAILED !!!");
					}
				});
			}
			function getRolesForUser1() {
				var username = $("#userSelect1").val();
				var url = "/users/getRolesForUser";
				var data = {
					"username" : username.toString()
				};
				$.post(url, data, function(res) {
					if (res.indexOf("FAILURE") === -1) {
						console.log("result: " + res);
						var sList = "";
						$("input[name='userRoles1']").each(function() {
							if (res.indexOf($(this).val()) != -1) {
								$(this).prop('checked', true);
							} else {
								$(this).prop('checked', false);
							}
						});
					} else {
						console.log("getRolesForUser FAILED !!!");
					}
				});
			}
		</script>
	</div>
</body>
</html>
