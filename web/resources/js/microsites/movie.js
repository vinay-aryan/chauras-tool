//$(document).ajaxStart(function() {
//	$('#ajaxSaveBusy').modal('show');
//}).ajaxStop(function() {
//	$('#ajaxSaveBusy').modal('toggle');
//});

$(function() {
//	$('#ajaxSaveBusy').modal({
//		modal : true,
//		keyboard : false
//	}).css({
//		background : 'static',
//		width : 'auto',
//		'margin-left' : function() {
//			return -($(this).width() / 2);
//		}
//	}).modal('hide');

	// ============================Basic info=============================//

        

//    jQuery("#date_time_picker").datetimepicker({    
//    	pickTime: false,
//    	format: 'dd/MM/yyyy',
//    });
    
	$( ".top-movie-button" ).click(function() {
			$('.ms-spinner').show();
		});
	
    $("#basic_info :input").tooltip({
        position: "center right",
        offset: [-2, 10],
        effect: "fade",
        opacity: 0.7
   
        });
    
    $('#basic_info').live('submit', function(event) {
		event.preventDefault();
		var result = $('#basic_info').parsley('validate');
		var newMovie = false;
		if($('#midOrig').val() === null || $('#midOrig').val().trim() === '') {
			newMovie = true;
		}
		if(result) {
			var data = {
					'isFeaturefilm' : $('#isFeaturefilm').val(),
					'title' : $('#title').val(),
					'mid' : $('#mid').val().trim(),
					'midOrig' : $('#midOrig').val(),
					'synopsis' : $('#synopsis').val().trim(),
					'language' : $('#language').val().trim(),
					'newsKeyword' : $('#newsKeyword').val().trim(),
					'photoKeyword' : $('#photoKeyword').val().trim(),
					'videoKeyword' : $('#videoKeyword').val().trim(),
					'releaseDate' : $('#release_date').val(),
					'qriousSectionTitle' : $('#qriousTitle').val().trim(),
					'contestEnabled' : $('#contestEnabled').val()
				};
			var midValid = true;
			$('.ms-spinner').show();
			if(newMovie) {
				var midData={
						'mid' : $('#mid').val().trim()
				}
				$.get('microsites/check/mid', midData, function(response) {
					if(response.indexOf("FAILEDMID") !== -1) {
						$('.ms-spinner').hide();
						$('#result_basic_info').text('Mid already exists!');
					} else {
						$('.ms-spinner').show();
						$.post('microsites/basic/save', data, function(res) {
							if (res != null) {
								if(newMovie) {
									$('.ms-spinner').hide();
									var path= 'microsites/edit/' + $('#mid').val().trim(); 
									window.location.href=path;
								} else {
									$('.ms-spinner').hide();
									$('#tab_info').html(res);
									$('#midOrig').val($('#mid').val());
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
				$.post('microsites/basic/save', data, function(res) {
					if (res != null) {
						if(newMovie) {
							$('.ms-spinner').hide();
							var path= 'microsites/edit/' + $('#mid').val().trim(); 
							window.location.href=path;
						} else {
							$('.ms-spinner').hide();
							$('#tab_info').html(res);
							$('#midOrig').val($('#mid').val());
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
	
	$('.goLive').live('click', function(event) {
		event.preventDefault();
		var id = $(this).attr("id");
		var mid = id.split('_')[1];
		var data = {"mid":mid};
		$.post('microsites/golive', data, function(html) {
			$('#liveMovie').html(html);
			$('#liveMovie').modal('show');
			var errors = $('#liveMovieRes').val().trim();
			var liveUrl = $('#finalUrl').val().trim();
			if(errors === "") {
				var successmsg = "Movie is live now. Please check the live site in a while. and url is " + liveUrl;
				$('#liveMovieRes').val(successmsg);
			}
			else {
				$('#liveMovieRes').val("Movie data is not valid so it cannot go live. Errors are:  " + errors);
			}
		});
	});
	
	$('.pushProd').live('click', function(event) {
		event.preventDefault();
		var id = $(this).attr("id");
		var mid = id.split('_')[1];
		var data = {"mid":mid};
		$.post('microsites/golive', data, function(html) {
			$('#liveMovie').html(html);
			$('#liveMovie').modal('show');
			var errors = $('#liveMovieRes').val().trim();
			var liveUrl = $('#finalUrl').val().trim();
			if(errors === "") {
				var successmsg = "Movie is live now. Please check the live site in a while. and url is " + liveUrl;
				$('#liveMovieRes').val(successmsg);
			}
			else {
				$('#liveMovieRes').val("Movie data is not valid so it cannot go live. Errors are:  " + errors);
			}
		});
	});
	
	$('.makePopular').live('click', function(event) {
		event.preventDefault();
		var id = $(this).attr("id");
		var mid = id.split('_')[1];
		var data = {"mid":mid};
		$.post('microsites/makePopular', data, function(res) {
			if (res.indexOf("FAILEDFETCHALL") === -1) {
				$('#top_table').html(res);
			}
			else{
				$('#result_top').removeClass("msg-success").addClass("msg-failure").text(
				'Failed to make popular');
			}
			
		});
	});



	// ============================More links=============================//

	$('#more_form').live('submit', function(event) {
		event.preventDefault();
		var result = $('#more_form').parsley('validate');
		if(result) {
			var data = {
					'title' : $('#more_title').val().trim(),
					'url' : $('#more_url').val().trim(),
					'midOrig' : $('#midOrig').val()
				};
				$.post('microsites/more/add', data, function(res) {
					if (res.indexOf("FAILEDMORELINKS") === -1) {
						$('#tab_more').html(res);
						$('#result_more_add').text('More link added successfully.');
					} else
						$('#result_more_add').text('Addition of more link failed.');
				});
		} else {
			$('#result_more_add').text('Validation failed.');
		}
		
	});

	$('.edit_more_btn').live('click', function(event) {
		event.preventDefault();
		var title = $(this).attr('id').split('_')[2];
		$('#title_more_' + title).attr("disabled", false);
		$('#url_more_' + title).attr("disabled", false);
		$(this).attr("disabled", true);
		$('#save_more_' + title).attr("disabled", false);
		$('#reset_more_' + title).attr("disabled", false);
	});

	$('.save_more_btn').live('click', function(event) {
		var title = $(this).attr('id').split('_')[2];
		var result = $('#form_more_'+title).parsley('validate');
		if (result) {
			var data = {
					'title' : $('#title_more_' + title).val().trim(),
					'url' : $('#url_more_' + title).val().trim(),
					'midOrig' : $('#midOrig').val(),
					'titleOrig' : title
				};
				$.post('microsites/more/edit', data, function(res) {
					if (res.indexOf("FAILEDMORELINKS") === -1) {
						$('#tab_more').html(res);
						$('#result_more_add').text('more link saved successfully.');
					} else
						$('#result_more_add').text('Addition of more link failed.');
				});
		} else {
			$('#result_more_add').text('Validation failed.');
		}
	});

	$('.delete_more_btn').live('click', function(event) {
		var title = $(this).attr('id').split('_')[2];
		var data = {
			'midOrig' : $('#midOrig').val(),
			'title' : title
		};
		showDeletePopup();
		attachToYesDelete(function() {
			hideDeletePopup();
			$.post('microsites/more/delete', data, function(res) {
				if (res.indexOf("FAILEDMORELINKS") === -1) {
					$('#tab_more').html(res);
					$('#result_more_add').text('more link deleted successfully.');
				} else
					$('#result_more_add').text('Deletion of more link failed.');

			});
		});
	});

	// ============================Multiple Headers=============================//

	$('#headers_new_form').live('submit', function(event) {
		event.preventDefault();
		
		var result = $('#headers_new_form').parsley('validate');
		if(result) {
			var keyword = $('#keyword_headers_new').val().trim();
			var data = {
				'midOrig': $('#midOrig').val(),
				'keyword': keyword,
				'smartUrl': $('#smart_headers_new').val().trim(),
				'middleUrl':$('#middle_headers_new').val().trim(),
				'lowaUrl': $('#lowa_headers_new').val().trim(),
				'lowbUrl': $('#lowb_headers_new').val().trim(),
				'url': $('#url_headers_new').val().trim()
			};
			$('.ms-spinner').show();
			$.post('microsites/headers/'+keyword, data, function(res) {
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
				'midOrig': $('#midOrig').val(),
				'keyword': keyword,
				'smartUrl': $('#imgUrl_smart_'+keyword).val().trim(),
				'middleUrl':$('#imgUrl_middle_'+keyword).val().trim() ,
				'lowaUrl': $('#imgUrl_lowa_'+keyword).val().trim(),
				'lowbUrl': $('#imgUrl_lowb_'+keyword).val().trim(),
				'url': $('#url_'+keyword).val().trim()
			};
			$('.ms-spinner').show();
			$.post('microsites/headers/'+keyword, data, function(res) {
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
			'midOrig' : $('#midOrig').val(),
			'keyword' : keyword
		};
		showDeletePopup();
		attachToYesDelete(function() {
			hideDeletePopup();
			$('.ms-spinner').show();
			$.post('microsites/headers/delete', data, function(res) {
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

	// ============================More Movies=============================//

	$('#moreMovies_form').live(
			'submit',
			function(event) {
				event.preventDefault();
				var result = $('#moreMovies_form').parsley('validate');
				if(result) {
					var data = {
							'mid' : $('#moreMovies_mid').val().trim(),
							'midOrig' : $('#midOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/moreMovies/add', data, function(res) {
							if (res.indexOf("FAILEDMOREMOVIES") === -1) {
								$('#tab_moreMovies').html(res);
								$('#result_moreMovies_add').removeClass("msg-failure").addClass("msg-success").text(
										'moreMovies added successfully.');
								$('.ms-spinner').hide();
							} else {
								$('#result_moreMovies_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of moreMovies failed.');
								$('.ms-spinner').hide();
							}
						});
				} else {
					$('#result_moreMovies_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validation failed.');
				}
			});

//	$('.edit_moreMovies_btn').live('click', function(event) {
//		event.preventDefault();
//		var order = $(this).attr('id').split('_')[2];
//		$('#mid_moreMovies_' + order).attr("disabled", false);
//		$(this).attr("disabled", true);
//		$('#save_moreMovies_' + order).attr("disabled", false);
//		$('#reset_moreMovies_' + order).attr("disabled", false);
//	});
//
//	$('.save_moreMovies_btn').live(
//			'click',
//			function(event) {
//				var order = $(this).attr('id').split('_')[2];
//				var result = $('#form_moreMovies_' + order).parsley('validate');
//				if(result) {
//					var data = {
//							'order' : parseInt(order, 10),
//							'mid' : $('#mid_moreMovies_' + order).val().trim(),
//							'midOrig' : $('#midOrig').val()
//						};
//						$.post('microsites/moreMovies/edit', data, function(res) {
//							if (res.indexOf("FAILEDMOREMOVIES") === -1) {
//								$('#tab_moreMovies').html(res);
//								$('#result_moreMovies_add').text(
//										'more movies saved successfully.');
//							} else
//								$('#result_moreMovies_add').text(
//										'Addition of more movies keyword failed.');
//						});
//				} else {
//					$('#result_moreMovies_add').text(
//					'Validations failed.');
//				}
//				
//			});

	$('.delete_moreMovies_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var data = {
					'midOrig' : $('#midOrig').val(),
					'order' : parseInt(order, 10)
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('microsites/moreMovies/delete', data, function(res) {
						if (res.indexOf("FAILEDMOREMOVIES") === -1) {
							$('#tab_moreMovies').html(res);
							$('#result_moreMovies_add').removeClass("msg-failure").addClass("msg-success").text(
									'more movies deleted successfully.');
							$('.ms-spinner').hide();
						} else{
							$('#result_moreMovies_add').removeClass("msg-success").addClass("msg-failure").text(
									'Deletion of more movies failed.');
							$('.ms-spinner').hide();
						}
					});
				});
			});

	// ============================Search
	// Keywords=============================//

	$('#search_form').live(
			'submit',
			function(event) {
				event.preventDefault();
				var result = $('#search_form').parsley('validate');
				if(result) {
					var data = {
							'order' : parseInt($('#search_order').val().trim(),10),
							'keyword' : $('#search_keyword').val().trim(),
							'midOrig' : $('#midOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/search/add', data, function(res) {
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
							'midOrig' : $('#midOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/search/edit', data, function(res) {
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
					'midOrig' : $('#midOrig').val(),
					'order' : parseInt(order, 10)
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('microsites/search/delete', data, function(res) {
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
//----------------------------------------Thumbnail URL------------------------------------------//

		$('#thumbnail_form').live(
			'submit',
			function(event) {
				event.preventDefault();
				var result = $('#thumbnail_form').parsley('validate');
				if(result) {
					var data = {
							'url' : $('#thumbnail_url').val().trim(),
							'midOrig' : $('#midOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/thumbnail/add', data, function(res) {
							if (res.indexOf("FAILEDTHUMBNAILURLS") === -1) {
								$('.ms-spinner').hide();
								$('#tab_thumbnail').html(res);
								$('#result_thumbnail_add').removeClass("msg-failure").addClass("msg-success").text(
										'thumbnail added successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_thumbnail_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of thumbnail failed.');
							}
						});
				} else {
					$('#result_thumbnail_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validation failed.');
				}
			});

	$('.edit_thumbnail_btn').live('click', function(event) {
		event.preventDefault();
		var order = $(this).attr('id').split('_')[2];
		$('#url_thumbnail_' + order).attr("disabled", false);
		$(this).attr("disabled", true);
		$('#save_thumbnail_' + order).attr("disabled", false);
		$('#reset_thumbnail_' + order).attr("disabled", false);
	});

	$('.save_thumbnail_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var result = $('#form_thumbnail_' + order).parsley('validate');
				if(result) {
					var data = {
							'order' : parseInt(order, 10),
							'url' : $('#url_thumbnail_' + order).val().trim(),
							'midOrig' : $('#midOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/thumbnail/edit', data, function(res) {
							if (res.indexOf("FAILEDTHUMBNAILURLS") === -1) {
								$('.ms-spinner').hide();
								$('#tab_thumbnail').html(res);
								$('#result_thumbnail_add').removeClass("msg-failure").addClass("msg-success").text(
										'thumbnail saved successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_thumbnail_add').removeClass("msg-success").addClass("msg-failure").text(
								'Addition of thumbnail failed.');
							}

						});
				} else {
					$('#result_thumbnail_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validations failed.');
				}
				
			});

	$('.delete_thumbnail_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var data = {
					'midOrig' : $('#midOrig').val(),
					'order' : parseInt(order,10)
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('microsites/thumbnail/delete', data, function(res) {
						if (res.indexOf("FAILEDTHUMBNAILURLS") === -1) {
							$('.ms-spinner').hide();
							$('#tab_thumbnail').html(res);
							$('#result_thumbnail_add').removeClass("msg-failure").addClass("msg-success").text(
									'thumbnail deleted successfully.');
						} else{
							$('.ms-spinner').hide();
							$('#result_thumbnail_add').removeClass("msg-success").addClass("msg-failure").text(
									'Deletion of thumbnail failed.');
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
							'midOrig' : $('#midOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/other/add', data, function(res) {
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
							'midOrig' : $('#midOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/other/edit', data, function(res) {
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
					'midOrig' : $('#midOrig').val(),
					'order' : parseInt(order,10)
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('microsites/other/delete', data, function(res) {
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

	//--------------------------------Videos----------------------------------//


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
							'thumbnail' : $('#video_thumbnail').val().trim(),
							'midOrig' : $('#midOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/video/add', data, function(res) {
							if (res.indexOf("FAILEDVIDEOS") === -1) {
								$('.ms-spinner').hide();
								$('#tab_video').html(res);
								$('#result_video_add').removeClass("msg-failure").addClass("msg-success").text(
										'Video added successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_video_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of video failed.');
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
		$('#thumbnail_video_' + order).attr("disabled", false);
		$('#link_video_' + order).attr("disabled", false);
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
							'thumbnail' : $('#thumbnail_video_' + order).val().trim(),
							'midOrig' : $('#midOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/video/edit', data, function(res) {
							if (res.indexOf("FAILEDVIDEOS") === -1) {
								$('.ms-spinner').hide();
								$('#tab_video').html(res);
								$('#result_video_add').removeClass("msg-failure").addClass("msg-success").text(
										'Video saved successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_video_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of video failed.');
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
					'midOrig' : $('#midOrig').val(),
					'order' : parseInt(order,10)
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('microsites/video/delete', data, function(res) {
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
//-----------------------------------------------Star Links-------------------------------------//

	$('#stars_form').live(
			'submit',
			function(event) {
				event.preventDefault();
				var result = $('#stars_form').parsley('validate');
				if(result) {
					var data = {
							'order' : parseInt($('#stars_order').val().trim(), 10),
							'title' : $('#stars_title').val().trim(),
							'link' : $('#stars_link').val().trim(),
							'midOrig' : $('#midOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/star/add', data, function(res) {
							if (res.indexOf("FAILEDSTARLINKS") === -1) {
								$('.ms-spinner').hide();
								$('#tab_stars').html(res);
								$('#result_stars_add').removeClass("msg-failure").addClass("msg-success").text(
										'Star Links added successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_stars_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of star links failed.');
							}
						});
				} else {
					$('#result_stars_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validation failed.');
				}
			});

	$('.edit_stars_btn').live('click', function(event) {
		event.preventDefault();
		var order = $(this).attr('id').split('_')[2];
		$('#order_stars_' + order).attr("disabled", false);
		$('#title_stars_' + order).attr("disabled", false);
		$('#link_stars_' + order).attr("disabled", false);
		$(this).attr("disabled", true);
		$('#save_stars_' + order).attr("disabled", false);
		$('#reset_stars_' + order).attr("disabled", false);
	});

	$('.save_stars_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var result = $('#form_stars_' + order).parsley('validate');
				if(result) {
					var data = {
							'origOrder' : parseInt(order, 10),
							'order' : parseInt($('#order_stars_' + order).val(), 10),
							'title' : $('#title_stars_' + order).val(),
							'link' : $('#link_stars_' + order).val().trim(),
							'midOrig' : $('#midOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/star/edit', data, function(res) {
							if (res.indexOf("FAILEDSTARLINKS") === -1) {
								$('.ms-spinner').hide();
								$('#tab_stars').html(res);
								$('#result_stars_add').removeClass("msg-failure").addClass("msg-success").text(
										'star links saved successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_link_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of star links failed.');
							}
						});
				} else {
					$('#result_stars_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validations failed.');
				}
				
			});

	$('.delete_stars_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var data = {
					'midOrig' : $('#midOrig').val(),
					'order' : parseInt(order, 10)
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('microsites/star/delete', data, function(res) {
						if (res.indexOf("FAILEDSTARLINKS") === -1) {
							$('.ms-spinner').hide();
							$('#tab_stars').html(res);
							$('#result_stars_add').removeClass("msg-failure").addClass("msg-success").text(
									'star links deleted successfully.');
						} else{
							$('.ms-spinner').hide();
							$('#result_stars_add').removeClass("msg-success").addClass("msg-failure").text(
									'Deletion of star links failed.');
						}
					});
				});
			});

//----------------------------VAS Main Content-----------------------------------//

	$('#vasmain_form').live(
			'submit',
			function(event) {
				event.preventDefault();
				var result = $('#vasmain_form').parsley('validate');
				if(result) {
					var data = {
							'order' : parseInt($('#vasmain_order').val().trim(),10),
							'title' : $('#vasmain_title').val().trim(),
							'url' : $('#vasmain_url').val().trim(),
							'thumbnailUrl' : $('#vasmain_thumbnailurl').val().trim(),
							'ctype' : $('#vasmain_content').val().trim(),
							'price' : parseInt($('#vasmain_price').val().trim(), 10),
							'midOrig' : $('#midOrig').val()
						};
						$.post('microsites/vasmain/add', data, function(res) {
							if (res.indexOf("FAILEDVASMAINCONTENT") === -1) {
								$('#tab_vasmain').html(res);
								$('#result_vasmain_add').text(
										'VAS main content added successfully.');
							} else
								$('#result_vasmain_add').text(
										'Addition of VAS main content failed.');
						});
				} else {
					$('#result_vasmain_add').text(
					'Validation failed.');
				}
			});

	$('.edit_vasmain_btn').live('click', function(event) {
		event.preventDefault();
		var order = $(this).attr('id').split('_')[2];
		$('#order_vasmain_' + order).attr("disabled", false);
		$('#title_vasmain_' + order).attr("disabled", false);
		$('#url_vasmain_' + order).attr("disabled", false);
		$('#thumbnail_vasmain_' + order).attr("disabled", false);
		$('#content_vasmain_' + order).attr("disabled", false);
		$('#price_vasmain_' + order).attr("disabled", false);
		$(this).attr("disabled", true);
		$('#save_vasmain_' + order).attr("disabled", false);
		$('#reset_vasmain_' + order).attr("disabled", false);
	});

	$('.save_vasmain_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var result = $('#form_vasmain_' + order).parsley('validate');
				if(result) {
					var data = {
							'origOrder' : parseInt(order, 10),
							'order' : parseInt($('#order_vasmain_' + order).val(), 10),
							'title' : $('#title_vasmain_' + order).val(),
							'url' : $('#url_vasmain_' + order).val().trim(),
							'thumbnailUrl' : $('#thumbnail_vasmain_'+ order).val().trim(),
							'ctype' : $('#content_vasmain_' + order).val().trim(),
							'price' : parseInt($('#price_vasmain_' + order).val().trim(), 10),
							'midOrig' : $('#midOrig').val()
						};
						$.post('microsites/vasmain/edit', data, function(res) {
							if (res.indexOf("FAILEDVASMAINCONTENT") === -1) {
								$('#tab_vasmain').html(res);
								$('#result_vasmain_add').text(
										'VAS main content saved successfully.');
							} else
								$('#result_vasmain_add').text(
										'Addition of VAS main content failed.');
						});
				} else {
					$('#result_vasmain_add').text(
					'Validations failed.');
				}
				
			});

	$('.delete_vasmain_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var data = {
					'midOrig' : $('#midOrig').val(),
					'order' : order
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$.post('microsites/vasmain/delete', data, function(res) {
						if (res.indexOf("FAILEDVASMAINCONTENT") === -1) {
							$('#tab_vasmain').html(res);
							$('#result_vasmain_add').text(
									'VAS main content deleted successfully.');
						} else
							$('#result_vasmain_add').text(
									'Deletion of VAS main content failed.');
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
							'midOrig' : $('#midOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/modseq/add', data, function(res) {
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
							'midOrig' : $('#midOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/modseq/edit', data, function(res) {
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
					'midOrig' : $('#midOrig').val(),
					'order' : parseInt(order, 10)
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('microsites/modseq/delete', data, function(res) {
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
							'midOrig' : $('#midOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/qrious/add', data, function(res) {
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
							'midOrig' : $('#midOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/qrious/edit', data, function(res) {
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
					'midOrig' : $('#midOrig').val(),
					'order' : parseInt(order, 10)
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('microsites/qrious/delete', data, function(res) {
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


//----------------------------VAS Content-----------------------------------//

	$('#vasold_form').live(
			'submit',
			function(event) {
				event.preventDefault();
				var result = $('#vasold_form').parsley('validate');
				if(result) {
					var data = {
							'order' : parseInt($('#vasold_order').val().trim(), 10),
							'title' : $('#vasold_title').val().trim(),
							'url' : $('#vasold_url').val().trim(),
							'ctype' : $('#vasold_content').val().trim(),
							'price' : parseInt($('#vasold_price').val().trim(), 10),
							'midOrig' : $('#midOrig').val()
						};
						$.post('microsites/vasold/add', data, function(res) {
							if (res.indexOf("FAILEDVASCONTENT") === -1) {
								$('#tab_vasold').html(res);
								$('#result_vasold_add').text(
										'VAS main content added successfully.');
							} else
								$('#result_vasold_add').text(
										'Addition of VAS main content failed.');
						});
				} else {
					$('#result_vasold_add').text(
					'Validation failed.');
				}
			});

	$('.edit_vasold_btn').live('click', function(event) {
		event.preventDefault();
		var order = $(this).attr('id').split('_')[2];
		$('#order_vasold_' + order).attr("disabled", false);
		$('#title_vasold_' + order).attr("disabled", false);
		$('#url_vasold_' + order).attr("disabled", false);
		$('#thumbnail_vasold_' + order).attr("disabled", false);
		$('#content_vasold_' + order).attr("disabled", false);
		$('#price_vasold_' + order).attr("disabled", false);
		$(this).attr("disabled", true);
		$('#save_vasold_' + order).attr("disabled", false);
		$('#reset_vasold_' + order).attr("disabled", false);
	});

	$('.save_vasold_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var result = $('#form_vasold_' + order).parsley('validate');
				if(result) {
					var data = {
							'origOrder' : parseInt(order, 10),
							'order' : parseInt($('#order_vasold_' + order).val().trim(), 10),
							'title' : $('#title_vasold_' + order).val(),
							'url' : $('#url_vasold_' + order).val().trim(),
							'ctype' : $('#content_vasold_' + order).val().trim(),
							'price' : parseInt($('#price_vasold_' + order).val().trim(), 10),
							'midOrig' : $('#midOrig').val()
						};
						$.post('microsites/vasold/edit', data, function(res) {
							if (res.indexOf("FAILEDVASCONTENT") === -1) {
								$('#tab_vasold').html(res);
								$('#result_vasold_add').text(
										'VAS main content saved successfully.');
							} else
								$('#result_vasold_add').text(
										'Addition of VAS main content failed.');
						});
				} else {
					$('#result_vasold_add').text(
					'Validations failed.');
				}
				
			});

	$('.delete_vasold_btn').live(
			'click',
			function(event) {
				var order = $(this).attr('id').split('_')[2];
				var data = {
					'midOrig' : $('#midOrig').val(),
					'order' : parseInt(order, 10)
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$.post('microsites/vasold/delete', data, function(res) {
						if (res.indexOf("FAILEDVASCONTENT") === -1) {
							$('#tab_vasold').html(res);
							$('#result_vasold_add').text(
									'VAS main content deleted successfully.');
						} else
							$('#result_vasold_add').text(
									'Deletion of VAS main content failed.');
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
							'midOrig' : $('#midOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/vas/add', data, function(res) {
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
							'midOrig' : $('#midOrig').val()
					};
					$('.ms-spinner').show();
					$.post('microsites/vas/edit', data, function(res) {
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
					'midOrig' : $('#midOrig').val(),
					'title' : $('#title_vas_' +category+'_'+ title).val().trim()
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('microsites/vas/delete', data, function(res) {
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

//-----------------------------------------Contest---------------------------------------------//

	$('#question_new_form').live('submit', function(event) {
		event.preventDefault();
		var result = $('#question_new_form').parsley('validate');
		if(result) {
			var data = {
					'order' : parseInt($('#order_new').val().trim(),10),
					'id' : $('#id_new').val().trim(),
					'question' : $('#question_new').val().trim(),
					'rightAnswer' : parseInt($('input[name=answer_new]:checked').val(),10),
					'midOrig' : $('#midOrig').val()
				};
				var options_length = parseInt($('#options_count').val().trim(),10);
				data['options'] = new Array();
				for ( var i = 0; i < options_length; i++) {
					data['options'][i] = $('#options_new_' + i).val();
				}
				var origOrder = 2000;
				$('.ms-spinner').show();
				$.post('microsites/question/' + origOrder, data, function(res) {
					if (res.indexOf("FAILEDCONTEST") === -1) {
						$('.ms-spinner').hide();
						$('#tab_contest').html(res);
						$('#result_question_add').removeClass("msg-failure").addClass("msg-success").text("Question Added successfully.");
					} else {
						$('.ms-spinner').hide();
						$('#result_new_question').removeClass("msg-success").addClass("msg-failure").text("Failed to add question.");
					}
				});
		} else {
			$('#result_new_question').removeClass("msg-success").addClass("msg-failure").text("Data validation failed.");
		}

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

	$('.delete_question_btn').live(
			'click',
			function() {
				var order = $(this).attr('id').split('_')[2];
				var data = {
					'order' : order,
					'midOrig' : $('#midOrig').val()
				};
				showDeletePopup();
				attachToYesDelete(function() {
					hideDeletePopup();
					$('.ms-spinner').show();
					$.post('microsites/question/remove', data, function(res) {
						if (res.indexOf("FAILEDCONTEST") === -1) {
							$('.ms-spinner').hide();
							$('#tab_contest').html(res);
							$('#result_question_add').removeClass("msg-failure").addClass("msg-success").text(
									"Question deleted successfully.");
						} else {
							$('.ms-spinner').hide();
							$('#result_question_add').removeClass("msg-success").addClass("msg-failure").text(
									"Question deletion failed.");
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
				$.post('microsites/question/'+order, data, function(res) {
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
				if(result) {
					var data = {
							'contest_id' : $('#contest_id').val().trim(),
							'title' : $('#contest_title').val().trim(),
							'instructions' : $('#contest_instructions').val().trim(),
							'successMessage' : $('#contest_successMsg').val().trim(),
							'failureMessage' : $('#contest_failureMsg').val().trim(),
							'midOrig' : $('#midOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/contest/basic', data, function(res) {
							if (res.indexOf("FAILEDCONTEST") === -1) {
								$('.ms-spinner').hide();
								$('#tab_contest').html(res);
								$('#result_contest_info').removeClass("msg-failure").addClass("msg-success").text(
										'Contest information updated successfully.');
							} else {
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


//----------------------------Module Sequence--------------------------------//
	$('#modseq_form').live(
			'submit',
			function(event) {
				event.preventDefault();
				var result = $('#modseq_form').parsley('validate');
				if(result) {
					var data = {
							'op1': $('#modseq_one').val().trim(),
							'op2': $('#modseq_two').val().trim(),
							'op3': $('#modseq_three').val().trim(),
							'op4': $('#modseq_four').val().trim(),
							'op5': $('#modseq_five').val().trim(),
							'op6': $('#modseq_six').val().trim(),
							'midOrig' : $('#midOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/modseq/update', data, function(res) {
							if (res.indexOf("FAILEDMODULESEQUENCE") === -1) {
								$('.ms-spinner').hide();
								$('#tab_modseq').html(res);
								$('#result_modseq_add').removeClass("msg-failure").addClass("msg-success").text(
										'Module Sequence updated successfully.');
							} else{
								$('.ms-spinner').hide();
								$('#result_modseq_add').removeClass("msg-success").addClass("msg-failure").text(
										'Addition of Module Sequence failed.');
								$('#modseq_form')[0].reset();
							}
						});
				} else {
					$('#result_modseq_add').removeClass("msg-success").addClass("msg-failure").text(
					'Validation failed.');
				}
			});
	
	
	$('#contest_basic_info').live(
			'submit',
			function(event) {
				event.preventDefault();
				var result = $('#contest_basic_info').parsley('validate');
				if(result) {
					var data = {
							'contest_id' : $('#contest_id').val().trim(),
							'title' : $('#contest_title').val().trim(),
							'instructions' : $('#contest_instructions').val().trim(),
							'successMessage' : $('#contest_successMsg').val().trim(),
							'failureMessage' : $('#contest_failureMsg').val().trim(),
							'midOrig' : $('#midOrig').val()
						};
						$('.ms-spinner').show();
						$.post('microsites/contest/basic', data, function(res) {
							if (res.indexOf("FAILEDCONTEST") === -1) {
								$('.ms-spinner').hide();
								$('#tab_contest').html(res);
								$('#result_contest_info').removeClass("msg-failure").addClass("msg-success").text(
										'Contest information updated successfully.');
							} else {
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
	
	$('#top_form').live(
			'submit',
			function(event) {
				event.preventDefault();
				var result = $('#top_form').parsley('validate');
				if(result) {
					var data = {
							'mid': $('#top_mid').val().trim(),
							'title' : $('#top_title').val().trim(),
							'cId' : $('#top_cid').val().trim(),
							'type' : $('#top_type').val().trim()
						};
						$('.ms-spinner').show();
						$.post('microsites/search', data, function(res) {
							if (res.indexOf("FAILEDFETCHALL") !== -1) {
								$('.ms-spinner').hide();
								$('#result_top').addClass("msg-failure").text(
								'NO RESULTS FOUND');
							}
							else{
								$('.ms-spinner').hide();
								$('#top_table').html(res);
							}
						});
				} else {
					$('#result_top').removeClass("msg-success").addClass("msg-failure").text(
					'Validation failed.');
				}
			});
	
	$('#type_form').live(
			'submit',
			function(event) {
				event.preventDefault();
				var type= $("[name='type']:checked").val();
				var data = {
						'mid': "",
						'title' : "",
						'cId' : "",
						'type' : type
					};
				$('.ms-spinner').show();
				$.post('microsites/search', data, function(res) {
					if (res.indexOf("FAILEDFETCHALL") !== -1) {
						$('.ms-spinner').hide();
						var path= 'microsites/' 
						window.location.href=path;
						$('#result_top').removeClass("msg-success").addClass("msg-failure").text(
						'No results found');
					}
					else{
						$('.ms-spinner').hide();
						$('#top_table').html(res);
					}
				});
	});

});