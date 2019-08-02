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
	
<div class="control-group">
	<h3>Reset Password</h3>
	<c:if test="${message ne null}">
	     <c:choose>
	      <c:when test="${message.contains('updated')}">
		   <p style="color:green">${message}</p>
						<script type="text/javascript">
							setTimeout(function() {
								window.location.replace("/toolLogin");
							}, 3000);
						</script>
		  </c:when>
		  <c:otherwise>
		   <p style="color:blue">${message}</p>
		  </c:otherwise>
		</c:choose>
	</c:if>
	<c:if test="${updated eq null }">
	  <form action="/toolLogin/resetPassword" method="POST">
			<input type="hidden" id="rp_u" name="rp_u" value="${username }"/>
			<input type="password" id="rp_password" name=rp_password placeholder="new password" /><br /> 
			<input type="hidden" name="process" value="true" />
			<input type="hidden" name="ts" value="${ts}" />
			<input type="hidden" name="rp_cU" value="${cipheredUsername }" /> 
			<input type="submit" value="Submit" />
	  </form>
	</c:if>
	
	<c:if test="${errorMessage ne null}">
		<p style="color:red">${errorMessage}</p>
	</c:if>
	<a href="/toolLogin">Go to login page</a>
	</div>
	</div>

</body>
</html>