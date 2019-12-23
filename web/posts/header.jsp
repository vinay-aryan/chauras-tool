<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
		<c:set var="url">${pageContext.request.requestURL}</c:set>
	    <base href="${fn:substring(url, 0, fn:length(url) - fn:length(pageContext.request.requestURI))}${pageContext.request.contextPath}/" />
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="">
        <meta name="author" content="">
		<c:choose>
		<c:when test="${pageContext.request.isSecure() == true}">
       	<script type="text/javascript" src="https://platform.twitter.com/widgets.js"></script> 	
       </c:when>
       <c:otherwise>
       	<script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>
       </c:otherwise>
		
		</c:choose>        
 
        <script type="text/javascript" src="<c:url value="/resources/js/jquery.min.js" />"></script>
        <script type="text/javascript" src="<c:url value="/resources/js/jquery-ui.min.js" />"></script>
       	<script type="text/javascript" src="<c:url value="/resources/js/floating-1.8.min.js" />"></script>
		<%-- <script type="text/javascript" src="<c:url value="/resources/js/toolUser/toolUser.js" />"></script> --%>
		<script type="text/javascript" src="<c:url value="/resources/js/parsley.min.js" />"></script>
		<script type="text/javascript" src="<c:url value="/resources/js/bootstrap-datetimepicker.min.js" />"></script>
		<script type="text/javascript" src="<c:url value="/resources/js/bootstrap-tagmanager.min.js" />"></script>
		<script type="text/javascript" src="<c:url value="/resources/js/bootstrap.min.js" />"></script>
		<script type="text/javascript" src="/resources/js/jquery-te-1.4.0.min.js" charset="utf-8"></script>
		<link type="text/css" rel="stylesheet" href="/resources/css/jquery-te-1.4.0.css">
		<head>
		  <meta charset="utf-8">
		  <title>Create User</title>
		  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		  <link rel="shortcut icon" href="<c:url value="/resources/img/favicon.ico" />">
		  <!-- Le styles -->
		  <link href="<c:url value="/resources/css/jqueryui.min.css" />" rel="stylesheet">
		  <link href="<c:url value="/resources/css/bootstrap.min.css" />" rel="stylesheet">
		  <link href="<c:url value="/resources/css/bootstrap-fileupload.min.css" />" rel="stylesheet">
		  <link href="<c:url value="/resources/css/bootstrap-tagmanager.css" />" rel="stylesheet">
		  <link href="<c:url value="/resources/css/gallery.css" />" rel="stylesheet">
		  <link href="<c:url value="/resources/css/microsites.css" />" rel="stylesheet">
	      <link href="<c:url value="/resources/css/bootstrap-responsive.min.css" />" rel="stylesheet">
	      <link href="<c:url value="/resources/css/bootstrap-datetimepicker.min.css" />" rel="stylesheet">
		  <style>
		    body {
		      padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
		    }
		  </style>
        <link rel="shortcut icon" href="<c:url value="/resources/img/favicon.ico" />">
        </head>