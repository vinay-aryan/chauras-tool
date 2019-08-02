<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Chaauras CMS</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="shortcut icon"
	href="<c:url value="../resources/img/favicon.ico" />">
<!-- Le styles -->
<link href="<c:url value="/resources/css/bootstrap.min.css" />"
	rel="stylesheet">
<style>
body {
	padding-top: 60px;
	/* 60px to make the container go all the way to the bottom of the topbar */
}
</style>
<link href="<c:url value="/resources/css/bootstrap-responsive.min.css" />"
	rel="stylesheet">
</head>
<body>
	<%@ include file="../common/nav.jsp"%>
	<div class="container">
		<div id="main-container" class="container">
			<h1 style="margin-top:45px">Chaauras CMS</h1>
			<ul class="nav nav-tabs nav-stacked">
				<c:forEach var="module" items="${navigationEnum}">
						<li><a href="<c:url value="${module.url }" />">${module.name}</a></li>
				</c:forEach>
<%-- 				<li><a href="<c:url value="/gallery" />">Gallery Management</a></li>
				<li><a href="<c:url value="/starprofile" />">Star Profile Management</a></li>
				<li><a href="<c:url value="/microsites" />">Microsite Management</a></li>
				<li><a href="<c:url value="/video" />">Video Management</a></li>
				<li><a href="<c:url value="/monitor/videoReport" />">Video Ingestion Report</a></li>
				
				<li><a href="<c:url value="/election/poll.html" />">Poll Management</a></li>
				<li><a href="<c:url value="/election/modseq.html" />">Module Sequence Management</a></li>
                 
				<li><a href="<c:url value="/monitor/videoReport" />">Video Report</a></li>
				<li><a href="<c:url value="/monitor/photostats" />">Photo Report</a></li>
				<li><a href="<c:url value="/banner/index" />">Banner</a></li>
				<li><a href="<c:url value="/twitter/index" />">Twitter</a></li>
				<li><a href="<c:url value="/recommended/index" />">Recommended Module</a></li>
				<li><a href="<c:url value="/transliterate/index" />">Transliterate</a></li>
				<li><a href="<c:url value="/lp/index" />">Landing Page</a></li> --%>
			</ul>
		</div>
		<!-- /container -->
	</div>
	<script src="<c:url value="/resources/js/jquery.min.js" />"></script>
	<script src="<c:url value="/resources/js/jquery.tmpl.min.js" />"></script>
	<script src="<c:url value="/resources/js/dateformat.min.js" />"></script>
	<script src="<c:url value="/resources/js/bootstrap-modal.min.js" />"></script>
</body>
</html>
