var _ = require('underscore');
var models = require('../models');

var PicMe = models.PicMe;


var appPage = function(req, res) {
	PicMe.PicMeModel.findByOwner(req.session.account._id, function(err, docs) {
		console.log("id to find owner:" + req.session.account._id);
		console.log('find by owner');
        if(err) {
            console.log("error" + err);
            return res.status(400).json({error:'An error occurred'}); 
        }
		console.log(docs);

        res.render('app', {picmes: docs});
		
    });
};

//called after the button is pressed
//create a post out of the data and save it to our database
var createPost = function(req, res) {
	console.log("in create post");
    if(!req.body.postInput) {
		console.log("no text");
    }
    var picPostData = {
		text: req.body.postInput,
		poster: req.session.account._id,
		username: req.session.account.username,
		firstname: req.session.account.firstname,
		lastname: req.session.account.lastname
    };
	console.log(picPostData.username);
    var newPost = new PicMe.PicMeModel(picPostData);
	console.log(newPost);
    newPost.save(function(err) {
        if(err) {
            console.log(err);
            return res.status(400).json({error:'An error occurred'}); 
        }

        res.json({redirect: '/app'});
    });
};

module.exports.appPage = appPage;
module.exports.createPost = createPost;