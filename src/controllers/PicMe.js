var _ = require('underscore');
var models = require('../models');
var uuid = require('uuid');

var PicMe = models.PicMe;
var Account = models.Account;

/*
*	Function called when we want to render the appPage with all of the created posts
*/
var appPage = function(req, res) {
	//find all of the posts
	PicMe.PicMeModel.findAll(function(err, docs) {
		if(err) {
            return res.status(400).json({error:'An error occurred'}); 
        }
		//send all of the posts that we found (docs)
        res.render('app', {picmes: docs});
	});
};

/*
*	function called when needing to redirec to the the profile page of a user
*/
var profile = function(req, res) {
	var user = req.params.user;
	res.json({redirect: '/profilePage/' + req.params.user, user: user});
};

/*
*	function called when needing to get data to go to a user's profile page
*	
*/
var profilePage = function(req, res) {
	//Find all of the posts from the user whose page we want to go to
	PicMe.PicMeModel.findByUserName(req.params.user, function(err, docs) {
        if(err) {
            console.log("No posts by user found : error" + err);
            return res.status(400).json({error:'An error occurred'}); 
        }
		
		Account.AccountModel.findByUsernameContains(req.params.user, function(err, userDoc) {
		
			if(err) {
				console.log("Nobody found with that username: error" + err);
				return res.status(400).json({error:'An error occurred'}); 
			}
			
			res.render('profile', {picmes: docs, userDoc: userDoc, user:req.params.user});
		});
    });
};	

/*
*	Runs when the create post button is clicked
*	Create a unique id using npm uuid
*	create a post object with the data we received from the post form and save it to the database
*	Will redirect to the app page
*/
var createPost = function(req, res) {

	var uniqueID = uuid.v1();//npm uuid for unique id based on timestamp
    var picPostData = {
		text: req.body.postInput,
		poster: req.session.account._id,
		username: req.session.account.username,
		firstname: req.session.account.firstname,
		lastname: req.session.account.lastname,
		profilePicture: req.session.account.profilePicture,
		picture: req.body.imageLinkInput,
		likes: 0, 
		dislikes: 0,
		likeUsers: [], 
		dislikeUsers: [],
		deleteID: uniqueID
    };

    var newPost = new PicMe.PicMeModel(picPostData);

	//save the post object
    newPost.save(function(err) {
        if(err) {
            return res.status(400).json({error:'An error occurred'}); 
        }
		//redirect to the app page to reload the page so the new post displays
        res.json({redirect: '/app'});
    });
};

/*
*	Runs when the X bubtton on a post is called
*	User the deleteID from the x button to remove the post from the collection
*	Redirects to the app page
*/
var deletePost = function(req, res) {
	//delete any deleted posts from our page
	PicMe.PicMeModel.collection.remove( { "deleteID" : req.body.deleteID })
	res.json({redirect: '/app'});
};

/*
*	Runs when the user changes the text value of the search bar
* 	Search the database for accounts with usernames that match what the user typed
*	Returns any matching users found and an empty temporary "none" user if no users are found
*/
var search = function(req, res) {
	
	//delete any deleted posts from our page
	Account.AccountModel.findByUsernameContains(req.body.username, function(err, docs) {

		if(err || docs == 0) {
			return res.status(200).json([{username : "noneFound"}]);
		}
		
		else if(docs != 0){
			return res.status(200).json(docs);
		}
	
		return res.status(200).json([{username : "noneFound"}]);
    });
};

/*
*	Runs when the user clicked the like image on a post
*/
var like = function(req, res) {
	//find the post with the id of the post that they liked
	PicMe.PicMeModel.findByID(req.body.postID, req.session.account._id, function(err, docs) {
		
		if(err || docs == 0) {
			 return res.status(400).json({error:'there were no docs found that match the like post'});
		}
		//if we successfully found the post
		if(docs != 0){
			//get the array of users who like the post
			var likeUsersTemp = docs[0].likeUsers;
			//if they clicked to like the post (and not unlike)
			if(req.body.like == 'like'){
				//add their id to the list of user id's that liked the page
				likeUsersTemp.push(req.session.account._id);
				
				//update the value of the likeUsers array in the database
				PicMe.PicMeModel.collection.update(
					{ deleteID: req.body.postID},
					{	$set:
						{
							likeUsers: likeUsersTemp
						}
				
					}
				);
				//we will return "likes" so we can update the number of likes on the page
				var likes = { updatedNumLikes : likeUsersTemp.length, postID: req.body.postID, result : "like" };
			}
			else {//if they unlike the post
				//remove their id from the array
				likeUsersTemp.pop(req.session.account._id);
				//update the value of likeUsers array in the database
				PicMe.PicMeModel.collection.update(
					{ deleteID: req.body.postID},
					{	$set:
						{
							likeUsers: likeUsersTemp
						}
				
					}
				);
				//we will return "likes" so we can update the number of likes on the page
				var likes = { updatedNumLikes : likeUsersTemp.length, postID: req.body.postID, result : "unlike" };
			}
			return res.status(200).json(likes);
		}
	});
}
/*
*	Runs when we just need to reload the app page
*	Called specifically when clicking on the PicMe text at the top of the page
*/
var reload = function(req, res) {
	res.json({redirect: '/app'});
};

/*
*	Runs when the user changes a profile picture on a profile page
*/
var updatePic = function(req, res){
	
	//update the one account with the username to have the new picture
	Account.AccountModel.collection.update(
		{ username: req.body.username},
		{	$set:
			{
				profilePicture: req.body.url
			}
	
		}
	);
	
	//update ALL posts associated with the username to have the new picture
	PicMe.PicMeModel.collection.update(
		{ username: req.body.username},
		{	$set:
			{
				profilePicture: req.body.url
			}
	
		}, 
		{ multi: true}//multi changes all, otherwise only the first found will change
	);
	
	res.json({redirect: '/profilePage/' + req.body.username});
};

/*
*	Runs when the page is reloaded and we need to make sure that liked posts appear as liked
*	according to their like images
*	Finds individual posts based on IDs and returns them so that their likeUsers[] array
*	can be checked for the id of the current user
*/
function updateLikes(req, res) {
	PicMe.PicMeModel.findByID(req.body.postID, req.session.account._id, function(err, docs) {
		if(err || docs == 0) {
			 return res.status(400).json({error:'there were no docs found that match the post id'});
		}
		else if(docs != 0){
			return res.status(200).json({docs : docs, sessionID :req.session.account._id });
		}
	});
}

module.exports.appPage = appPage;
module.exports.createPost = createPost;
module.exports.deletePost = deletePost;
module.exports.search = search;
module.exports.profile = profile;
module.exports.profilePage = profilePage;
module.exports.reload = reload;
module.exports.like = like;
module.exports.updatePic = updatePic;
module.exports.updateLikes = updateLikes;