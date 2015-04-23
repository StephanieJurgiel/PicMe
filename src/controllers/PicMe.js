var _ = require('underscore');
var models = require('../models');

var PicMe = models.PicMe;

var numPosts = 1;

var appPage = function(req, res) {
	//load the posts
	PicMe.PicMeModel.findByOwner(req.session.account._id, function(err, docs) {
        if(err) {
            console.log("error" + err);
            return res.status(400).json({error:'An error occurred'}); 
        }
		//console.log(docs);
		console.log("about to render");
        res.render('app', {picmes: docs});
    });
	
	
};

//called after the button is pressed
//create a post out of the data and save it to our database
var createPost = function(req, res) {
	//console.log("in create post");
    if(!req.body.postInput) {
		console.log("no text");
    }
    var picPostData = {
		text: req.body.postInput,
		poster: req.session.account._id,
		username: req.session.account.username,
		firstname: req.session.account.firstname,
		lastname: req.session.account.lastname,
		deleteID: numPosts
    };
	//console.log(picPostData.username);
    var newPost = new PicMe.PicMeModel(picPostData);
	//console.log(newPost);
    newPost.save(function(err) {
        if(err) {
            console.log(err);
            return res.status(400).json({error:'An error occurred'}); 
        }
		numPosts++;
        res.json({redirect: '/app'});
    });
};

var deletePost = function(req, res) {
	console.log("data:" + req.body.deleteID);
	
	//delete any deleted posts from our page
	PicMe.PicMeModel.findByDeleteID(req.body.deleteID, function(err, docs) {
		console.log("deleting by ID:" + req.body.deleteID);
		//console.log("items to delete: " + docs);
        if(err) {
            console.log("error" + err);
            return res.status(400).json({error:'An error occurred'}); 
        }
		
    });
	
	//PicMe.PicMeModel.remove( { deleteID: req.body.deleteID });
	PicMe.PicMeModel.collection.remove( { "deleteID" : req.body.deleteID })
	res.json({redirect: '/app'});
};

module.exports.appPage = appPage;
module.exports.createPost = createPost;
module.exports.deletePost = deletePost;