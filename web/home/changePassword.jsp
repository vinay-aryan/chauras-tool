<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>BSB Tool</title>
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
			<h1 style="margin-top:45px">BSB Tool</h1>
				Old Password  <input id="oldPassword" name="oldPassword" type="password"/><br>
				New Password  <input id="newPassword" name="newPassword" type="password"/><br>
				Re-type New Password  <input id="retypepwd" type="password"/><br>
				<span id="mandatory" style="display:none;color:red">All fields are mandatory</span>
				<span id="not_same" style="display:none;color:red">New password entered do not match</span>
				<span id="successfully" style="display:none;color:red">Updated Successfully. Please wait... Logging you out.</span>
				<span id="not_updated" style="display:none;color:red">Some error. Not Updated. Retry.</span>
				<br><button id="submit_form" class="btn btn-primary del_btn">Change Password</button>
				
		</div>
	</div>
	<script src="<c:url value="/resources/js/jquery.min.js" />"></script>
	<script src="<c:url value="/resources/js/jquery.tmpl.min.js" />"></script>
	<script src="<c:url value="/resources/js/dateformat.min.js" />"></script>
	<script src="<c:url value="/resources/js/bootstrap-modal.min.js" />"></script>
	<script>
	
	$("#submit_form").on('click', function(event) {
		$("#mandatory").hide();
		$("#not_same").hide();
		$('#not_updated').hide();
		$('#successfully').hide();
		var oldPassword = $('#oldPassword').val();
		var newPassword = $('#newPassword').val();
		var retypepwd = $('#retypepwd').val();
		if ( oldPassword== null || oldPassword == '' || newPassword == null || newPassword == '' || retypepwd == null || retypepwd == '') {
			$("#mandatory").show();
			return;
		}
		
		if(newPassword != retypepwd ){
			$("#not_same").show();
			return;
		}
		
		var data = {
				'oldPassword': oldPassword,
				'newPassword': newPassword
		};
		
		$.post('changePassword', data, function(res) {
			if (res.indexOf("Failed") == -1) {
				$('#successfully').show();
				setTimeout(function() {
					window.location.replace("logout");
				}, 2000);
			}else {
				$('#not_updated').html(res);
				$('#not_updated').show();
				}
			});
		
	});
	</script>
</body>
</html>
