<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Portfolio Form</title>
	<link rel="stylesheet" href="style.css"> 
	<link rel="shortcut icon" type="image/png" href="Images/Portfolio_logo-III.png"> 
	
	<style> 
	input[type=submit] {
	font-family: Poppins; 
    background-color: #0080C7; 
	color: black;
	font-size: 18px;
    padding: 12px 20px;
    border: none;
    border-radius: 4px; 
    cursor: pointer;
}
	input[type=submit]:hover {
    background-color: #B9BAB9;
}
	div.container-form {
    border-radius: 5px; 
    
		
}</style>
</head>

<body>  
	<img src="Images/Portfolio_logo-III.png" alt="Portfolio logo image" height="10%" width="10%" style="margin-top: -5%;"> 
	<br>
	<?php
	
if(isset($_POST['email'])) {
  
    // EDIT THE 2 LINES BELOW AS REQUIRED  
    $email_to = "johnyc241@gmail.com";        
    $email_subject = "New Message!";    
	
	
 
    function died($error) {
        // your error code can go here
        echo "We are very sorry, but there were error(s) found with the form you submitted. ";
        echo "These errors appear below.<br /> <br />";
        echo $error."<br /><br />";
        echo "Please go back and fix these errors.<br /><br />";
        die();
    } 
 
 
    // validation expected data exists  
    if(!isset($_POST['name']) ||
        !isset($_POST['email']) ||
        !isset($_POST['message'])) {
        died('We are sorry, but there appears to be a problem with the form you submitted.');       
    } 
	
	
	

 
     
 
    $name = $_POST['name']; // required
    $email_from = $_POST['email']; // required 
    $message = $_POST['message']; // required 
 
    $error_message = "";
    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
 
  if(!preg_match($email_exp,$email_from)) {
    $error_message .= 'The Email Address you entered does not appear to be valid.<br />';
  }
 
    $string_exp = "/^[A-Za-z .'-]+$/";
 
  if(!preg_match($string_exp,$name)) {
    $error_message .= 'The Name you entered does not appear to be valid.<br />';
  }
 

  if(strlen($message) < 2) { 
    $error_message .= 'The Message you entered do not appear to be valid.<br />';
  } 
 
  if(strlen($error_message) > 0) {
    died($error_message);
  }
 
    $email_message = "Form details below.\n\n";
 
     
    function clean_string($string) {
      $bad = array("content-type","bcc:","to:","cc:","href");
      return str_replace($bad,"",$string);
    }
 
     
 
    $email_message .= "name: ".clean_string($name)."\n";
    $email_message .= "email: ".clean_string($email_from)."\n";
    $email_message .= "message: ".clean_string($message)."\n";
 
// create email headers
$headers = 'From: '.$email_from."\r\n".
'Reply-To: '.$email_from."\r\n" .
'X-Mailer: PHP/' . phpversion();
@mail($email_to, $email_subject, $email_message, $headers);   
}
	
	if (isset($_POST['name']) || 
	    isset($_POST['email']) ||
	    isset($_POST['message'])) { 
		
		echo "<div style='font-size: 22px'> Message Received. </div><br />";
		echo "<div style='font-size: 22px'> We look forward to connecting with you shortly! </div>"; 
	} 
?>
	<br>
	<div class="container-form">
		<a href="index.html"><input style="font-family: Poppins; margin-top: 2%;" type="submit" value="Go Back"></a></div>
 
	
</body>
</html>