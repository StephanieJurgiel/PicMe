"use strict";

$(document).ready(function() {
    
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
            }
        });        
    }
	
	//handle the post button
	$("#postButton").on("click", function(e) {
		e.preventDefault();
		console.log("clicked");
		if($('#postInput').val() == ''){
				return false;
		}
		
		sendAjax($("#postForm").attr("action"), $("#postForm").serialize());
		
		return false;
	});
});