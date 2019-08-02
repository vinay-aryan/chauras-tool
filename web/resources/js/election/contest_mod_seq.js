$(function() {

//----------------------Property Poll -----------------------------------------------------// 
//	$('#property').change(function() {
//		var property = $("#property").val();
//			//alert("DATA: "+ property);
//		  //alert("data field");
//	
//		if(property){
//			window.location.replace("election/index.html?property="+ property);
//			$.post('election/index.html?property='+property, property, function(res) {
//				console.log(res);		
//				if (res.indexOf("FAILEDCONTEST") === -1) {
//					$('#property_tab').html(res);
//					
//					$('#property').removeClass("msg-failure").addClass("msg-success").text("New Property Poll loaded");
//					//window.location.replace("election/index.html?property="+ property	);
//					//location.reload();
//				} else {
//					
//					$('#property').removeClass("msg-success").addClass("msg-failure").text("Failed to Load");
//				}
//			});
//	} else {
//		$('#property').removeClass("msg-success").addClass("msg-failure").text("Failed to load");
//  }
//	});
	
	
//-----------------------------------------Contest---------------------------------------------//

	$('#question_new_form').live('submit', function(event) {
		event.preventDefault();
		var result = $('#question_new_form').parsley('validate');
		
		if(result) {
			var data = {
					'language' : $('#language').val().trim(),
					'question' : $('#question_new').val().trim(),
					'property' : $('#property').val(),
					};
//			  var property = $('#property').val();
//			  var language = $('#language').val();
//			  var question = $('#question_new').val();
//			  alert("property : "+property);
//			  alert("language : "+language);
//			  alert("question : "+question);
			  
				var options_length = parseInt($('#options_count').val().trim(),10);
				data['options'] = new Array();
				for ( var i = 0; i < options_length; i++) {
					data['options'][i] = $('#options_new_' + i).val();
				}
				var origOrder = 2000;
				alert(JSON.stringify(data));
				$.post('election/question/' + origOrder, data, function(res) {
					
					if (res.indexOf("FAILEDCONTEST") === -1) {
					
						$('#result_question_add').removeClass("msg-failure").addClass("msg-success").text("Question Added successfully.");
						window.location.replace("election/poll.html");
					} else {
						
						$('#result_question_add').removeClass("msg-success").addClass("msg-failure").text("Failed to add question.");
					}
				});
		} else {
			$('#result_question_add').removeClass("msg-success").addClass("msg-failure").text("Failed to add question.");
		}

	});
	
	
	$('#editQuestionForm').live('submit', function(event) {
		event.preventDefault();
		var result = $('#editQuestionForm').parsley('validate');
		if(result) {
			
			var data = {
					'language' : $('#editLanguage').val().trim(),
					'property' : $('#editProperty').val().trim(),
					'question' : $('#editQuestionTextarea').val().trim(),
					'qid' : $('#editQuestionId').val().trim()
					
					};
				var options_length = parseInt($('#editOptionsCount').val().trim(),10);
				data['options'] = new Array();
				for ( var i = 0; i < options_length; i++) {
					data['options'][i] = $('#editOption' + i).val();
				}
				var origOrder = 2001;
				
				$.post('election/editquestion/' + origOrder, data, function(res) {
					
					
					if (res.indexOf("FAILEDCONTEST") === -1) {
					
						window.location.replace("election/poll.html");
						$('#result_question_add').removeClass("msg-failure").addClass("msg-success").text("Question Added successfully.");
					} else {
						
						$('#result_question_add').removeClass("msg-success").addClass("msg-failure").text("Failed to add question.");
					}
				});
		} else {
			$('#result_question_add').removeClass("msg-success").addClass("msg-failure").text("Failed to add question.");
		}
	});

	
	$('.edit_button').live('click', function(event) {
		event.preventDefault();
		
		$("#editProperty").val('');
		$("#editLanguage").val('');
		$("#editQuestionTextarea").html('');
		$("#editOptionsCount").val('');
		$("#editQuestionId").val('');
		for (var i = 0; i < 4; i++) {
		    $("#editOption"+i).val('');
		}
		var rowId=this.id;
		var property=$("#"+rowId+" td:nth-child(1)").text().trim();
		var language=$("#"+rowId+" td:nth-child(2)").text().trim();
		var questionId=$("#"+rowId+" td:nth-child(3)").text().trim();
		var question=$("#"+rowId+" td:nth-child(4)").text().trim();
		var answers=$("#"+rowId+" td:nth-child(5)").text().trim().split(",");
		$("#editLanguage").val(language);
		$("#editQuestionTextarea").html(question);
		$("#editOptionsCount").val(answers.length);
		$("#editQuestionId").val(questionId);
		$("#editProperty").val(property);
		$.each( answers, function( i, val ) {
				$("#editOption"+i).val(val.trim());
			});
		$('#editQuestion').modal('show');
	});
	
	
	
	$('.edit_question_btn').live('click', function(event) {
		event.preventDefault();
		var order = $(this).attr('id').split('_')[2];
		$('#order_' + order).attr("disabled", false);
		$('#question_' + order).attr("disabled", false);
		$('#questionId_' + order).attr("disabled", false);
		for ( var i = 0; i < 4; i++)
			$('#options_' + order + '_' + i).attr("disabled", false);
		$('input[name=answer_' + order + ']').attr("disabled", false);
		$(this).attr("disabled", true);
		$('#save_question_' + order).attr("disabled", false);
		$('#reset_question_' + order).attr("disabled", false);
	});

		$('#no_delete').live('click',function() {
		hideDeletePopup();
	});

	function hideDeletePopup() {
		$('#deletePopup').modal('hide');
	}

	function attachToYesDelete(newFunction) {
		$('#yes_delete').unbind('click');
		$('#yes_delete').click(newFunction);
	}

	function showDeletePopup() {
		$('#deletePopup').modal('show');
	}
	
	
	$('#no_activate').live('click',function() {
		hideActivatePopup();
	});
	
	
	function hideActivatePopup() {
		$('#activatePopup').modal('hide');
	}
	
	function attachToYesActivate(newFunction) {
		$('#yes_activate').unbind('click');
		$('#yes_activate').click(newFunction);
	}
	
	function showActivatePopup() {
		$('#activatePopup').modal('show');
	}
	
	$('.del_btn').live('click',function() {
		var ele = $(this);
		var data = {
		'qid' : $(ele).attr("name").trim()
			};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('election/question/remove', data, function(res) {
						
						if (res.indexOf("FAILEDCONTEST") === -1) {
							$('.ms-spinner').hide();
							$('#tab_contest').html(res);
							$('#result_question_add').removeClass("msg-failure").addClass("msg-success").text(
									"Question deactivated successfully.");
							window.location.replace("election/poll.html");
						} else {
							$('.ms-spinner').hide();
							$('#result_question_add').removeClass("msg-success").addClass("msg-failure").text(
									"Question deactivation failed.");
						}
					});
				});
			});
	
	
	$('.activate_btn').live('click',function() {
		var ele = $(this);
		var data = {
		'qid' : $(ele).attr("name").trim()
			};
				showActivatePopup();
				attachToYesActivate(function() {
					hideActivatePopup();
					$('.ms-spinner').show();
					$.post('election/question/activate', data, function(res) {
						
						if (res.indexOf("FAILEDCONTEST") === -1) {
							$('.ms-spinner').hide();
							$('#tab_contest').html(res);
							$('#result_question_add').removeClass("msg-failure").addClass("msg-success").text(
									"Question activated successfully.");
							window.location.replace("election/poll.html");
						} else {
							$('.ms-spinner').hide();
							$('#result_question_add').removeClass("msg-success").addClass("msg-failure").text(
									"Question activation failed.");
						}
					});
				});
			});

	$('.save_question_btn').live('click', function(event) {
		var order = $(this).attr('id').split('_')[2];
		var result = $('#edit_ques_form_'+order).parsley('validate');
		if (result) {
			var data = {
					'id' : $('#questionId_'+order).val().trim(),
					'question' : $('#question_' + order).val().trim(),
					'order' : parseInt($('#order_' + order).val().trim(),10),
					'midOrig' : $('#midOrig').val(),
					'rightAnswer' : parseInt($('input[name=answer_' + order + ']:checked').val(),10)
				};
				var options_length = parseInt($('#options_length_'+order).val().trim(),10);
				data['options'] = new Array();
				for ( var i = 0; i < options_length; i++) {
					data['options'][i] = $('#options_' +order + '_'+i).val();
				}
				$('.ms-spinner').show();
				$.post('election/question/'+order, data, function(res) {
					$('#ajaxSaveBusy').modal('hide');
					if (res.indexOf("FAILEDCONTEST") === -1) {
						$('.ms-spinner').hide();
						$('#tab_contest').html(res);
						$('#result_question_add').removeClass("msg-failure").addClass("msg-success").text("Question saved successfully.");
					} else {
						$('.ms-spinner').hide();
						$('#result_question_add').removeClass("msg-success").addClass("msg-failure").text("Failure in saving question.");
					}
				});
		} else {
			$('#result_question_add').text("Validation failed.");
		}

	});


	$('#contest_basic_info').live(
			'submit',
			function(event) {
				event.preventDefault();
				var result = $('#contest_basic_info').parsley('validate');
				alert('in form basic1');
				if(result) {
					alert('in form basic2');
//					var data = {
//							'name' : $('#name').val().trim(),
//							'category' : $('#category').val().trim(),
//						
//						};
					alert('in form basic3');
					//$('.ms-spinner').show(); 
						alert('in form spinner');
						
						$.post('election/contest/basic/', '', function(res) {
							alert("res: "+JSON.stringify(res));
							if (res.indexOf("FAILEDCONTEST") === -1) {
								alert('in loop');
								$('.ms-spinner').hide();
								$('#tab_contest').html(res);
								$('#result_contest_info').removeClass("msg-failure").addClass("msg-success").text(
										'Contest information updated successfully.');
							} else {
								alert('in else part');
								$('.ms-spinner').hide();
								$('#result_contest_info').removeClass("msg-success").addClass("msg-failure").text(
										'Failed to udpate contest information.');
							}
						});
				} else {
					$('#result_contest_info').removeClass("msg-success").addClass("msg-failure").text(
					'Data validation failed.');
				}

			});


	// ============================Module Sequence=============================//

	$('#modseq_form').live(
			'submit',
			function(event) {
				event.preventDefault();
				var result = $('#modseq_form').parsley('validate');
				if(result) {
					var data = {
							'order' : parseInt($('#modseq_order').val().trim(),10),
							'module' : $('#modseq_module').val().trim(),
							'siteId': $('#site1').val()
						};
						$('.ms-spinner').show();
						$.post('election/modseq/add', data, function(res) {
							if (res.indexOf("FAILEDMODULESEQUENCE") === -1) {
								$('.ms-spinner').hide();
								$( "body" ).html(res );
								$('#result_modseq_add').removeClass("msg-failure").addClass("msg-success").text(
										'Module added successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_modseq_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of module failed.');
							}
						});
				} else {
					$('#result_modseq_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validation failed.');
				}
			});

	$('.edit_modseq_btn').live('click', function(event) {
		event.preventDefault();
		var order = $(this).attr('id').split('_')[2];
		$('#order_modseq_' + order).attr("disabled", false);
		$(this).attr("disabled", true);
		$('#save_modseq_' + order).attr("disabled", false);
		$('#reset_modseq_' + order).attr("disabled", false);
	});

	$('.save_modseq_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var result = $('#form_modseq_' + order).parsley('validate');
				if(result) {
					var data = {
							'origOrder' : parseInt(order,10),
							'order' : parseInt($('#order_modseq_' + order).val().trim(), 10),
							'module' : $('#module_modseq_' + order).val().trim(),
							'siteId': $('#site').val()
						};
						$('.ms-spinner').show();
						$.post('election/modseq/edit', data, function(res) {
							if (res.indexOf("FAILEDMODULESEQUENCE") === -1) {
								$('.ms-spinner').hide();
								window.location.replace("election/modseq.html");
								$('#result_modseq_add').removeClass("msg-failure").addClass("msg-success").text(
										'Module saved successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_modseq_add').removeClass("msg-success").addClass("msg-failure").text(
										'Saving of module failed.');
							}
						});
				} else {
					$('#result_modseq_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validations failed.');
				}
				
			});

	$('.delete_modseq_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var data = {
					'order' : parseInt(order, 10),
					'siteId': $('#site').val()
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('election/modseq/delete', data, function(res) {
						if (res.indexOf("FAILEDMODULESEQUENCE") === -1) {
							$('.ms-spinner').hide();
							$( "body" ).html(res );
							$('#result_modseq_add').removeClass("msg-failure").addClass("msg-success").text(
									'Module deleted successfully.');
						} else{
							$('.ms-spinner').hide();
							$('#result_modseq_add').removeClass("msg-success").addClass("msg-failure").text(
									'Deletion of module failed.');
						}
					});
				});								
			});
	
	
	$('#no_delete').live('click',function() {
		hideDeletePopup();
	});
	
	function hideDeletePopup() {
		$('#deletePopup').modal('hide');
	}

	function attachToYesDelete(newFunction) {
		$('#yes_delete').unbind('click');
		$('#yes_delete').click(newFunction);
	}
	

	function showDeletePopup() {
		$('#deletePopup').modal('show');
	}
	
	
});
