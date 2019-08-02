$(function() {

	
	
	$( ".top-movie-button" ).click(function() {
		$('.ms-spinner').show();
	});
	
	
	// ============================Basic info=============================//
	
	
	$('#basic_info').live('submit', function(event) {
		event.preventDefault();
		var result = $('#basic_info').parsley('validate');
		var newCircle = false;
		if($('#cidOrig').val() === null || $('#cidOrig').val().trim() === '') {
			newCircle = true;
		}
		if(result) {
			var data = {
					'title' : $('#title').val(),
					'cId' : $('#cId').val().trim(),
					'cIdOrig' : $('#cidOrig').val().trim()
				};
			var midValid = true;
			$('.ms-spinner').show();
			if(newCircle) {
				var cidData={
						'cId' : $('#cId').val().trim()
				}
				$.get('microsites/moviedest/check/cId', cidData, function(response) {
					if(response.indexOf("FAILEDCID") !== -1) {
						$('.ms-spinner').hide();
						$('#result_basic_info').text('cId already exists!');
					} else {
						$('.ms-spinner').show();
						$.post('microsites/moviedest/basic/save', data, function(res) {
							if (res != null) {
								if(newCircle) {
									$('.ms-spinner').hide();
									var path= 'microsites/moviedest/edit/' + $('#cId').val().trim(); 
									window.location.href=path;
								} else {
									$('.ms-spinner').hide();
									$('#tab_info').html(res);
									$('#cidOrig').val($('#cId').val());
									$('#result_basic_info').removeClass("msg-failure").addClass("msg-success").text('Data saved successfully.');
								}
							} else {
								$('.ms-spinner').hide();
								$('#result_basic_info').removeClass("msg-success").addClass("msg-failure").text('Date saving failed.');
							}
						});
					}
				}) ;
			} else {
				$('.ms-spinner').show();
				$.post('microsites/moviedest/basic/save', data, function(res) {
					if (res != null) {
						if(newCircle) {
							$('.ms-spinner').hide();
							var path= 'microsites/moviedest/edit/' + $('#cId').val().trim(); 
							window.location.href=path;
						} else {
							$('.ms-spinner').hide();
							$('#tab_info').html(res);
							$('#cidOrig').val($('#cId').val());
							$('#result_basic_info').removeClass("msg-failure").addClass("msg-success").text('Data saved successfully.');
						}
					} else {
						$('.ms-spinner').hide();
						$('#result_basic_info').removeClass("msg-success").addClass("msg-failure").text('Date saving failed.');
					}
				});
			}
		} else {
			$('#result_basic_info').removeClass("msg-success").addClass("msg-failure").text('Data validation failed.');
		}
		
	});
	
	
	$('#liveOk').live('click', function(event) {
		event.preventDefault();
		$('.list_movies').click();
	});
	
	$('.pushChanges').live('click', function(event) {
		event.preventDefault();
		var id = $(this).attr("id");
		var cId = id.split('_')[1];
		var data = {"cId":cId};
		$.post('microsites/moviedest/golive', data, function(html) {
			$('#liveMovie').html(html);
			$('#liveMovie').modal('show');
			var errors = $('#liveMovieRes').val().trim();
			if(errors === "") {
				$('#liveMovieRes').val("Circle data is live now.");
			}
			else {
				$('#liveMovieRes').val("Circle data is not valid so it cannot go live. Errors are:  " + errors);
			}
		});
	});
	
	$('.goLive').live('click', function(event) {
		event.preventDefault();
		var id = $(this).attr("id");
		var cId = id.split('_')[1];
		var data = {"cId":cId};
		$.post('microsites/moviedest/golive', data, function(html) {
			$('#liveMovie').html(html);
			$('#liveMovie').modal('show');
			var errors = $('#liveMovieRes').val().trim();
			if(errors === "") {
				$('#liveMovieRes').val("Circle data is live now.");
			}
			else {
				$('#liveMovieRes').val("Cinema data is not valid so it cannot go live. Errors are:  " + errors);
			}
		});
	});
	
	
	// ============================Multiple Headers=============================//

	$('#headers_new_form').live('submit', function(event) {
		event.preventDefault();
		
		var result = $('#headers_new_form').parsley('validate');
		if(result) {
			var keyword = $('#keyword_headers_new').val().trim();
			var data = {
				'cIdOrig': $('#cidOrig').val(),
				'keyword': keyword,
				'smartUrl': $('#smart_headers_new').val().trim(),
				'middleUrl':$('#middle_headers_new').val().trim(),
				'lowaUrl': $('#lowa_headers_new').val().trim(),
				'lowbUrl': $('#lowb_headers_new').val().trim(),
				'url': $('#url_headers_new').val().trim()
			};
			$('.ms-spinner').show();
			$.post('microsites/moviedest/headers/'+keyword, data, function(res) {
				if (res.indexOf("FAILEDHEADERS") === -1) {
					$('.ms-spinner').hide();
					$('#tab_headers').html(res);
					$('#result_headers_add').removeClass("msg-failure").addClass("msg-success").text('Headers added successfully.');
				} else {
					$('.ms-spinner').hide();
					$('#result_headers_new_add').removeClass("msg-success").addClass("msg-failure").text('Addition of headers failed.');
				}
			});
		} else {
			$('#result_headers_new_add').removeClass("msg-success").addClass("msg-failure").text('Validation failed.');
		}
		
	});

	$('.edit_headers_btn').live('click', function(event) {
		event.preventDefault();
		var keyword = $(this).attr('id').split('_')[2];
		$('#imgUrl_smart_' + keyword).attr("disabled", false);
		$('#imgUrl_middle_' + keyword).attr("disabled", false);
		$('#imgUrl_lowa_' + keyword).attr("disabled", false);
		$('#imgUrl_lowb_' + keyword).attr("disabled", false);
		$('#url_' + keyword).attr("disabled", false);
		$(this).attr("disabled", true);
		$('#save_headers_' + keyword).attr("disabled", false);
		$('#reset_headers_' + keyword).attr("disabled", false);
	});

	$('.save_headers_btn').live('click', function(event) {
		event.preventDefault();
		var keyword = $(this).attr('id').split('_')[2];
		var result = $('#header_form_'+keyword).parsley('validate');
		if(result) {
			var data = {
				'cIdOrig': $('#cidOrig').val(),
				'keyword': keyword,
				'smartUrl': $('#imgUrl_smart_'+keyword).val().trim(),
				'middleUrl':$('#imgUrl_middle_'+keyword).val().trim() ,
				'lowaUrl': $('#imgUrl_lowa_'+keyword).val().trim(),
				'lowbUrl': $('#imgUrl_lowb_'+keyword).val().trim(),
				'url': $('#url_'+keyword).val().trim()
			};
			$('.ms-spinner').show();
			$.post('microsites/moviedest/headers/'+keyword, data, function(res) {
				if (res.indexOf("FAILEDHEADERS") === -1) {
					$('.ms-spinner').hide();
					$('#tab_headers').html(res);
					$('#result_headers_add').removeClass("msg-failure").addClass("msg-success").text('Headers added successfully.');
				} else{
					$('.ms-spinner').hide();
					$('#result_headers_new_add').removeClass("msg-success").addClass("msg-failure").text('Addition of headers failed.');
				}
			});
		} else {
			$('#result_headers_new_add').removeClass("msg-success").addClass("msg-failure").text('Validation failed.');
		}
		
	});

	$('.delete_headers_btn').live('click', function(event) {
		var keyword = $(this).attr('id').split('_')[2];
		var data = {
			'cIdOrig' : $('#cidOrig').val(),
			'keyword' : keyword
		};
		showDeletePopup();
		attachToYesDelete(function() {
			hideDeletePopup();
			$('.ms-spinner').show();
			$.post('microsites/moviedest/headers/delete', data, function(res) {
				if (res.indexOf("FAILEDHEADERS") === -1) {
					$('.ms-spinner').hide();
					$('#tab_headers').html(res);
					$('#result_headers_add').removeClass("msg-failure").addClass("msg-success").text('headers link deleted successfully.');
				} else{
					$('.ms-spinner').hide();
					$('#result_headers_add').removeClass("msg-success").addClass("msg-failure").text('Deletion of headers link failed.');
				}
			});
		});
	});
	
	
	
	
	// ============================Search Keywords=============================//

	$('#search_form').live(
			'submit',
			function(event) {
				event.preventDefault();
				var result = $('#search_form').parsley('validate');
				if(result) {
					var data = {
							'order' : parseInt($('#search_order').val().trim(),10),
							'keyword' : $('#search_keyword').val().trim(),
							'cIdOrig' : $('#cidOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/moviedest/search/add', data, function(res) {
							if (res.indexOf("FAILEDKEYWORDS") === -1) {
								$('.ms-spinner').hide();
								$('#tab_search').html(res);
								$('#result_search_add').removeClass("msg-failure").addClass("msg-success").text(
										'search keyword added successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_search_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of search keyword failed.');
							}
						});
				} else {
					$('#result_search_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validation failed.');
				}
			});

	$('.edit_search_btn').live('click', function(event) {
		event.preventDefault();
		var order = $(this).attr('id').split('_')[2];
		$('#order_search_' + order).attr("disabled", false);
		$('#keyword_search_' + order).attr("disabled", false);
		$(this).attr("disabled", true);
		$('#save_search_' + order).attr("disabled", false);
		$('#reset_search_' + order).attr("disabled", false);
	});

	$('.save_search_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var result = $('#form_search_' + order).parsley('validate');
				if(result) {
					var data = {
							'origOrder' : parseInt(order,10),
							'order' : parseInt($('#order_search_' + order).val().trim(), 10),
							'keyword' : $('#keyword_search_' + order).val().trim(),
							'cIdOrig' : $('#cidOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/moviedest/search/edit', data, function(res) {
							if (res.indexOf("FAILEDKEYWORDS") === -1) {
								$('.ms-spinner').hide();
								$('#tab_search').html(res);
								$('#result_search_add').removeClass("msg-failure").addClass("msg-success").text(
										'search keyword saved successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_search_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of search keyword failed.');
							}
						});
				} else {
					$('#result_search_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validations failed.');
				}
				
			});

	$('.delete_search_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var data = {
					'cIdOrig' : $('#cidOrig').val(),
					'order' : parseInt(order, 10)
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('microsites/moviedest/search/delete', data, function(res) {
						if (res.indexOf("FAILEDKEYWORDS") === -1) {
							$('.ms-spinner').hide();
							$('#tab_search').html(res);
							$('#result_search_add').removeClass("msg-failure").addClass("msg-success").text(
									'search keyword deleted successfully.');
						} else{
							$('.ms-spinner').hide();
							$('#result_search_add').removeClass("msg-success").addClass("msg-failure").text(
									'Deletion of search keyword failed.');
						}
					});
				});
			});
	
	
	//-------------------------------Qrious Content----------------------------------------//

	$('#qrious_form').live(
			'submit',
			function(event) {
				event.preventDefault();
				var result = $('#qrious_form').parsley('validate');
				if(result) {
					var data = {
							'order' : parseInt($('#qrious_order').val().trim(), 10),
							'content' : $('#qrious_content').val().trim(),
							'link' : $('#qrious_link').val().trim(),
							'cIdOrig' : $('#cidOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/moviedest/qrious/add', data, function(res) {
							if (res.indexOf("FAILEDQRIOUSCONTENT") === -1) {
								$('.ms-spinner').hide();
								$('#tab_qrious').html(res);
								$('#result_qrious_add').removeClass("msg-failure").addClass("msg-success").text(
										'Qrious content added successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_qrious_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of Qrious content failed.');
							}
						});
				} else {
					$('#result_qrious_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validation failed.');
				}
			});

	$('.edit_qrious_btn').live('click', function(event) {
		event.preventDefault();
		var order = $(this).attr('id').split('_')[2];
		$('#order_qrious_' + order).attr("disabled", false);
		$('#content_qrious_' + order).attr("disabled", false);
		$('#link_qrious_' + order).attr("disabled", false);
		$(this).attr("disabled", true);
		$('#save_qrious_' + order).attr("disabled", false);
		$('#reset_qrious_' + order).attr("disabled", false);
	});

	$('.save_qrious_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var result = $('#form_qrious_' + order).parsley('validate');
				if(result) {
					var data = {
							'origOrder' : parseInt(order, 10),
							'order' : parseInt($('#order_qrious_' + order).val().trim(), 10),
							'content' : $('#content_qrious_' + order).val(),
							'link' : $('#link_qrious_' + order).val().trim(),
							'cIdOrig' : $('#cidOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/moviedest/qrious/edit', data, function(res) {
							if (res.indexOf("FAILEDQRIOUSCONTENT") === -1) {
								$('.ms-spinner').hide();
								$('#tab_qrious').html(res);
								$('#result_qrious_add').removeClass("msg-failure").addClass("msg-success").text(
										'Qrious content saved successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_qrious_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of Qrious content failed.');
							}
						});
				} else {
					$('#result_qrious_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validations failed.');
				}
				
			});

	$('.delete_qrious_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var data = {
					'cIdOrig' : $('#cidOrig').val(),
					'order' : parseInt(order, 10)
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('microsites/moviedest/qrious/delete', data, function(res) {
						if (res.indexOf("FAILEDQRIOUSCONTENT") === -1) {
							$('.ms-spinner').hide();
							$('#tab_qrious').html(res);
							$('#result_qrious_add').removeClass("msg-failure").addClass("msg-success").text(
									'Qrious content deleted successfully.');
						} else{
							$('.ms-spinner').hide();
							$('#result_qrious_add').removeClass("msg-success").addClass("msg-failure").text(
									'Deletion of Qrious content failed.');
						}
					});
				});
			});
	
	
	
	//--------------------VAS Package-----------------------------//

	$('#vas_form').live(
			'submit',
			function(event) {
				event.preventDefault();
				var result = $('#vas_form').parsley('validate');
				if(result) {
					var data = {
							'category': $('#vas_category').val().trim(),
							'title' : $('#vas_title').val().trim(),
							'packageId' : $('#vas_packageid').val().trim(),
							'cIdOrig' : $('#cidOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/moviedest/vas/add', data, function(res) {
							if (res.indexOf("FAILEDVASPACKAGEIDS") === -1) {
								$('.ms-spinner').hide();
								$('#tab_vas').html(res);
								$('#result_vas_add').removeClass("msg-failure").addClass("msg-success").text(
										'VAS Package added successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_vas_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of VAS Package failed.');
							}
						});
				} else {
					$('#result_vas_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validation failed.');
				}
			});

	$('.edit_vas_btn').live('click', function(event) {
		event.preventDefault();
		var category = $(this).attr('id').split('_')[2];
		var title = $(this).attr('id').split('_')[3];
		$('#title_vas_' + category + '_' + title).attr("disabled", false);
		$('#category_vas_' + category + '_' + title).attr("disabled", false);
		$('#packageid_vas_' + category + '_' + title).attr("disabled", false);
		$(this).attr("disabled", true);
		$('#save_vas_' + category + '_' + title).attr("disabled", false);
		$('#reset_vas_'  + category + '_' + title).attr("disabled", false);
	});

	$('.save_vas_btn').live(
			'click',
			function(event) {
				var title = $(this).attr('id').split('_')[3];
				var category = $(this).attr('id').split('_')[2];
				var result = $('#form_vas_' + category+'_'+title).parsley('validate');
				if(result) {
					var data = {
							'category' : $('#category_vas_'+category+'_'+title).val().trim(),
							'title' : $('#title_vas_' + category+'_'+title).val().trim(),
							'origCat': category,
							'packageId' : parseInt($('#packageid_vas_' +category+'_'+ title).val().trim(),10),
							'origTitle' : title.replace('-', ' '),
							'cIdOrig' : $('#cidOrig').val()
					};
					$('.ms-spinner').show();
					$.post('microsites/moviedest/vas/edit', data, function(res) {
						if (res.indexOf("FAILEDVASPACKAGEIDS") === -1) {
							$('.ms-spinner').hide();
							$('#tab_vas').html(res);
							$('#result_vas_add').removeClass("msg-failure").addClass("msg-success").text(
							'VAS Package saved successfully.');
						} else{
							$('.ms-spinner').hide();
							$('#result_vas_add').removeClass("msg-success").addClass("msg-failure").text(
							'Addition of VAS Package failed.');
						}
					});
				} else {
					$('#result_vas_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validations failed.');
				}

			});

	$('.delete_vas_btn').live(
			'click',
			function(event) {
				var title = $(this).attr('id').split('_')[3];
				var category = $(this).attr('id').split('_')[2];
				var data = {
					'category' : category.replace('$', ' '),
					'cIdOrig' : $('#cidOrig').val(),
					'title' : $('#title_vas_' +category+'_'+ title).val().trim()
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('microsites/moviedest/vas/delete', data, function(res) {
						if (res.indexOf("FAILEDVASPACKAGEIDS") === -1) {
							$('.ms-spinner').hide();
							$('#tab_vas').html(res);
							$('#result_vas_add').removeClass("msg-failure").addClass("msg-success").text(
									'VAS Package deleted successfully.');
						} else{
							$('.ms-spinner').hide();
							$('#result_vas_add').removeClass("msg-success").addClass("msg-failure").text(
									'Deletion of VAS Package failed.');
						}
					});
				});
			});
	
	
	
	
	
	//--------------------------------Other URLs----------------------------------//


	$('#other_form').live(
			'submit',
			function(event) {
				event.preventDefault();
				var result = $('#other_form').parsley('validate');
				if(result) {
					var data = {
							'order' : parseInt($('#other_order').val().trim(),10),
							'title' : $('#other_title').val().trim(),
							'link' : $('#other_link').val().trim(),
							'cIdOrig' : $('#cidOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/moviedest/other/add', data, function(res) {
							if (res.indexOf("FAILEDOTHERURLS") === -1) {
								$('.ms-spinner').hide();
								$('#tab_other').html(res);
								$('#result_other_add').removeClass("msg-failure").addClass("msg-success").text(
										'Other URL added successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_other_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of other URL failed.');
							}
						});
				} else {
					$('#result_other_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validation failed.');
				}
			});

	$('.edit_other_btn').live('click', function(event) {
		event.preventDefault();
		var order = $(this).attr('id').split('_')[2];
		$('#order_other_' + order).attr("disabled", false);
		$('#title_other_' + order).attr("disabled", false);
		$('#link_other_' + order).attr("disabled", false);
		$(this).attr("disabled", true);
		$('#save_other_' + order).attr("disabled", false);
		$('#reset_other_' + order).attr("disabled", false);
	});

	$('.save_other_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var result = $('#form_other_' + order).parsley('validate');
				if(result) {
					var data = {
							'origOrder' : parseInt(order,10),
							'order' : parseInt($('#order_other_' + order).val(),10),
							'title' : $('#title_other_' + order).val(),
							'link' : $('#link_other_' + order).val().trim(),
							'cIdOrig' : $('#cidOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/moviedest/other/edit', data, function(res) {
							if (res.indexOf("FAILEDOTHERURLS") === -1) {
								$('.ms-spinner').hide();
								$('#tab_other').html(res);
								$('#result_other_add').removeClass("msg-failure").addClass("msg-success").text(
										'other URL saved successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_link_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of other URL failed.');
							}
						});
				} else {
					$('#result_other_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validations failed.');
				}
				
			});

	$('.delete_other_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var data = {
					'cIdOrig' : $('#cidOrig').val(),
					'order' : parseInt(order,10)
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('microsites/moviedest/other/delete', data, function(res) {
						if (res.indexOf("FAILEDOTHERURLS") === -1) {
							$('.ms-spinner').hide();
							$('#tab_other').html(res);
							$('#result_other_add').removeClass("msg-failure").addClass("msg-success").text(
									'Other URL deleted successfully.');
						} else{
							$('.ms-spinner').hide();
							$('#result_other_add').removeClass("msg-success").addClass("msg-failure").text(
									'Deletion of other URL failed.');
						}
					});
				});
			});
	
	
	
	//--------------------------------Photos----------------------------------//


	$('#photo_form').live(
			'submit',
			function(event) {
				event.preventDefault();
				var result = $('#photo_form').parsley('validate');
				if(result) {
					var data = {
							'order' : parseInt($('#photo_order').val().trim(),10),
							'title' : $('#photo_title').val().trim(),
							'link' : $('#photo_link').val().trim(),
							'description' : $('#photo_desc').val().trim(),
							'thumbnail' : $('#photo_thumbnail').val().trim(),
							'rank' : parseInt($('#photo_rank').val().trim(),10),
							'cIdOrig' : $('#cidOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/moviedest/photo/add', data, function(res) {
							if (res.indexOf("FAILEDPHOTOS") === -1) {
								$('.ms-spinner').hide();
								$('#tab_photo').html(res);
								$('#result_photo_add').removeClass("msg-failure").addClass("msg-success").text(
										'Photo added successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_photo_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of Photo failed.');
							}
						});
				} else {
					$('#result_photo_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validation failed.');
				}
			});

	$('.edit_photo_btn').live('click', function(event) {
		event.preventDefault();
		var order = $(this).attr('id').split('_')[2];
		$('#order_photo_' + order).attr("disabled", false);
		$('#title_photo_' + order).attr("disabled", false);
		$('#link_photo_' + order).attr("disabled", false);
		$('#desc_photo_' + order).attr("disabled", false);
		$('#thumbnail_photo_' + order).attr("disabled", false);
		$('#rank_photo_' + order).attr("disabled", false);
		$(this).attr("disabled", true);
		$('#save_photo_' + order).attr("disabled", false);
		$('#reset_photo_' + order).attr("disabled", false);
	});

	$('.save_photo_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var result = $('#form_photo_' + order).parsley('validate');
				if(result) {
					var data = {
							'origOrder' : parseInt(order,10),
							'order' : parseInt($('#order_photo_' + order).val(),10),
							'title' : $('#title_photo_' + order).val(),
							'link' : $('#link_photo_' + order).val().trim(),
							'description' : $('#desc_photo_' + order).val().trim(),
							'thumbnail' : $('#thumbnail_photo_' + order).val().trim(),
							'rank' : parseInt($('#rank_photo_' + order).val().trim(),10),
							'cIdOrig' : $('#cidOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/moviedest/photo/edit', data, function(res) {
							if (res.indexOf("FAILEDPHOTOS") === -1) {
								$('.ms-spinner').hide();
								$('#tab_photo').html(res);
								$('#result_photo_add').removeClass("msg-failure").addClass("msg-success").text(
										'Photo saved successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_photo_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of Photo failed.');
							}
						});
				} else {
					$('#result_photo_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validations failed.');
				}
				
			});

	$('.delete_photo_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var data = {
					'cIdOrig' : $('#cidOrig').val(),
					'order' : parseInt(order,10)
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('microsites/moviedest/photo/delete', data, function(res) {
						if (res.indexOf("FAILEDPHOTOS") === -1) {
							$('.ms-spinner').hide();
							$('#tab_photo').html(res);
							$('#result_photo_add').removeClass("msg-failure").addClass("msg-success").text(
									'Photos deleted successfully.');
						} else{
							$('.ms-spinner').hide();
							$('#result_photo_add').removeClass("msg-success").addClass("msg-failure").text(
									'Deletion of photos failed.');
						}
					});
				});
			});	
	
	

	//--------------------------------Video----------------------------------//


	$('#video_form').live(
			'submit',
			function(event) {
				event.preventDefault();
				var result = $('#video_form').parsley('validate');
				if(result) {
					var data = {
							'order' : parseInt($('#video_order').val().trim(),10),
							'title' : $('#video_title').val().trim(),
							'link' : $('#video_link').val().trim(),
							'description' : $('#video_desc').val().trim(),
							'thumbnail' : $('#video_thumbnail').val().trim(),
							'cIdOrig' : $('#cidOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/moviedest/video/add', data, function(res) {
							if (res.indexOf("FAILEDVIDEOS") === -1) {
								$('.ms-spinner').hide();
								$('#tab_video').html(res);
								$('#result_video_add').removeClass("msg-failure").addClass("msg-success").text(
										'Video added successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_video_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of Video failed.');
							}
						});
				} else {
					$('#result_video_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validation failed.');
				}
			});

	$('.edit_video_btn').live('click', function(event) {
		event.preventDefault();
		var order = $(this).attr('id').split('_')[2];
		$('#order_video_' + order).attr("disabled", false);
		$('#title_video_' + order).attr("disabled", false);
		$('#link_video_' + order).attr("disabled", false);
		$('#desc_video_' + order).attr("disabled", false);
		$('#thumbnail_video_' + order).attr("disabled", false);
		$(this).attr("disabled", true);
		$('#save_video_' + order).attr("disabled", false);
		$('#reset_video_' + order).attr("disabled", false);
	});

	$('.save_video_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var result = $('#form_video_' + order).parsley('validate');
				if(result) {
					var data = {
							'origOrder' : parseInt(order,10),
							'order' : parseInt($('#order_video_' + order).val(),10),
							'title' : $('#title_video_' + order).val(),
							'link' : $('#link_video_' + order).val().trim(),
							'description' : $('#desc_video_' + order).val().trim(),
							'thumbnail' : $('#thumbnail_video_' + order).val().trim(),
							'cIdOrig' : $('#cidOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/moviedest/video/edit', data, function(res) {
							if (res.indexOf("FAILEDVIDEOS") === -1) {
								$('.ms-spinner').hide();
								$('#tab_video').html(res);
								$('#result_video_add').removeClass("msg-failure").addClass("msg-success").text(
										'Video saved successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_video_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of Video failed.');
							}
						});
				} else {
					$('#result_video_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validations failed.');
				}
				
			});

	$('.delete_video_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var data = {
					'cIdOrig' : $('#cidOrig').val(),
					'order' : parseInt(order,10)
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('microsites/moviedest/video/delete', data, function(res) {
						if (res.indexOf("FAILEDVIDEOS") === -1) {
							$('.ms-spinner').hide();
							$('#tab_video').html(res);
							$('#result_video_add').removeClass("msg-failure").addClass("msg-success").text(
									'Video deleted successfully.');
						} else{
							$('.ms-spinner').hide();
							$('#result_video_add').removeClass("msg-success").addClass("msg-failure").text(
									'Deletion of video failed.');
						}
					});
				});
			});
	
	
	
	//--------------------------------Trivia----------------------------------//


	$('#trivia_form').live(
			'submit',
			function(event) {
				event.preventDefault();
				var result = $('#trivia_form').parsley('validate');
				if(result) {
					var data = {
							'order' : parseInt($('#trivia_order').val().trim(),10),
							'title' : $('#trivia_title').val().trim(),
							'link' : $('#trivia_link').val().trim(),
							'description' : $('#trivia_desc').val().trim(),
							'thumbnail' : $('#trivia_thumbnail').val().trim(),
							'cIdOrig' : $('#cidOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/moviedest/trivia/add', data, function(res) {
							if (res.indexOf("FAILEDTRIVIA") === -1) {
								$('.ms-spinner').hide();
								$('#tab_trivia').html(res);
								$('#result_trivia_add').removeClass("msg-failure").addClass("msg-success").text(
										'Trivia added successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_trivia_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of Trivia failed.');
							}
						});
				} else {
					$('#result_trivia_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validation failed.');
				}
			});

	$('.edit_trivia_btn').live('click', function(event) {
		event.preventDefault();
		var order = $(this).attr('id').split('_')[2];
		$('#order_trivia_' + order).attr("disabled", false);
		$('#title_trivia_' + order).attr("disabled", false);
		$('#link_trivia_' + order).attr("disabled", false);
		$('#desc_trivia_' + order).attr("disabled", false);
		$('#thumbnail_trivia_' + order).attr("disabled", false);
		$(this).attr("disabled", true);
		$('#save_trivia_' + order).attr("disabled", false);
		$('#reset_trivia_' + order).attr("disabled", false);
	});

	$('.save_trivia_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var result = $('#form_trivia_' + order).parsley('validate');
				if(result) {
					var data = {
							'origOrder' : parseInt(order,10),
							'order' : parseInt($('#order_trivia_' + order).val(),10),
							'title' : $('#title_trivia_' + order).val(),
							'link' : $('#link_trivia_' + order).val().trim(),
							'description' : $('#desc_trivia_' + order).val().trim(),
							'thumbnail' : $('#thumbnail_trivia_' + order).val().trim(),
							'cIdOrig' : $('#cidOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/moviedest/trivia/edit', data, function(res) {
							if (res.indexOf("FAILEDTRIVIA") === -1) {
								$('.ms-spinner').hide();
								$('#tab_trivia').html(res);
								$('#result_trivia_add').removeClass("msg-failure").addClass("msg-success").text(
										'Trivia saved successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_trivia_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of Trivia failed.');
							}
						});
				} else {
					$('#result_trivia_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validations failed.');
				}
				
			});

	$('.delete_trivia_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var data = {
					'cIdOrig' : $('#cidOrig').val(),
					'order' : parseInt(order,10)
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('microsites/moviedest/trivia/delete', data, function(res) {
						if (res.indexOf("FAILEDTRIVIA") === -1) {
							$('.ms-spinner').hide();
							$('#tab_trivia').html(res);
							$('#result_trivia_add').removeClass("msg-failure").addClass("msg-success").text(
									'Trivia deleted successfully.');
						} else{
							$('.ms-spinner').hide();
							$('#result_trivia_add').removeClass("msg-success").addClass("msg-failure").text(
									'Deletion of Trivia failed.');
						}
					});
				});
			});
	


	

	
	
	
	
	//--------------------------------News----------------------------------//


	$('#news_form').live(
			'submit',
			function(event) {
				event.preventDefault();
				var result = $('#news_form').parsley('validate');
				if(result) {
					var data = {
							'order' : parseInt($('#news_order').val().trim(),10),
							'title' : $('#news_title').val().trim(),
							'link' : $('#news_link').val().trim(),
							'description' : $('#news_desc').val().trim(),
							'thumbnail' : $('#news_thumbnail').val().trim(),
							'source' : $('#news_source').val().trim(),
							'time' : $('#news_time').val().trim(),
							'cIdOrig' : $('#cidOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/moviedest/news/add', data, function(res) {
							if (res.indexOf("FAILEDNEWS") === -1) {
								$('.ms-spinner').hide();
								$('#tab_news').html(res);
								$('#result_news_add').removeClass("msg-failure").addClass("msg-success").text(
										'News added successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_news_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of News failed.');
							}
						});
				} else {
					$('#result_news_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validation failed.');
				}
			});

	$('.edit_news_btn').live('click', function(event) {
		event.preventDefault();
		var order = $(this).attr('id').split('_')[2];
		$('#order_news_' + order).attr("disabled", false);
		$('#title_news_' + order).attr("disabled", false);
		$('#link_news_' + order).attr("disabled", false);
		$('#desc_news_' + order).attr("disabled", false);
		$('#thumbnail_news_' + order).attr("disabled", false);
		$('#source_news_' + order).attr("disabled", false);
		$('#time_news_' + order).attr("disabled", false);
		$(this).attr("disabled", true);
		$('#save_news_' + order).attr("disabled", false);
		$('#reset_news_' + order).attr("disabled", false);
	});

	$('.save_news_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var result = $('#form_news_' + order).parsley('validate');
				if(result) {
					var data = {
							'origOrder' : parseInt(order,10),
							'order' : parseInt($('#order_news_' + order).val(),10),
							'title' : $('#title_news_' + order).val(),
							'link' : $('#link_news_' + order).val().trim(),
							'description' : $('#desc_news_' + order).val().trim(),
							'thumbnail' : $('#thumbnail_news_' + order).val().trim(),
							'source' : $('#source_news_' + order).val().trim(),
							'time' : $('#time_news_' + order).val().trim(),
							'cIdOrig' : $('#cidOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/moviedest/news/edit', data, function(res) {
							if (res.indexOf("FAILEDNEWS") === -1) {
								$('.ms-spinner').hide();
								$('#tab_news').html(res);
								$('#result_news_add').removeClass("msg-failure").addClass("msg-success").text(
										'News saved successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_news_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of News failed.');
							}
						});
				} else {
					$('#result_news_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validations failed.');
				}
				
			});

	$('.delete_news_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var data = {
					'cIdOrig' : $('#cidOrig').val(),
					'order' : parseInt(order,10)
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('microsites/moviedest/news/delete', data, function(res) {
						if (res.indexOf("FAILEDNEWS") === -1) {
							$('.ms-spinner').hide();
							$('#tab_news').html(res);
							$('#result_news_add').removeClass("msg-failure").addClass("msg-success").text(
									'News deleted successfully.');
						} else{
							$('.ms-spinner').hide();
							$('#result_news_add').removeClass("msg-success").addClass("msg-failure").text(
									'Deletion of News failed.');
						}
					});
				});
			});
	
	
	
	
	//--------------------------------Reviews----------------------------------//


	$('#reviews_form').live(
			'submit',
			function(event) {
				event.preventDefault();
				var result = $('#reviews_form').parsley('validate');
				if(result) {
					var data = {
							'order' : parseInt($('#reviews_order').val().trim(),10),
							'title' : $('#reviews_title').val().trim(),
							'link' : $('#reviews_link').val().trim(),
							'description' : $('#reviews_desc').val().trim(),
							'rating' : $('#reviews_rating').val().trim(),
							'thumbnail' : $('#reviews_thumbnail').val().trim(),
							'cIdOrig' : $('#cidOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/moviedest/reviews/add', data, function(res) {
							if (res.indexOf("FAILEDREVIEWS") === -1) {
								$('.ms-spinner').hide();
								$('#tab_reviews').html(res);
								$('#result_reviews_add').removeClass("msg-failure").addClass("msg-success").text(
										'Reviews added successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_reviews_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of Reviews failed.');
							}
						});
				} else {
					$('#result_reviews_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validation failed.');
				}
			});

	$('.edit_reviews_btn').live('click', function(event) {
		event.preventDefault();
		var order = $(this).attr('id').split('_')[2];
		$('#order_reviews_' + order).attr("disabled", false);
		$('#title_reviews_' + order).attr("disabled", false);
		$('#link_reviews_' + order).attr("disabled", false);
		$('#desc_reviews_' + order).attr("disabled", false);
		$('#rating_reviews_' + order).attr("disabled", false);
		$('#thumbnail_reviews_' + order).attr("disabled", false);
		$(this).attr("disabled", true);
		$('#save_reviews_' + order).attr("disabled", false);
		$('#reset_reviews_' + order).attr("disabled", false);
	});

	$('.save_reviews_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var result = $('#form_reviews_' + order).parsley('validate');
				if(result) {
					var data = {
							'origOrder' : parseInt(order,10),
							'order' : parseInt($('#order_reviews_' + order).val(),10),
							'title' : $('#title_reviews_' + order).val(),
							'link' : $('#link_reviews_' + order).val().trim(),
							'description' : $('#desc_reviews_' + order).val().trim(),
							'rating' : $('#rating_reviews_' + order).val().trim(),
							'thumbnail' : $('#thumbnail_reviews_' + order).val().trim(),
							'cIdOrig' : $('#cidOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/moviedest/reviews/edit', data, function(res) {
							if (res.indexOf("FAILEDREVIEWS") === -1) {
								$('.ms-spinner').hide();
								$('#tab_reviews').html(res);
								$('#result_reviews_add').removeClass("msg-failure").addClass("msg-success").text(
										'Reviews saved successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_reviews_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of Reviews failed.');
							}
						});
				} else {
					$('#result_reviews_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validations failed.');
				}
				
			});

	$('.delete_reviews_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var data = {
					'cIdOrig' : $('#cidOrig').val(),
					'order' : parseInt(order,10)
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('microsites/moviedest/reviews/delete', data, function(res) {
						if (res.indexOf("FAILEDREVIEWS") === -1) {
							$('.ms-spinner').hide();
							$('#tab_reviews').html(res);
							$('#result_reviews_add').removeClass("msg-failure").addClass("msg-success").text(
									'Reviews deleted successfully.');
						} else{
							$('.ms-spinner').hide();
							$('#result_reviews_add').removeClass("msg-success").addClass("msg-failure").text(
									'Deletion of Reviews failed.');
						}
					});
				});
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
							'cIdOrig' : $('#cidOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/moviedest/modseq/add', data, function(res) {
							if (res.indexOf("FAILEDMODULESEQUENCE") === -1) {
								$('.ms-spinner').hide();
								$('#tab_modseq').html(res);
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
							'cIdOrig' : $('#cidOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/moviedest/modseq/edit', data, function(res) {
							if (res.indexOf("FAILEDMODULESEQUENCE") === -1) {
								$('.ms-spinner').hide();
								$('#tab_modseq').html(res);
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
					'cIdOrig' : $('#cidOrig').val(),
					'order' : parseInt(order, 10)
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('microsites/moviedest/modseq/delete', data, function(res) {
						if (res.indexOf("FAILEDMODULESEQUENCE") === -1) {
							$('.ms-spinner').hide();
							$('#tab_modseq').html(res);
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
