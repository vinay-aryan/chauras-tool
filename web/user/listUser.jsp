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
			<h3 class="fancy" style="margin-left: 50px; margin-bottom: 35px">Users List with their Roles and Languages</h3>
			

				<p style="display: inline; font-style: italic; font-weight: bold; font-size: 16px; margin-left: 50px;">
					User &emsp;&emsp;&emsp;&emsp;&emsp; Roles &emsp;&emsp;&emsp;&emsp;&emsp; Languages </p>
				<ul name="UserName" id="userList"
					style="display: block; margin-left: 50px; margin-bottom: 50px;"
					onchange="getRolesForUser1()">
					<c:forEach var="user" items="${users}">
						<li value="${user.username}"> ${user.username}&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
						    
							<c:forEach var="role" items="${user.getRoles()}">
							 		${role},
							</c:forEach>
							&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
							<c:forEach var="langs" items="${user.getLanguage()}">
							 		${langs},
							</c:forEach>
						</li>
					</c:forEach>
				</ul>
			</form>

		</div>
		
	</div>
</body>
<script>
console.log(users);</script>

</html>
