/*
*	Runs on the login and register page
*	Contains event listeners for login and register buttons
*/
"use strict"
$(document).ready(function() {
	
	/*
	*	Ajax function used for logging in and registering
	*	Will redirect the user to the main app page upon success
	*/
	function sendAjax(action, data) {
        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: function(result, status, xhr) {
                window.location = result.redirect;
            },
            error: function(xhr, status, error) {
                var messageObj = JSON.parse(xhr.responseText);
                handleError(messageObj.error);
            }
        });        
    }
	
	//output error messages from the sendAjax method to the console
	 function handleError(message) {
		console.log(message);
	 }
	 
	//handle signup button click
	$("#registerButton").on("click", function(e) {
		document.querySelector("#registerError").innerHTML = "";
		//make sure they typed something into every field
		if($('#userRegister').val() == '' || $('#firstNameRegister').val() == '' || $('#lastNameRegister').val() == '' || $('#passRegister').val() == '' || $('#repeatPassRegister').val() == '' || $('#pictureRegister').val() == ''){
			document.querySelector("#registerError").innerHTML = "You must fill in all the criteria before continuing";
			return;
		}
		//make sure the passwords match
		if($("#passRegister").val() !== $('#repeatPassRegister').val()){
			document.querySelector("#registerError").innerHTML = "The passwords that you entered do not match";
			return;
		}
		else{
			sendAjax($("#registerForm").attr("action"), $("#registerForm").serialize());
		}
		return false;
	});
	
	//handle the login button click
	$("#loginButton").on("click", function(e) {
		document.querySelector("#loginError").innerHTML = "";
		//make sure they typed something into every field
		if($('#user').val() == '' || $('#pass').val() == ''){
			document.querySelector("#loginError").innerHTML = "A username and password are required";
		}
		else{
			sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());
		}
		
	});
});