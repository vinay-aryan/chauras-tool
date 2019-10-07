<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
	<div>
		<div class="container_listing">
			<jsp:include page="header.jsp" />
			<jsp:include page="../common/nav.jsp" />
			<h3 class="fancy">Create New User</h3>
			<div class="control-group">
				<form action="/users/createUser" method="post" id="createUserForm">
					<input type="text" name="toolUserName" id="toolUserName" placeholder="username" /> 
					<br/>
					<input type="password" name="toolPassword" id="toolPassword"  placeholder="password"/>
					<br/> 
					<input type="text" name="toolEmailId" id="toolEmailId"  placeholder="email"/>
					<br>
					<br>
					Select Role(s)
					<br>
					<select name="roles" multiple="multiple" id="rolesSelect">
						<c:forEach var="role" items="${roles}">
							<option value="${role.getRoleName()}">${role.getRoleName()}</option>
						</c:forEach>
					</select>
					<br>
					Select Language(s)
					<br>
					<select name="languages" multiple="multiple" id="langsSelect">
						<c:forEach var="language" items="${languages}">
							<option value="${language.getDisplayName()}">${language.getDisplayName()}</option>
						</c:forEach>
					</select> 
				</form>
				<input type="button" onClick="createUserSubmit();" value="Create User"> 
			</div>
		</div>
	</div>
	<script>
	
		function createUserSubmit() {
			
			var toolUserName = $("#toolUserName").val();
			var toolPassword = $("#toolPassword").val();
			var toolEmailId = $('#toolEmailId').val();
			var rolesArr = $("#rolesSelect").val();
			var langsArr = $('#langsSelect').val();
			if (toolUserName == undefined || toolUserName == null) {
				return;
			}
			if (toolPassword == undefined || toolPassword == null) {
				return;
			}
			if (toolEmailId == undefined || toolEmailId == null) {
				return;
			}
			if (rolesArr == undefined || rolesArr == null) {
				return;
			}
			if (langsArr == undefined || langsArr == null) {
				return;
			}
			var url = "/users/createUser";
			var data = {
				"username" : toolUserName,
				"password" : toolPassword,
				"emailId" : toolEmailId,
				"roles" : rolesArr.toString(),
				"languages" : langsArr.toString()
			};
			console.log(data);
			$.post(url, data, function(res) {
				if (res.indexOf("FAILURE") === -1) {
					alert("User creation Successful");
					setTimeout(function() {
						window.location.reload();
					}, 500);
				} else {
					alert("User creation FAILED: " + res);
				}
			});
			return false;
		}
	</script>
</body>
</html>