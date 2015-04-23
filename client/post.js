"use strict";

$(document).ready(function() {
    
    function sendAjax(action, data) {
		console.log("in send ajax");
        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: function(result, status, xhr) {
				console.log("success");
                window.location = result.redirect;
            },
            error: function(xhr, status, error) {
				console.log("error");
                var messageObj = JSON.parse(xhr.responseText);
            }
        });        
    }
	
	//handle the post button
	$("#postButton").on("click", function(e) {
		e.preventDefault();
		if($('#postInput').val() == ''){
				return false;
		}
		
		sendAjax($("#postForm").attr("action"), $("#postForm").serialize());
		
		return false;
	});
	
	var xButtons = document.getElementsByClassName("x");
	var posts = document.getElementsByClassName("post");
	for(var i = 0; i < xButtons.length; i++){
		xButtons[i].addEventListener("click", function(e) {
			sendAjax("/delete", {deleteID: e.target.id});
		});
	}
	
	
});