
jQuery(document).ready(function() {




	pell.init({
	  element: document.getElementById('wysiwygf1'),
	  onChange: html => console.log('changed'),
	  defaultParagraphSeparator: 'p',
	  styleWithCSS: false,
	  actions: [
	    'bold',
	    'underline',
	    'strikethrough',
	    {
	      name: 'backColorYellow',
	      icon: '<img src=\''+pellvars.icon_path+'/yellow-highlighter.svg\'/>',
	      title: 'Highlight Color',
	      result: () => pell.exec('backColor', 'yellow')
	    },
	    {
	      name: 'backColorPink',
	      icon: '<img src=\''+pellvars.icon_path+'/pink-highlighter.svg\'/>',
	      title: 'Highlight Color',
	      result: () => pell.exec('backColor', '#7FFF00')
	    },
	    {
	      name: 'backColorGreen',
	      icon: '<img src=\''+pellvars.icon_path+'/green-highlighter.svg\'/>',
	      title: 'Highlight Color',
	      result: () => pell.exec('backColor', '#FFB6C1')
	    },
	    {
	      name: 'clearFormatting',
	      icon: '<div>Clear</div>',
	      title: 'Clear Formatting',
	      result: () => pell.exec('removeFormat')
	    }
	  ],
	  classes: {
	    actionbar: 'pell-actionbar',
	    button: 'pell-button',
	    content: 'pell-content',
	    selected: 'pell-button-selected',
	    backColorYellow: 'a-yellow-button'
	  }
	}
	);


	pell.init({
	  element: document.getElementById('wysiwygf3'),
	  onChange: html => console.log(),
	  styleWithCSS: false,
	  actions: [
	    'bold',
	    'underline',
	    'strikethrough',
	    {
	      name: 'backColorYellow',
	      icon: '<img src=\''+pellvars.icon_path+'/yellow-highlighter.svg\'/>',
	      title: 'Highlight Color',
	      result: () => pell.exec('backColor', 'yellow')
	    },
	    {
	      name: 'backColorPink',
	      icon: '<img src=\''+pellvars.icon_path+'/pink-highlighter.svg\'/>',
	      title: 'Highlight Color',
	      result: () => pell.exec('backColor', '#7FFF00')
	    },
	    {
	      name: 'backColorGreen',
	      icon: '<img src=\''+pellvars.icon_path+'/green-highlighter.svg\'/>',
	      title: 'Highlight Color',
	      result: () => pell.exec('backColor', '#FFB6C1')
	    },
	    {
	      name: 'clearFormatting',
	      icon: '<div>Clear</div>',
	      title: 'Clear Formatting',
	      result: () => pell.exec('removeFormat')
	    }
	  ],
	  classes: {
	    actionbar: 'pell-actionbar',
	    button: 'pell-button',
	    content: 'pell-content',
	    selected: 'pell-button-selected',
	    backColorYellow: 'a-yellow-button'
	  }
	}
	);

	function cleanHTML(input) {
	  // 1. remove line breaks / Mso classes
	  var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g; 
	  var output = input.replace(stringStripper, ' ');
	  // 2. strip Word generated HTML comments
	  var commentSripper = new RegExp('<!--(.*?)-->','g');
	  var output = output.replace(commentSripper, '');
	  var tagStripper = new RegExp('<(/)*(meta|link|\\?xml:|st1:|o:|font)(.*?)>','gi');
	  // 3. remove tags leave content if any
	  output = output.replace(tagStripper, '');
	  // 4. Remove everything in between and including tags '<style(.)style(.)>'
	  var badTags = ['style', 'script','applet','embed','noframes','noscript'];

	  for (var i=0; i< badTags.length; i++) {
	    tagStripper = new RegExp('<'+badTags[i]+'.*?'+badTags[i]+'(.*?)>', 'gi');
	    output = output.replace(tagStripper, '');
	  }
	  // 5. remove attributes ' style="..."'
	  var badAttributes = ['style', 'start'];
	  for (var i=0; i< badAttributes.length; i++) {
	    var attributeStripper = new RegExp(' ' + badAttributes[i] + '="(.*?)"','gi');
	    output = output.replace(attributeStripper, '');
	  }
	  return output;
	}
	
//make sure the wysiwyg and textareas are kept in sync

jQuery(".response-wysiwyg").keyup(function() {
    var target = jQuery(this).attr('rel');
    var html = jQuery(this).find('.pell-content').html();
    html = cleanHTML(jQuery(this).find('.pell-content').html());
    
    console.log(html);
  });

/*
    jQuery(document).on("keyup",".pell-content",function(event) {
console.log('keyup');
	  var target = jQuery(this).attr('rel');
	  var html = cleanHTML(jQuery(this).html());
	  jQuery("#"+target).html(html);
	});
	

    jQuery(document).on("click",".pell-content",function(event) {
	alert("click");
	});
*/
    jQuery('.response-wysiwyg .pell-content').mouseup(function(event) {
	  var target = jQuery(this).attr('rel');
	  var html = cleanHTML(jQuery(this).html());
	  jQuery("#"+target).html(html);
	});
	
	
	
/*
    jQuery(document).click(function(event){
	jQuery('.response-wysiwyg').each(function(){
	  var target = jQuery(this).attr('rel');
	  var html = cleanHTML(jQuery(this).html());
	  jQuery("#"+target).html(html);
	});
    });	
*/




}); // end on document.ready

