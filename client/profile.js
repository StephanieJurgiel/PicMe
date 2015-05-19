/*
*	Runs on the profile page
*	Contains event listeners for login and register buttons
*/
"use strict"
$(document).ready(function() {
	
	/*
	*	Ajax function used for updating a profile picture
	*	Will reload the page to show new picture upon success
	*/
	function sendAjaxProfile(action, data) {
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
	//output error messages from the sendAjaxProfile method to the console
	 function handleError(message) {
		console.log(message);
	 }
	 
	/*
	*	Event listener for the edit profile picture button
	*	Get the id (username) of the button and the text of the url of the new image
	* 	Send this data to thr controller to update the model
	*/
	$(".profilePicButton").on("click", function(e) {
		
		var username = $(".profilePicButton").attr("id");
		var url = $('#profileLinkInput').val();
		//make sure they typed something into the text field for the image url
		if($('#profileLinkInput').val() != '' ){
			sendAjaxProfile("/updatePic", {username : username, url: url});
			return;
		}
		return false;
	});
});