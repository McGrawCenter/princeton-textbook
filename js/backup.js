	// re-populate ------------------------------------------------------

	jQuery(document).ready(function($) {

		var username = jQuery('.responseform').attr('data-user');
		var postid = jQuery('.responseform').attr('data-id');

		var data = {
		    'user': ltvars.user,
		    'uri':ltvars.uri
		};

		jQuery.get(ltvars.ajaxurl, data, function(response) {

			response = JSON.parse(response);

			jQuery.each(response, function(name, val) {

			  val = decodeURIComponent(val).replace(/\"/g, "'");
			
			  jQuery('#' + name).filter('input[type=text]').val(val);
			  jQuery('#' + name).filter('select').val(val);
			  jQuery('#' + name).filter('textarea').text(val);

//console.log(jQuery('#' + name).filter('input[type=text]').attr('ans'));

			  jQuery('#wysiwyg' + name).html(val);
			  jQuery('input[name="'+name+'"]').filter('input[value="'+val+'"]').attr('checked','checked');
			  if(val == 'on') {
			    jQuery('input[name="'+name+'"]').attr('checked','checked');
			  }

			  // checkboxes are kind of a pain:
			  if(typeof(val) == 'object') { 
			   jQuery.each( val, function( index, value ){
			       	jQuery('input[name="'+name+'"]').filter('input[value="'+value+'"]').attr('checked','checked');
			   });
			  }

			});
			
			// repopulate correct answers in text fields, sentences, and textareas
			var fields = jQuery(".response");
			jQuery.each(fields, function(i,v){
			  var ans = jQuery(this).attr('ans');
			  var val = jQuery(this).val();
			  if(ans==val) { jQuery(this).addClass('correct'); }
			});

			// repopulate correct answers in radios
			var fields = jQuery(".radio.response");
			jQuery.each(fields, function(i,v){
			  if(jQuery(this).attr('checked')=='checked' && jQuery(this).attr('ans') == 'correct') { jQuery(this).parent().addClass('correct'); }
			});

			// repopulate correct answers in dropdowns
			var fields = jQuery(".dropdown.response");
			jQuery.each(fields, function(i,v){
 			   var ans = jQuery(this).val();
			   var cor = jQuery(this).find('option[ans=correct]').val();
			   if(ans === cor) { jQuery(this).addClass('correct'); }
			});


		});
		
	});
