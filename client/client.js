"use strict"

$(document).ready(function() {
	
	function sendAjax(action, data) {
	console.log("sending");
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
	//handle error messages from the sendAjax method
	 function handleError(message) {
	 console.log(message);
        //$("#errorMessage").text(message);
        //$("#domoMessage").animate({width:'toggle'},350);
    }

	
	
	//handle signup button click
	$("#registerButton").on("click", function(e) {
		document.querySelector("#registerError").innerHTML = "";
		//make sure they typed something into every field
		if($('#userRegister').val() == '' || $('#firstNameRegister').val() == '' || $('#lastNameRegister').val() == '' || $('#passRegister').val() == '' || $('#repeatPassRegister').val() == ''){
			document.querySelector("#registerError").innerHTML = "You must fill in all the criteria before continuing";
			return;
		}
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