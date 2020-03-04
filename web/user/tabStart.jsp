<%--
  Created by IntelliJ IDEA.
  User: poorvank
  Date: 1/16/15
  Time: 5:25 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="html" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
    <div>
        <div class="tabs_container">
            <jsp:include page="header.jsp" />
            <jsp:include page="../common/nav.jsp"/>
            <div class="wrapper">
	            <nav id="sidebar">
		            <ul class="list-unstyled components" id="myTab">
		                <p> Manage Users </p>
		                <li class="active"><a href="#tab_createUser" data-toggle="tab">Create Users</a></li>
		                <li><a href="#tab_manageUserRoles" data-toggle="tab">Update Users Role</a></li>
		                <li><a href="#tab_blockUser" data-toggle="tab">Block users</a></li>
		                <li><a href="#tab_listUser" data-toggle="tab">List users</a></li>
		                <br>
		                <p> Manage Roles </p>
		                <li><a href="#tab_manageRoles" data-toggle="tab">Create/Update Roles</a></li>
		                <!-- <li><a href="#tab_addRemoveRoles" data-toggle="tab">Add/Remove Roles</a></li>-->
		                
		            </ul>
	            </nav>
	            <div class="tab-content" style="margin-top: 50px;">
	            	 
					<div class="tab-pane active" id="tab_createUser">
	                    <%@ include file="users.jsp"%>
	                </div>
	                 <div class="tab-pane" id="tab_manageUserRoles">
	                    <%@ include file="manageUserRoles.jsp"%>
	                </div>
	                
	                <div class="tab-pane" id="tab_blockUser">
	                    <%@ include file="blockUser.jsp"%>
	                </div>
	                <div class="tab-pane" id="tab_listUser">
	                    <%@ include file="listUser.jsp"%>
	                </div>
	                <div class="tab-pane" id="tab_manageRoles">
	                    <%@ include file="manageRoles.jsp"%>
	                </div>
	                 <div class="tab-pane" id="tab_addRemoveRoles">
	                    <%@ include file="addRemoveRoles.jsp"%>
	                </div>
	                
	            </div>
	    	</div>
        </div>
    </div>
    <script>
        $('#myTab a').click(function (e) {
            e.preventDefault()
            $(this).tab('show')
        });

        // store the currently selected tab in the hash value
        $("ul.nav-tabs > li > a").on("shown.bs.tab", function (e) {
            var id = $(e.target).attr("href").substr(1);
            window.location.hash = id;
        });

        // on load of the page: switch to the currently selected tab
        var hash = window.location.hash;
        $('#myTab a[href="' + hash + '"]').tab('show');
    </script>
    <link href="<c:url value="/resources/css/navstyle.css" />" rel="stylesheet">
</body>
</html>
