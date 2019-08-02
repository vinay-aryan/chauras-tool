<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<ul class="nav nav-tabs" style="margin-top: 20px;" id="myTab">
	<c:forEach var="subModule" items="${subNavEnum}">
		<c:choose>
			<c:when test="${activeSubModule.name eq subModule.name}">
				<li class="active"><a
					href="<c:url value="${subModule.url }" />">${subModule.name}</a></li>
			</c:when>
			<c:otherwise>
				<li><a href="<c:url value="${subModule.url }" />">${subModule.name}</a>
				</li>
			</c:otherwise>
		</c:choose>
	</c:forEach>
</ul>
