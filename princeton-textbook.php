<?php
/*
	Plugin Name: Princeton Textbook
	Plugin URI:
	Description: Adds text, checkbox, radio button, and textarea fields for the creation of online textbooks/workbooks. Please note: this plugin requires some custom work to enable storage of student responses. Please contact Ben Johnston (benj@princeton.edu) for more information.
	Version: 1.0
	Author: Ben Johnston
*/


class PrincetonTextbook {

  function __construct() {
     register_activation_hook( __FILE__, array( $this, 'putextbook_activate') );
     add_action( 'wp_enqueue_scripts', array( $this, 'putextbook_scripts') );
     //require_once( plugin_dir_path( __FILE__ ).'/editor.php');
     add_filter( 'the_content', array ( $this, 'putextbook_content_filter') );
     
     // shortcodes
     add_shortcode("textarea", 	array( $this, "putextbook_insert_textarea") );
     add_shortcode("text", 		array( $this, "putextbook_insert_text") );	
     //add_shortcode("text-show-answer",array( $this, "putextbook_insert_text_with_answer") );	
     add_shortcode("sentence", 	array( $this, "putextbook_insert_sentence") );	
     add_shortcode("dropdown", 	array( $this, "putextbook_insert_dropdown") );	
     add_shortcode("checkboxes", 	array( $this, "putextbook_insert_checkboxes") );	
     add_shortcode("checkbox", 	array( $this, "putextbook_insert_checkbox") );	
     add_shortcode("radio", 		array( $this, "putextbook_insert_radio") );
     add_shortcode("save", 		array ($this, "putextbook_insert_save") );
     
     // ajax
     add_action( 'wp_ajax_send', 	array($this, 'putextbook_ajax_send') );
     add_action( 'wp_ajax_receive', 	array($this, 'putextbook_ajax_receive') );
     add_action( 'wp_ajax_report', 	array($this, 'putextbook_ajax_report') );     
  }
  
  
 	/*****************************************
 	* upon plugin activation, create database 
 	* table for responses
 	*****************************************/
	function putextbook_activate() {
	
	    global $wpdb;
	    $charset_collate = $wpdb->get_charset_collate();
	    $table_name = $wpdb->prefix . 'responses';
	    $sql = "CREATE TABLE `{$table_name}` (
	  `ID` int NOT NULL AUTO_INCREMENT,
	  `uid` varchar(120) CHARACTER SET latin1 NOT NULL,
	  `postid` varchar(120) CHARACTER SET latin1 NOT NULL,
	  `data` text CHARACTER SET latin1 NOT NULL,
	  `initial_save` datetime NOT NULL,
	  `last_save` datetime NOT NULL,
	  PRIMARY KEY (`ID`)
	) ENGINE=InnoDB AUTO_INCREMENT=3065 DEFAULT CHARSET=utf8;";

	    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
	      require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
	      dbDelta($sql);
	    }
   
	}
  
 	/*****************************************
 	* add js and css and data that gets shared with js
 	*****************************************/
	function putextbook_scripts()
	{
	  wp_register_style('language-tools-css', plugins_url('css/style.css',__FILE__ ));
	  wp_enqueue_style('language-tools-css');

	  wp_register_script('language-tools-js', plugins_url('/js/script.js', __FILE__), array('jquery'),'1.3', false);
	  wp_enqueue_script('language-tools-js');
	  
	  global $post;
	  global $current_user;
	  wp_get_current_user();
	  
	  $data = array( 
	    'user' => $current_user->user_login,
	    'uri' => get_permalink($post->ID),
	    'postid' => $post->ID,
	    'ajaxurl' => admin_url( 'admin-ajax.php' ),
	    'plugin_url' => plugins_url('/', __FILE__)
	  );
	  
	  // allow to masqurade as a user
	  if(isset($_GET['u'])) { $data['user'] = $_GET['u']; }
	  
	  wp_localize_script('language-tools-js', 'putextbook_vars', $data );
	  wp_enqueue_style( 'dashicons' );
	}
	
	
	/*********************************
	* Content filter - if a page has any of our
	* response fields, then make the page save-able
	*********************************/

	function putextbook_content_filter($content) {

	  global $post;
	  global $current_user;
	  wp_get_current_user();
	  
	  echo "<script>var user = '".$current_user->user_login."';</script>";

	  if( strstr($content,'[text') || strstr($content,'[sentence') || strstr($content,'[radio') || strstr($content,'[checkboxes') || strstr($content,'[dropdown') ) { 
	    $content = $content . "\n\n[save]";
	    return "<form class='responseform'>".$content."</form>";
	  }
	  else { return $content; }
	}

	
	/************************* SHORTCODES ****************************/
	
	/**************************
	  INCREMENT THE IDs OF THE FIELDS
	***************************/
	function formfield_counter() {  
	  static $formfield_count=0; $formfield_count++; return $formfield_count;
	}



	/**************************
	  TEXTAREA and TEXTBOX
	***************************/

	function putextbook_insert_textarea($atts) {
	  $returnStr = "";
	  $cnt = $this->formfield_counter();
	  if(isset($atts['width'])) { $width=$atts['width']; } else { $width = '100%'; }
	  if(isset($atts['height'])) { $height=$atts['height']; } else { $height = '200px'; }
	  if(isset($atts['placeholder'])) { $placeholder=$atts['placeholder']; } else { $placeholder = ''; }
	  if(isset($atts['answer'])) { 
	    $returnStr .=  "<textarea id='f{$cnt}' name='f{$cnt}' class='textarea response' style='width:{$width};height:{$height};' placeholder='{$placeholder}' ans='{$atts['answer']}'></textarea>";
	  }
	  else { 
	    $returnStr .=  "<textarea id='f{$cnt}' name='f{$cnt}' class='textarea response' style='width:{$width};height:{$height};' placeholder='{$placeholder}'></textarea>";
	 }

	  return $returnStr;
	}
	




	/**************************
	  TEXT
	***************************/



	function putextbook_insert_text($atts) {

	  $cnt = $this->formfield_counter();

	  if(isset($atts['width'])) {
		$width = $atts['width'];
		$style="style='width:{$width}px;'";
	  }
	  elseif(isset($atts['size'])) {
		$size = $atts['size'];
		$style="size='{$size}'";
	  }
	  else { $style="style='width:200px'"; }
	  
	  if(isset($atts['placeholder'])) { $placeholder=$atts['placeholder']; } else { $placeholder = ''; }
	  
	  if(isset($atts['inline'])) {  $returnStr =  "<span class='response-container'>";  } else { $returnStr =  "<div class='response-container'>"; }
	  

	  if(isset($atts['answer'])) { 
	    $ans_str = $atts['answer'];
	    $returnStr .=  "    <input type='text' id='f{$cnt}' name='f{$cnt}' class='text response' ans=\"{$ans_str}\" placeholder='{$placeholder}' {$style} />";
	  }
	  elseif(isset($atts['gloss'])) { 
	    $gloss_str = htmlspecialchars($atts['gloss']);
	    $returnStr .=  "    <input type='text' id='f{$cnt}' name='f{$cnt}' class='text response glossed' gls=\"{$gloss_str}\" placeholder='{$placeholder}'  {$style} />";
	  }
	  else {
	    $returnStr .=  "    <input type='text' id='f{$cnt}' placeholder='{$placeholder}' name='f{$cnt}' class='text response' {$style} />";
	  }
	  
	  if(isset($atts['inline'])) {  $returnStr .=  "</span>"; } else { $returnStr .=  "</div>"; }

	  return $returnStr;
	}




	/**************************
	  SENTENCE
	***************************/

	function putextbook_insert_sentence($atts) {
	  $cnt = $this->formfield_counter();

	  if(isset($atts['width'])) {
		$width = $atts['width'];
		//if($atts['width'] > 70) { $width = 80; }
		$style="style='width:{$width}px'";
	  }

	  elseif(isset($atts['size'])) {
		$size = $atts['size'];
		if($size > 70) { $size = 70; }
		$style="size='{$size}'";
	  }
	  else { $style="style='width:100%'"; }
	  
	  if(isset($atts['placeholder'])) { $placeholder=$atts['placeholder']; } else { $placeholder = ''; }
	  
	  if(isset($atts['answer'])) {
	    $returnStr =  "<div class='response-container'><input type='text' id='f{$cnt}' ans=\"{$atts['answer']}\" name='f{$cnt}' class='sentence response' {$style} style='display:inline-block' /></div>";
	  }
	  elseif(isset($atts['gloss'])) { 
	    $gloss_str = htmlspecialchars($atts['gloss']);
	    $returnStr =  "<div class='response-container'><input type='text' id='f{$cnt}' gls=\"{$gloss_str}\" name='f{$cnt}' class='sentence response glossed' {$style} style='display:inline-block' placeholder='{$placeholder}' /></div>";
	  }
	  else {
	    $returnStr =  "<div class='response-container'><input type='text' id='f{$cnt}' name='f{$cnt}' class='sentence response' {$style} style='display:inline-block'  placeholder='{$placeholder}' /></div>";
	  }
	  return $returnStr;
	}


	/**************************
	  DROPDOWN
	***************************/

	function putextbook_insert_dropdown($atts, $content) {

	  $cnt = $this->formfield_counter();
	  $content = trim($content);
	  
	  
	  // does this have a correct answer?
	  if(strstr($content, '+')) {
	    // if yes, add the text RICHTIG to the value (I used RICHTIG just because it is unlikely to be in the actual text)
	    $content = str_replace('+','*RICHTIG',$content);
	    //trim off any br tags that might be at the beginning
	    $start = strpos($content, '*');
	    $content = substr($content,$start, strlen($content));
	  }
	  else {
	    //trim off any br tags that might be at the beginning
	    $start = strpos($content, '*');
	    $content = substr($content,$start, strlen($content));
	  }
	  $content = str_replace("<br />","",$content);
	  $content = str_replace("<br>","",$content);
	  
	  $items = explode('*',$content);
	  $returnStr =  "";

	  if(!isset($atts['inline'])) { $returnStr .=  "<div class='response-container'>"; }

	  $returnStr .= "<select id='f{$cnt}' name='f{$cnt}' class='dropdown response'>";
	  $returnStr .=  "<option value=''></option>";
	  foreach($items as $key=>$item) {
		if($item != '') {
		  $cnt = $this->formfield_counter();
		  $item = trim($item);
		  $item_val = strip_tags($item);
		  // if it contains RICHTIG, add a class and remove word RICHTIG
		  if(strstr($item,'RICHTIG')) { 
			$item = str_replace('RICHTIG','',$item);
			$returnStr .= "<option value='{$item}' ans='correct'>{$item}</option>"; 
		  }
		  else {
			$returnStr .= "<option value='{$item}'>{$item}</option>"; 
		  }
		} // end if

	  }
	  $returnStr .= "</select>";
	  if(!isset($atts['inline'])) {  $returnStr .=  "</div>"; }
	  return $returnStr;
	  
	}


	/**************************
	  CHECKBOXES
	***************************/

	function putextbook_insert_checkboxes($atts, $content = null ) {

	  
	  $content = trim($content);

	  // does this have a correct answer?
	  if(strstr($content, '+')) {
	    // if yes, add the text RICHTIG to the value (I used RICHTIG just because it is unlikely to be in the actual text)
	    $content = str_replace('+','*RICHTIG',$content);
	    //trim off any br tags that might be at the beginning
	    $start = strpos($content, '*');
	    $content = substr($content,$start, strlen($content));
	  }
	  else {
	    //trim off any br tags that might be at the beginning
	    $start = strpos($content, '*');
	    $content = substr($content,$start, strlen($content));
	  }

	  if(strstr($content, '<br')) { $display_direction = 'block'; } else { $display_direction = "inline-block"; }
	  $content = str_replace("<br />","",$content);
	  $content = str_replace("<br>","",$content);

	  $items = explode('*',$content);

	  $returnStr =  "<div class='ccontainer'>";

	  foreach($items as $key=>$item) {
		if($item != '') {
		  $cnt = $this->formfield_counter();
		  $item = trim($item);
		  $item_val = strip_tags($item);
		  // if it contains RICHTIG, add a class and remove word RICHTIG
		  if(strstr($item,'RICHTIG')) { 
			$item = str_replace('RICHTIG','',$item);
			$returnStr .= "<label for='r{$cnt}' style='display:{$display_direction};padding:0px 10px;border-radius:10px;padding-right:30px;'><input type='checkbox' name='r{$cnt}' id='r{$cnt}' class='checkbox response' ans='correct' /> {$item}</label>"; 
		  }
		  else {
			$returnStr .= "<label for='r{$cnt}' style='display:{$display_direction};padding:0px 10px;border-radius:10px;padding-right:30px;'><input type='checkbox' name='r{$cnt}' id='r{$cnt}' class='checkbox response' /> {$item}</label>"; 
		  }
		} // end if

	  }
	  $returnStr .= "</div>";
	  return $returnStr;

	}



	/**************************
	  A SINGLE CHECKBOX

	***************************/

	function putextbook_insert_checkbox($atts ) {
	  $returnStr =  "<p class='ccontainer'>";
	  $cnt = $this->formfield_counter();
	  $returnStr .= "<input type='checkbox' name='r{$cnt}' id='r{$cnt}' class='checkbox response' />";
	  $returnStr .= "</p>";
	  return $returnStr;

	}


	/**************************
	  RADIO BUTTONS
	***************************/


	function putextbook_insert_radio($atts, $content = null ) {
	  $cnt = $this->formfield_counter();
	  $content = trim($content);

	  // does this have a correct answer?
	  if(strstr($content, '+')) {
	    // if yes, add the text RICHTIG to the value (I ued RICHTIG just because it is unlikely to be in the actual text)
	    $content = str_replace('+','*RICHTIG',$content);
	    //trim off any br tags that might be at the beginning
	    $start = strpos($content, '*');
	    $content = substr($content,$start, strlen($content));
	  }
	  else {
	    //trim off any br tags that might be at the beginning
	    $start = strpos($content, '*');
	    $content = substr($content, $start, strlen($content));
	  }

	  if(strstr($content, '<br')) { $display_direction = 'block'; } else { $display_direction = "inline-block"; }
	  $content = str_replace("<br />","",$content);
	  $content = str_replace("<br>","",$content);

	  $content = str_replace("&nbsp;","",$content);
	  $content = strip_tags($content);

	  $items = explode('*',$content);
	  $returnStr = "<div class='ccontainer'>";

	  $iterate = 1;

	    foreach($items as $item) {
		if($item != "") {
	  	  $item = trim($item);

		  // if it contains RICHTIG, add a class and remove word RICHTIG
		  if(strstr($item,'RICHTIG')) { 
			$item = str_replace('RICHTIG','',$item);
			$richtig = "correct";
			//$returnStr .= "<label for='r{$cnt}-{$iterate}' style='display:{$display_direction};padding:0px 10px;border-radius:10px;padding-right:30px;'><input type='radio' name='r{$cnt}' id='r{$cnt}-{$iterate}' value='{$item}' class='radio response' ans='{$richtig}'> {$item}</label>";
			$returnStr .= "<input type='radio' name='r{$cnt}' id='r{$cnt}-{$iterate}' value='{$item}' class='radio response' ans='{$richtig}' /><label for='r{$cnt}-{$iterate}' class='radio-label' style='display:{$display_direction};'> {$item}</label>";
		  }
		  else {
		  	$richtig = 0;
			//$returnStr .= "<label for='r{$cnt}-{$iterate}' style='display:{$display_direction};padding:0px 10px;border-radius:10px;padding-right:30px;'><input type='radio' name='r{$cnt}' id='r{$cnt}-{$iterate}' value='{$item}' class='radio response'> {$item}</label>";
			$returnStr .= "<input type='radio' name='r{$cnt}' id='r{$cnt}-{$iterate}' value='{$item}' class='radio response'/><label for='r{$cnt}-{$iterate}' class='radio-label' style='display:{$display_direction};'>{$item}</label>";
		  }	  
		  
		$iterate++;
		}
	    }
	  $returnStr .= "</div>";
	  return $returnStr;
	}
	
	/**************************
	  SAVE
	***************************/

	function putextbook_insert_save($atts ) {
	  global $post;

	  if(!isset($_COOKIE['masquerade'])) { $user = wp_get_current_user();  }
	  else {  $user = get_user_by( 'login', $_COOKIE['masquerade'] );  }
	  
	  if(isset($atts['title'])) {   $title = $atts['title'];    } else { $title = "Save"; }
	  $returnStr = "<div class='save-button'><button id='langfuncsave' data-user='{$user->user_login}' data-id='{$post->ID}'>{$title}</button></div>";
	  return $returnStr;
	}
		

	/**************************
	  PHOTO
	***************************/
	/*
	function putextbook_insert_photo( $atts ) {

	  $returnStr = "<input type='file'/>";
	  return $returnStr;
	}
	add_shortcode("photo", "putextbook_insert_photo");
	*/
	
	/****************************** END SHORTCODES ****************************/
	
		
	/********************************** AJAX **********************************/


	function putextbook_ajax_send() {
		if(isset($_POST) && count($_POST) > 1) {

			global $wpdb; 
			date_default_timezone_set('US/Eastern');
			
			$userid = $_POST['user'];
			$postid = $_POST['postid'];
			$data = $_POST['data'];	

			$sql1 = "SELECT * FROM {$wpdb->prefix}responses WHERE userid = '{$userid}' AND postid = '{$postid}'";

			$hit = $wpdb->get_row($sql1);
			
			if($hit = $wpdb->get_row($sql1)) {  
			  $id = $hit->ID;
			  $current_save = date("Y-m-d H:i:s");
			  $sql2 = "UPDATE {$wpdb->prefix}responses SET data = '{$data}', last_save = '{$current_save}' WHERE ID = ".$id;
			}
			else { 
			  $initial_save = date("Y-m-d H:i:s");
			  $sql2 = "INSERT into {$wpdb->prefix}responses (userid,postid,data,initial_save,last_save) VALUES ('{$userid}','{$postid}','{$data}','{$initial_save}','{$initial_save}');";
			}

			$wpdb->query($sql2);
			echo $sql1;
			echo $sql2;
			die('saved '.date("G:i:s"));

			wp_die('saved'); // this is required to terminate immediately and return a proper response
		}
	}




	function putextbook_ajax_receive() {
		global $wpdb;
		$userid = $_GET['userid'];
		$postid = $_GET['postid'];

		$sql = "SELECT data FROM {$wpdb->prefix}responses WHERE userid = '{$userid}' AND postid = '{$postid}'";
		if($result = $wpdb->get_row($sql)) {
		 header('Content-Type: application/json');
		 echo $result->data;
		 die();
		}
		else { return false;}
		wp_die();
	}



}

new PrincetonTextbook();









































