<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Tool Login</title>
</head>
<body>
<div class="container_listing">
			<jsp:include page="header.jsp" />
			<jsp:include page="../common/nav.jsp" />
<h3>Tool Login</h3>
	
<div class="control-group">
<form action="/j_spring_security_check" method="POST" id="loginForm">
 <input type="text" id="username" name="username" placeholder="Username" value="${username}"/><br/>
<input type="password" id="password" name="password" placeholder="Password" value="${password}"/><br/>
<input type="checkbox" id="remember" name="remember" value="true"/> Remember me <br/><br/>
<input type="button" value="login" onclick="checkBlocked();return false;"/>
</form>
    <c:if test="${message ne null}">
	  <p style="color:green">${message}</p>
	</c:if>
	<c:if test="${errorMessage ne null}">
		<p style="color:red">${errorMessage}</p>
	</c:if>
<a href="/toolLogin/forgotPassword">Forgot Your Password ?</a>
</div>

	
</div>

<script>
function checkBlocked(){
	var oMyForm = new FormData();
   oMyForm.append("username", $('#username').val());
   oMyForm.append("password",$('#password').val());
   if($('#remember').attr('checked') == 'checked'){
	   oMyForm.append("remember",true);
   }
   else{
	   oMyForm.append("remember",false);
   }
	
	$.ajax({
		url : '/toolLogin/checkBlocked.html',
		data : oMyForm,
		dataType : 'text',
		processData : false,
		contentType : false,
		type : 'POST',
		success : function(data) {
			if( data == "success"){
				$('#loginForm').submit();
			}
			else if(data == "blocked"){
				window.location.replace("/toolLogin?auth=blocked");
			}
		}
	});
}
</script>
</body>
</html>