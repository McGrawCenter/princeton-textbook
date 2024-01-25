
/* define the toolbar */
var pell_actions = [
    'bold',
    'underline',
    'strikethrough',
    {
      name: 'backColor',
      icon: '<img src=\''+pellvars.icon_path+'/yellow-highlighter.svg\'/>',
      title: 'Highlight Color',
      result: () => pell.exec('backColor', 'yellow')
    },
    {
      name: 'backColor',
      icon: '<img src=\''+pellvars.icon_path+'/green-highlighter.svg\'/>',
      title: 'Highlight Color',
      result: () => pell.exec('backColor', '#7FFF00')
    },
    {
      name: 'backColor',
      icon: '<img src=\''+pellvars.icon_path+'/pink-highlighter.svg\'/>',      
      title: 'Highlight Color',
      result: () => pell.exec('backColor', '#FFB6C1')
    },
    {
      name: 'clearFormatting',
      icon: '<img src=\''+pellvars.icon_path+'/eraser.svg\'/>',
      title: 'Clear Formatting',
      result: () => pell.exec('removeFormat')
    }
  ]


jQuery('.response-wysiwyg').each(function(i,v){
  var divId = jQuery(this).attr('id');
  pellInit(divId);
});

function pellInit(divId) {
   pell.init({
     element: document.getElementById(divId),
     onChange: html => console.log(),
     defaultParagraphSeparator: 'p',
     styleWithCSS: false,
     actions: pell_actions
   });
}


jQuery(".response-wysiwyg").keyup(function() {
    var target = jQuery(this).attr('rel');
    var html = jQuery(this).find('.pell-content').html();
    console.log(html);
    console.log("#"+target);
    jQuery("#"+target).val(html);
  });

jQuery(".response-wysiwyg").click(function() {
    var target = jQuery(this).attr('rel');
    var html = jQuery(this).find('.pell-content').html();
    console.log(html);
    console.log("#"+target);
    jQuery("#"+target).val(html);
  });



