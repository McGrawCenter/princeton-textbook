
	
	
jQuery( document ).ready(function() {



	

	(function($){
	    jQuery.fn.serializeObject = function() {
		var o = {};
		var a = this.serializeArray();
		jQuery.each(a, function() {

		    //this.value = this.value.replace(/"/g, '\`');
		    //this.value = this.value.replace(/'/g, '\`');
		    this.value = encodeURIComponent(this.value);

		    if (o[this.name] !== undefined) {
		        if (!o[this.name].push) {
		            o[this.name] = [o[this.name]];
		        }
		        o[this.name].push(this.value || '');
		    } else {
		        o[this.name] = this.value || '';
		    }
		});
		return JSON.stringify(o);
	    };
	})(jQuery);



      /******************************
      * Save page data
      ******************************/

      function save_user_data() {

	var username = jQuery('.responseform').attr('data-user');
	var postid = jQuery('.responseform').attr('data-id');
	var formData = jQuery('.responseform').serializeObject();
	var data = {
	    'user': putextbook_vars.user,
	    'postid': putextbook_vars.postid,
	    'data': formData,
	    'action': 'send'
	};
	jQuery.post(putextbook_vars.ajaxurl, data, function(response) {
		console.log(response);
		return true;
	});
      }






      /******************************
      * Re-populate page data
      ******************************/

	jQuery(document).ready(function($) {

		//var username = jQuery('.responseform').attr('data-user');
		//var postid = jQuery('.responseform').attr('data-id');
		console.log(putextbook_vars.ajaxurl+"?action=receive&userid=admin&postid=86");
		var data = {
		    'userid': putextbook_vars.user,
		    'postid': putextbook_vars.postid,
		    'action': 'receive'
		};
		
		if(jQuery('.responseform').length > 0) {
		
			jQuery.get(putextbook_vars.ajaxurl, data, function(response) {

				jQuery.each(response, function(name, val) {
				  
				  val = decodeURIComponent(val).replace(/\"/g, "'");
				
				  jQuery('#' + name).filter('input[type=text]').val(val);
				  jQuery('#' + name).filter('select').val(val);
				  jQuery('#' + name).filter('textarea').text(val);
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

				}); // end each
				

				// repopulate correct answers in text fields, sentences, and textareas
				var fields = jQuery(".response");
				
				jQuery.each(fields, function(i,v){
				
				  var txtfield = jQuery(this);
				  if(txtfield.attr('ans')){
				    var ans = jQuery(this).attr('ans').toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				  }
				  else { var ans = ""; }
				  var val = jQuery(this).val().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				  
				  if(ans) {
				  
				     if(ans.includes('|')) {
					 var split = ans.split('|');
					 jQuery.each(split, function(i,v){
					  if(val==v) {
					    txtfield.addClass('correct');
					  }
					 });
				     }
				     else {
				        if(ans==val) { 
				          jQuery(this).addClass('correct');
				          jQuery(this).parent().addClass('correct');
				        }
				     }
				  }
				});

				// repopulate correct answers in radios
				var fields = jQuery(".radio.response");
				jQuery.each(fields, function(i,v){
				  if(jQuery(this).attr('checked')=='checked' && jQuery(this).attr('ans') == 'correct') { jQuery(this).next().addClass('correct'); }
				});
				
				// repopulate correct answers in checkboxes
				var fields = jQuery(".checkbox.response");
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
		} /* end if responseform length > 0*/
	});



      /******************************
      * Various triggers to save page data
      ******************************/

	jQuery( "#langfuncsave").click(function(e) {
	   jQuery(this).text( "Saving" );
	   setTimeout(function() { jQuery("#langfuncsave").text( "Saved" );
		setTimeout(function() { jQuery("#langfuncsave").text( "Save" ); },1500);
	   },1500);
	   
	   save_user_data();
	   e.preventDefault();

	});



	// input field lose focus - but also wait 3 secs

	var mytimer;
	jQuery('.response').blur(function(){

	    clearTimeout(mytimer);
	    mytimer = setTimeout(function(){ 
	    
		   jQuery('#save_message').html( "Saving" );
		   setTimeout(function() { 
			jQuery('#save_message').text( "Saved" );
			setTimeout(function() { jQuery("#save_message").text( "" ); },1500);
		        },1500);
		   save_user_data();
		   console.log('saving');
	    
	    },1000);
	});
	
	

	jQuery('.response').change(function(){

	    clearTimeout(mytimer);
	    mytimer = setTimeout(function(){ 
	    
		   jQuery('#save_message').html( "Saving" );
		   setTimeout(function() { 
			jQuery('#save_message').text( "Saved" );
			setTimeout(function() { jQuery("#save_message").text( "" ); },1500);
		        },1500);
		   save_user_data();
		   console.log('saving');
	    
	    },1000);

	    
	});


      /******************************
      * Check for correct answers in text fields
      ******************************/

    jQuery('.text').keyup(function(e){

     var txtfield = jQuery(this);

     if(typeof jQuery(this).attr('ans') !== 'undefined') {

      var answer = jQuery(this).attr('ans').toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      var value = jQuery(this).val().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      if(answer.includes('|')) {
	var split = answer.split('|');
	

	jQuery.each(split, function(i,v){

          if(value==v) {
	    //txtfield.css({'background-image':'url("'+putextbook_vars.plugin_url+'images/correct.png")','background-repeat':'no-repeat','background-position':'right'});
	    txtfield.addClass('correct');
          }
	});
      }
      else {
        if(answer==value) {
	  //jQuery(this).css({'background-image':'url("'+putextbook_vars.plugin_url+'images/correct.png")','background-repeat':'no-repeat','background-position':'right'});
	  jQuery(this).addClass('correct');
        }
      }

    } // end if not undefined
    });
    
    
    
      /******************************
      * Check for correct answers in sentences
      ******************************/
    
    jQuery('.sentence').keyup(function(e){
    
      var txtfield = jQuery(this);
    
      var ans = jQuery(this).attr('ans');
      if (typeof ans !== typeof undefined && ans !== false) {
        var answer = jQuery(this).attr('ans').toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      }
      else { var answer = ""; }

      var value = jQuery(this).val().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      console.log(answer);
      
      
     
      if(answer.includes('|')) {
      
	var split = answer.split('|');
	
	jQuery.each(split, function(i,v){
          if(value==v) {
	    txtfield.addClass('correct');
          }
	});
      }
      else {
        if(answer==value) {
	  txtfield.addClass('correct');
        }
      }      
      
      
      
    });
   
   

    
      /******************************
      * Check for correct answers in texareas
      ******************************/
    
    jQuery('textarea').keyup(function(e){

     var txtfield = jQuery(this);

     if(typeof jQuery(this).attr('ans') !== 'undefined') {

      var answer = jQuery(this).attr('ans').toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      var value = jQuery(this).val().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      if(answer.includes('|')) {
	var split = answer.split('|');
	jQuery.each(split, function(i,v){

          if(value==v) {
	    txtfield.css({'background-image':'url("'+putextbook_vars.plugin_url+'images/correct.png")','background-repeat':'no-repeat','background-position':'right'});
          }
	});
      }
      else {
        if(answer==value) {
	  jQuery(this).css({'background-image':'url("'+putextbook_vars.plugin_url+'images/correct.png")','background-repeat':'no-repeat','background-position':'right'});
        }
      }

    } // end if not undefined
    });
    
    



      /******************************
      * Pop-up glosses
      ******************************/
    jQuery('.glossed').mouseover(function(event) {
	  var offset = jQuery(this).offset();
	  var width = jQuery(this).width();
	  var height = jQuery(this).height();

	  var centerX = offset.left + width / 2;
	  var locY = offset.top - 36;
	  var gloss_str = jQuery(this).attr('gls');
	  jQuery('body').append("<div class='gloss'>"+gloss_str+"</div>");
	  var glosswidth = jQuery('.gloss').width();
	  var locX = centerX-(glosswidth/2);
	  jQuery(".gloss").css({"top":locY+"px","left":locX+"px"});
	  jQuery(".gloss").show();
	  event.preventDefault();
	  });
          jQuery('.glossed').mouseout(function(event) {
	  jQuery('.gloss').remove();
	  event.preventDefault();
	});



      /******************************
      * Check for correct answers in radio buttons
      ******************************/

    jQuery('.radio').click(function(e){
      var answer = jQuery(this).attr('ans');
      if(answer=='correct') {
	//jQuery(this).parent().css({'color':'green','font-weight':'bolder'});
	jQuery(this).next().addClass('correct');
      }
    });




      /******************************
      * Check for correct answers in checkboxes
      ******************************/
    jQuery('.checkbox').click(function(e){
      var answer = jQuery(this).attr('ans');
      if(jQuery(this).is(":checked") && answer=='correct') {
        jQuery(this).parent().addClass('correct');

      }
    });



      /******************************
      * Check for correct answers in dropdowns
      ******************************/

    jQuery('.dropdown').change(function(e){
      var selectedoption = jQuery(this).children("option").filter(":selected");
      var answer = selectedoption.attr('ans');
      if(answer=='correct') {
	selectedoption.parent().css({'background':'#9de3d3','font-weight':'bolder','color':'black'});
      }
    });







/*
	jQuery( ".checkbox").click(function() {
	  var ans = jQuery(this).find('label').attr('ans');

	  if(typeof ans != 'undefined') {
		jQuery(this).animate({'color':'#0d0','font-weight':'bold'}, 1000);
	  }
	  else { }
	});

*/


});
