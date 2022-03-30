
	
	
jQuery( document ).ready(function() {



	jQuery( window ).unload(function() {
	  return "Bye now!";
	});

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





      function save_user_data() {

	var username = jQuery('.responseform').attr('data-user');
	var postid = jQuery('.responseform').attr('data-id');
	var formData = jQuery('.responseform').serializeObject();
	
	var data = {
	    'user': ltvars.user,
	    'postid': ltvars.postid,
	    'data': formData,
	    'action': 'send'
	};


	jQuery.post(ltvars.ajaxurl, data, function(response) {
		console.log(response);
		return true;
	});

	//return false;
      }



	/*

       jQuery('.showanswer').mouseover(function(event) {
	  jQuery(this).after( "<div id='popup-message'>Test</p>" );
	  jQuery('#popup-message').css('background', "red");
	  jQuery('#popup-message').html(jQuery(this).attr('answer'));
	  var popup_height = jQuery('#popup-message').height()+10;
	  var popup_width = jQuery('#popup-message').width();
	  popup_width = popup_width / 2;
	  var tpos = jQuery(this).position();
	  jQuery('#popup-message').css({top: tpos.top-popup_height, left: tpos.left-popup_width, position:'absolute', background: "white"});
	  jQuery('#popup-message').show();
	  event.preventDefault();
	});

       jQuery('.showanswer').mouseout(function(event) {
	  jQuery("#popup-message").remove();
	});
	*/


	// re-populate

	jQuery(document).ready(function($) {

		//var username = jQuery('.responseform').attr('data-user');
		//var postid = jQuery('.responseform').attr('data-id');

		var data = {
		    'uid': ltvars.user,
		    'postid': ltvars.postid,
		    'action': 'receive'
		};
		
		if(jQuery('.responseform').length > 0) {
		
			jQuery.get(ltvars.ajaxurl, data, function(response) {
			

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
				  var ans = jQuery(this).attr('ans');
				  var val = jQuery(this).val();
				  if(ans==val) { 
				    jQuery(this).addClass('correct');
				    jQuery(this).parent().addClass('correct');
				  }
				});

				// repopulate correct answers in radios
				var fields = jQuery(".radio.response");
				jQuery.each(fields, function(i,v){
				  if(jQuery(this).attr('checked')=='checked' && jQuery(this).attr('ans') == 'correct') 						{ jQuery(this).next().addClass('correct'); }
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



	// TRIGGERS TO SAVE USER DATA

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


   /* SAVES */
  jQuery('.text').click(function(){
   console.log('save it now');
  });




    jQuery('.text').keyup(function(e){

     var txtfield = jQuery(this);

     if(typeof jQuery(this).attr('ans') !== 'undefined') {

      var answer = jQuery(this).attr('ans').toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      var value = jQuery(this).val().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      if(answer.includes('|')) {
	var split = answer.split('|');
	jQuery.each(split, function(i,v){

          if(value==v) {
	    //txtfield.css({'background-image':'url("'+ltvars.plugin_url+'images/correct.png")','background-repeat':'no-repeat','background-position':'right'});
	    txtfield.addClass('correct');
          }
	});
      }
      else {
        if(answer==value) {
	  //jQuery(this).css({'background-image':'url("'+ltvars.plugin_url+'images/correct.png")','background-repeat':'no-repeat','background-position':'right'});
	  jQuery(this).addClass('correct');
        }
      }

    } // end if not undefined
    });
    
    
    jQuery('.sentence').keyup(function(e){
      var ans = jQuery(this).attr('ans');
      if (typeof ans !== typeof undefined && ans !== false) {
        var answer = ans.toLowerCase();
      }
      else { var answer = ""; }
      var value = jQuery(this).val().toLowerCase();

      if(answer==value) {
	jQuery(this).css({'background-image':'url("/wp-content/plugins/language-tools2/images/correct.png")','background-repeat':'no-repeat','background-position':'right'});
      }
    });
   
   
   
   
   
   
   
   
   
   
    
    
    
    
    
    
    /*
    * check textarea
    *****************************/
    
    jQuery('textarea').keyup(function(e){

     var txtfield = jQuery(this);

     if(typeof jQuery(this).attr('ans') !== 'undefined') {

      var answer = jQuery(this).attr('ans').toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      var value = jQuery(this).val().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      if(answer.includes('|')) {
	var split = answer.split('|');
	jQuery.each(split, function(i,v){

          if(value==v) {
	    txtfield.css({'background-image':'url("'+ltvars.plugin_url+'images/correct.png")','background-repeat':'no-repeat','background-position':'right'});
          }
	});
      }
      else {
        if(answer==value) {
	  jQuery(this).css({'background-image':'url("'+ltvars.plugin_url+'images/correct.png")','background-repeat':'no-repeat','background-position':'right'});
        }
      }

    } // end if not undefined
    });


    jQuery('.glossed').mouseover(function(event) {
	  var gloss_str = jQuery(this).attr('gls');
	  jQuery(this).parent().append("<div class='gloss'>"+gloss_str+"</div>");
	  event.preventDefault();
	});
    jQuery('.glossed').mouseout(function(event) {
	  jQuery(this).parent().find('.gloss').remove();
	  event.preventDefault();
	});





    jQuery('.radio').click(function(e){
      var answer = jQuery(this).attr('ans');
      if(answer=='correct') {
	//jQuery(this).parent().css({'color':'green','font-weight':'bolder'});
	jQuery(this).next().addClass('correct');
      }
    });

    jQuery('.checkbox').click(function(e){
      var answer = jQuery(this).attr('ans');
      if(answer=='correct') {
	var checkmark = ltvars.plugin_url+'images/correct-sm.png';
	jQuery(this).parent().css({'background-image':'url("'+checkmark+'")','background-repeat':'no-repeat','background-position':'right'});
        //jQuery(this).parent().append("<span><img src='"+checkmark+"'/></span>");

      }
    });

//https://linguaviva.princeton.edu/101/home/capitulo-4/4-6-muito-muitos-muita-muitas/

    jQuery('.dropdown').change(function(e){
      var selectedoption = jQuery(this).children("option").filter(":selected");
      var answer = selectedoption.attr('ans');
      if(answer=='correct') {
	selectedoption.parent().css({'background':'#9de3d3','font-weight':'bolder','color':'black'});
      }
    });


/*
	 	jQuery.post(response_ajax.siteurl, data, function(response) {
		    jQuery('.save').text( "Guardado" );
		    setTimeout(function() { jQuery('.save').text( "Guardar" ); },3000);
		    console.log('Page saved');
		    updateSavedOnDate();

	 	});
	 	return false;
*/


/*
	jQuery('.response').click(function() {
	   if(jQuery(this).attr('ans') == 'correct') {
		console.log('correct');
		//jQuery(this).parent().css({'color':'#070','font-weight':'bold'});
		//if(jQuery(this).parent().has('.dashicons')) { console.log('has a span'); }
		if(!jQuery(this).parent().hasClass('correct')) {
		  jQuery(this).parent().append('<span class="dashicons dashicons-yes"></span>');
		}
		jQuery(this).addClass('correct');
		jQuery(this).parent().addClass('correct');

	   }
	   else {
		console.log('incorrect');
		//jQuery(this).parent().css({'color':'#b55','font-weight':'bold'});
		if(!jQuery(this).parent().hasClass('incorrect')) {
		  jQuery(this).parent().append('<span class="dashicons dashicons-no-alt"></span>');
		}
		jQuery(this).addClass('incorrect');
		jQuery(this).parent().addClass('incorrect');

	   }
	});

*/






	jQuery( ".checkbox").click(function() {
	  var ans = jQuery(this).find('label').attr('ans');

	  if(typeof ans != 'undefined') {
		jQuery(this).animate({'color':'#0d0','font-weight':'bold'}, 1000);
	  }
	  else { }
	});




});
