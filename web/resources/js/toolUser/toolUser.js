var createUserSubmit = function() {
	var toolUserName = $("#toolUserName").val();
	var toolPassword = $("#toolPassword").val();
	var rolesArr = $("#rolesSelect").val();
	if(toolUserName == undefined || toolUserName == null) {
		return;
	}
	if(toolPassword == undefined || toolPassword == null) {
		return;
	}
	if(rolesArr == undefined || rolesArr == null) {
		return;
	}
//	$("#createUserForm").submit();
	var url = "/users/createUser";
	var data = {
			"username" : toolUserName,
			"password" : toolPassword,
			"roles" : rolesArr
	};
	$.post(url, data, function(res) {
		if (res.indexOf("FAILURE") === -1) {
			alert("User creation Successful");
			setTimeout(function() {
				window.location.reload();
			}, 500);
		} else {
			alert("User creation FAILED !!!");
		}
	})
};