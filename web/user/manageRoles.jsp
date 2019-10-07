<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<div>
	<div class="container_listing">
		<jsp:include page="header.jsp" />
		<jsp:include page="../common/nav.jsp" />
          <h3 class="fancy" style="margin-top: 0px">Manage roles</h3>


   <form class="form-horizontal" id="role_basic_info" name="role_basic_info" data-validate="parsley">
       <fieldset>
		   <div class="control-group">
               <label class="control-label">Role </label>
                 <div class="controls">
                     <select  name="roles" id="roleSelect" onchange="getPermissionsForRole()">
                          <option value="">Choose Role</option>
                           <c:forEach var="role" items="${roles}">
                                       
                          <option value="${role.roleName}">${role.roleName}</option>
                           </c:forEach>
                     </select>
                      <input type="text" id="roleText" name="role" style="display:none"/>
                      <br/>
                      <input type="checkbox" id="add" name="add" onchange="updateCheckedProperty(); return false;"/>To Add New Role Check here            
                     </div>
		   </div>
		   <div class="control-group">
               <label class="control-label">Choose Permission(s) </label>
                 <div class="controls">
                    <select size="23" name="permissions" id="permissions" multiple>
                           <c:forEach var="permission" items="${permissions}">
                          		<option value="${permission.access}">${permission.name}</option>
                           </c:forEach>
                           <c:forEach var="subPermission" items="${subPermissions}">
                          		<option value="${subPermission.moduleName.access}-${subPermission.access}">${subPermission.moduleName.name} - ${subPermission.name}</option>               		
                           </c:forEach>
                     </select>                 
                </div>
		   </div>
		   <div class="control-group">
                 <div class="controls">
                   <input type="button" value="Add/Update" onclick="submitManageRoles()">                
                </div>
		   </div>
		</fieldset>
</form>
</div>
</div>

<script type="text/javascript">
var isAdd = false;
function updateCheckedProperty(){
   if($("#add").attr('checked') == 'checked'){
	   $('#roleSelect').hide();
	   $('#roleText').show();
	   isAdd = true;
   }
   else{
	   $('#roleSelect').show();
	   $('#roleText').hide(); 
	   isAdd = false;
   }
}

function submitManageRoles() {
	var roleName = $("#roleSelect").val();
	if(isAdd) {
		roleName = $("#roleText").val();
	}
	var permissions = $("#permissions").val();
	if(roleName == undefined || roleName == null || roleName.trim() == "") {
		alert("role can't be empty!!!");
		return;
	}
	if(permissions == undefined || permissions == null) {
		alert("must select at least one permission\n for this role!!!");
		return;
	}
	var url = "/users/updateRole";
	var data = {
			"roleName" : roleName,
			"permissions" : permissions.toString()
	};
	$.post(url, data, function(res) {
		if (res.indexOf("FAILURE") === -1) {
			alert("User role added/updated successfully");
			setTimeout(function() {
				window.location.reload();
			}, 500);
		} else {
			alert("Managing role FAILED !!!");
		}
	});
}

function getPermissionsForRole() {
	var roleName = $("#roleSelect").val();
	var url = "/users/getPermissionsForRole";
	var data = {
			"roleName" : roleName
	};
	$.post(url, data, function(res) {
		if (res.indexOf("FAILURE") === -1) {
			console.log("result: "+res);
		    $("#permissions").val(res);
		} else {
			console.log("getPermissionsForRole FAILED !!!");
		}
	});
}

</script>