/*
*	Runs on the app and profile page
*	Contains event listeners for the PicMe text at the top of the page
*/
"use strict";
$(document).ready(function() {
    
	/*
	*	Ajax function used when refreshing or going to the app page by
	*	clicking the PicMe text at the top of the page
	*/
    function sendAjax2(action, data) {
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
		
		return false;
    }
	
	//output error messages from the sendAjaxProfile method to the console
	function handleError(message) {
		console.log("Error!!: " + message);
	}

	/*
	*	Runs when clicking a result that appears from the search bar
	*	Send the name of the Account to the controller in order to go to the user's
	*	personal page
	*/
	$(document).on('click','.resultButton',  function(){
		var activeElement = document.activeElement;
		var name = activeElement.querySelector('.resultName').innerHTML;
		var action = "/profilePage/" + name;
		sendAjax2(action, { profileName : name });
	});
	
	/*
	*	Runs when the PicMe text is clicked -- will tell the controller to reload the page
	*/
	$('#PicMeTitle').on('click', function(){
		sendAjax2("/reload", { });
	});
});