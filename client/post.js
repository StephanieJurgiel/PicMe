/*
*	Runs on the app and the profile pages
*	Contains event listeners related to posts:
*		- Creating Post Button Clicks
*		- Deleting Post Button Clicks
*		- Liking Post Button Clicks
*		- Updating "like" images upon liking and loading of the page
*/
"use strict";
$(document).ready(function() {

	/*
	*	Ajax function used for creating posts
	*	Will reload the page to show new posts upon success
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
				console.log(messageObj);
            }
        });        
    }
	
	/*
	*	Ajax function used for setting the correct like image upon page loading
	*/
	function sendAjaxUpdateLike(action, data) {
        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: function(result, status, xhr) {
				updateLikes(result);
            },
            error: function(xhr, status, error) {
                var messageObj = JSON.parse(xhr.responseText);
				console.log(messageObj);
            }
        });        
    }
	
	/*
	*	When the page load, get every post on the page by their id
	*	Will have the controller check the model to see
	*	which posts the user has liked, and update the like image accordingly
	*/
	var posts = document.getElementsByClassName("post");
	
	for(var i = 0; i < posts.length; i++){
		var postID = $(posts[i]).find(".x").attr('id');
		sendAjaxUpdateLike("/updateLikes", { postID : postID });
	}
	
	/*
	*	Ajax function used for handling the result of clicking the like button
	*/
	function sendAjaxLike(action, data) {
        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: function(result, status, xhr) {
				editLikes(result);
            },
            error: function(xhr, status, error) {
                var messageObj = JSON.parse(xhr.responseText);
				console.log(messageObj);
            }
        });        
    }
	
	/*
	*	Upon clicking the post button, clear any error messages from the page
	*	Check to see if the user is posting a picture (required) - if so, send data to controller
	*/
	$("#postButton").on("click", function(e) {
		e.preventDefault();
		
		var postError = document.querySelector('#postError');
		postError.innerHTML = '';
		if($('#imageLinkInput').val() ==''){
			postError.innerHTML = 'You must submit a picture!';
			return false;
		}
		
		sendAjax($("#postForm").attr("action"), $("#postForm").serialize());
		return false;
	});
	
	/*
	*	Add event listeners to all the X buttons on posts so we can click them to delete posts
	*	Upon clicking - send the post id of the post to be deleted to the controller
	*/
	var xButtons = document.getElementsByClassName("x");
	var posts = document.getElementsByClassName("post");
	for(var i = 0; i < xButtons.length; i++){
		xButtons[i].addEventListener("click", function(e) {
			sendAjax("/delete", {deleteID: e.target.id});
		});
	}

	/*
	*	Posts and like buttons are added dynamically to the page, but like buttons need event listeners
	*/
	$(document).on('click','.likeButton',  function(e){
		//Upon clicking the like button get the target, find the parent, and find the id in the X button
		var imagePath = event.target.getAttribute('src');
		var postID = $(e.target).parent().parent().find(".x").attr('id');
		var post = $(e.target).parent().parent();
		
		/*
		*	depending on which page we are on (the app or the profile page)
		*	Set the image src to the opposite state with the appropriate path based on the page
		*/
		if(imagePath == 'assets/img/thumbsUp.png' || imagePath == '../assets/img/thumbsUp.png'){
		
			//if we are on the profile page
			if(window.location.href.indexOf("/profilePage") > -1){
				e.target.setAttribute('src', '../assets/img/thumbsUpActive.png');
			}
			else{
				e.target.setAttribute('src', 'assets/img/thumbsUpActive.png');
			}
			//send the post id of the post we liked to the controller so we can update the model
			sendAjaxLike("/like", { postID : postID, like : "like"});
		}
		else{
			if(window.location.href.indexOf("/profilePage") > -1){
				e.target.setAttribute('src', '../assets/img/thumbsUp.png');
			}
			else{
				e.target.setAttribute('src', 'assets/img/thumbsUp.png');
			}
			//send the post id of the post we liked to the controller so we can update the model
			sendAjaxLike("/like", { postID : postID, like : "unlike"});
		}
	});

	
	/*
	*	Runs when the page is loaded -- posts we liked already will appear as being liked
	*	---- so we can't like again!
	*/
	function updateLikes(data) {
		//for every post on the page
		for(var i = 0; i < data.docs[0].likeUsers.length; i++) {
			//if our session id is in the list of users who have liked the post
			if(data.docs[0].likeUsers[i] == data.sessionID) {
				
				//get the like image on the post and change its src accordingly
				var postX = document.getElementById(data.docs[0].deleteID);
				var likePicture = $(postX).parent().find(".likePicture");
				
				if(window.location.href.indexOf("/profilePage") > -1){
					$(likePicture).attr('src', '../assets/img/thumbsUpActive.png');
				}
				else {
					$(likePicture).attr('src', 'assets/img/thumbsUpActive.png');
				}
			}
		}
	}
	
	/*
	*	Runs after the like button has been clicked on a post
	*	Runs upon success of the sendAjaxLike function -- gets the new post like number
	*	Get the like number text on the post and update it without reloading the page
	*/
	function editLikes(data){
		var postX = document.getElementById(data.postID);
		var numLikes = $(postX).parent().find(".numLikes");
		numLikes.get(0).innerHTML = "Likes: " + data.updatedNumLikes
	}

});