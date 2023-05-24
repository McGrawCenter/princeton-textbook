<?php



/************************** ADD BUTTON TO TINYMCE *******************************/


// https://www.gavick.com/blog/wordpress-tinymce-custom-buttons


function linguaviva_add_tinymce_plugin($plugin_array) {
    $plugin_array['linguaviva_tc_button'] = plugins_url( 'js/editor.js', __FILE__ );
    return $plugin_array;
}




function linguaviva_register_my_tc_button($buttons) {
   array_push($buttons, "text","textarea", "sentence","radiobuttons","checkboxes","dropdown","googleimages","priberam");
   return $buttons;
}



function linguaviva_add_my_tc_button() {
    global $typenow;

    // check user permissions
    if ( !current_user_can('edit_posts') && !current_user_can('edit_pages') ) {
    return;
    }
    add_filter("mce_external_plugins", "linguaviva_add_tinymce_plugin");
    add_filter('mce_buttons', 'linguaviva_register_my_tc_button');

}

add_action('admin_head', 'linguaviva_add_my_tc_button');
