/*
*	Runs on the app and profile page
*	Contains event listeners for the the search bar and seach results
*/
"use strict";
$(document).ready(function() {
    
	/*
	*	Ajax function used when searching for an Account in the search bar
	*	Upon success, calls handleSearchResult() which will display results on page
	*/
    function sendAjaxSearch(action, data) {
		$.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: function(result, status, xhr) {
				console.log(result[0]);
				if(result[0].username != 'noneFound')
				{
					handleSearchResult(result);
				}
            },
            error: function(xhr, status, error) {
                var messageObj = JSON.parse(xhr.responseText);
                handleError(messageObj.error);
            }
        });         
    }
	
	//output error messages from the sendAjaxProfile method to the console
	function handleError(message) {
		console.log("Error!!: " + message);
	}
	
	/*
	*	Runs when the search bar is changed
	*	Sends each changed input value to the controller to check for matching user Accounts
	*/
	$("#findFriends").on('input', function(e) {
		document.getElementById("searchResults").innerHTML = "No Matching Users Found";
		var userSearch = document.getElementById("findFriends").value;
		if(userSearch == "")
		{
			return false;
		}
		if(userSearch != "") {
			sendAjaxSearch($("#findFriends").attr("action"), { username : userSearch });
		}
	});

	/*
	*	Runs when clicking on the document
	*	When clicking anywhere -except- the search bar or the search results
	*	reset the search results so that they are not always displayed on the page
	*/
	$(document).click(function(event) {
		var clickedElement = event.target;
		var searchBox = document.getElementById("findFriends");
		var searchResults = document.getElementById("searchResults");
		
		//determine if the clicked element is the child of the search results
		if(!isChild(searchResults, clickedElement) && clickedElement != searchBox)
		{
			searchResults.innerHTML = "";
		}
	});
	
	/*
	*	recursive method for finding if an element is a child of another
	*	I use it to determine if the clicked element on a page is the child of
	* 	the search results in the previous method above ^
	*/
	function isChild(parent, child) {
		var node = child.parentNode;
		
		while (node != null) {
			if(node == parent){
				return true;
			}
			node = node.parentNode;
		}
		return false;
	}
	
	/*
	*	Runs upon success of the sendAjaxSearch() function
	*	Adds html to the innerHTML of the searchResults to display
	*	the found accounts on the page
	*/
	function handleSearchResult(data) {
		var searchResult = "";
		searchResult += "<div class='resultButton'>"
		searchResult += "<img class='resultImage' alt='test' src='" + data[0].profilePicture +"'\>";
		searchResult += "<h2 class='resultName' action='/profile'>" + data[0].username + "</h2>";
		searchResult += "</div>";
		document.getElementById("searchResults").innerHTML = searchResult;	
	}
});