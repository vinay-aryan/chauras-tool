<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<div class="navbar navbar-inverse navbar-fixed-top">
  <div class="navbar-inner" style="margin-top: -30px;">
    <div class="container">
      <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="brand" href="<c:url value="/" />">BSB Tools</a>
      <sec:authorize access="isAuthenticated()">
            <span style="float:right;color: white;">Hello <sec:authentication property="principal" /> ! 
	  		<a href="<c:url value="/logout"/>" style="color: white;">Log out</a> |
	  		<a href="<c:url value="/changePassword"/>" style="color: white;">Change Password</a> |
            <a href="<c:url value="/profile"/>" style="color: white;">Edit Profile</a> 
	  		</span>
      </sec:authorize>
      <div class="nav-collapse collapse">
        <ul class="nav">
        	<c:forEach var="module" items="${navigationEnum}">
					<li><a href="<c:url value="${module.url }" />">${module.name}</a></li>
			</c:forEach>
          <%-- <li ><a href="<c:url value="/" />">Home</a></li>
          <li><a href="<c:url value="/gallery" />">Gallery</a></li>
          <li><a href="<c:url value="/starprofile" />">Star Profile</a></li>
          <li><a href="<c:url value="/microsites" />">Microsites</a></li>
          <li><a href="<c:url value="/video" />">Video</a></li>
          <li><a href="<c:url value="/monitor/videoReport" />">Video Ingestion Report</a></li>

          <li><a href="<c:url value="/election/poll.html" />">Poll</a></li>
          <li><a href="<c:url value="/election/modseq.html" />">Module Sequence</a></li>

          <li><a href="<c:url value="/election/index.html" />">Election/Fifa</a></li>

          <li><a href="<c:url value="/monitor/videoReport" />">Video Report</a></li>
          <li><a href="<c:url value="/monitor/photostats" />">Photo Report</a></li>
          <li><a href="<c:url value="/banner/index" />">Banner</a></li>
          <li><a href="<c:url value="/twitter/index" />">Twitter</a></li>
          <li><a href="<c:url value="/recommended/index" />">Recommended Module</a></li>
          <li><a href="<c:url value="/transliterate/index" />">Transliterate</a></li>
          <li><a href="<c:url value="/lp/index" />">Landing Page</a></li> --%>
        </ul>
      </div><!--/.nav-collapse -->
    </div>
  </div>
</div>
	