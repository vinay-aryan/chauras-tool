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
	<h3>Forgot Password</h3>
	<div class="control-group">
	<c:if test="${message ne null}">
	     <c:choose>
	      <c:when test="${message.contains('password link')}">
		   <p style="color:green">${message}</p>
		  </c:when>
		  <c:otherwise>
		   <p style="color:blue">${message}</p>
		  </c:otherwise>
		</c:choose>
	</c:if>
	<form action="/toolLogin/forgotPassword" method="POST">
			<input type="text" id="username" name="fp_username" placeholder="Username" /><br /> 
			<input type="text" id="emailId" name=fp_emailId placeholder="EmailId" /><br /> 
			<input type="hidden" name="process" value="true" />
			<input type="submit" value="Submit" />
	</form>
	<c:if test="${errorMessage ne null}">
		<p style="color:red">${errorMessage}</p>
	</c:if>
	<a href="/toolLogin">Go to login page</a>
</div>
</div>
</body>
</html>