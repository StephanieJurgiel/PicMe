var mongoose = require('mongoose');
var _ = require('underscore');

var PicMeModel;

var setName = function(name) {
    return _.escape(name).trim();
};

/*
*	Schema for posts
*	text, username, firstname, lastname, poster (id), profilePicture, picture (post)
* 	likes, dislikes, likesUsers[], dislikeUsers[], createdData, deleteID 
*/
var PicMeSchema = new mongoose.Schema({
    text: {
        type: String,
        required: false
    },
	username: {
		type: String,
        required: true,
        trim: true,
        set: setName
	},
	firstname: {
		type: String,
        required: true,
        trim: true,
        set: setName
	},
	lastname: {
		type: String,
        required: true,
        trim: true,
        set: setName
	},
	poster: 	{
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Account'
	},
	profilePicture: {
		type: String, 
		required: true
	},
	picture: {
		type: String, 
		require: true
	},
	likes: {
		type: Number,
		require: true
	},
	dislikes: {
		type: Number,
		require: true
	},
	likeUsers: {
		type: Array,
		require: true
	}, 
	dislikeUsers: {
		type: Array,
		require: true
	},
    createdData: {
        type: Date,
        default: Date.now
    },
	deleteID: {
		type: String,
		required: true
	}
});

PicMeSchema.methods.toAPI = function() {
    return {
        text: this.text,
		profilePicture: this.profilePicture,
		picture: this.picture,
		likes: this.likes, 
		dislikes: this.dislikes,
		likeUsers: this.likeUsers,
		dislikeUsers: this.dislikeUsers,
		deleteID: this.deleteID,
        poster: this.poster
    };
};

PicMeSchema.statics.findByOwner = function(ownerId, callback) {
    var search = {
        poster: mongoose.Types.ObjectId(ownerId)
    };

	return PicMeModel.find(search).select("text username firstname lastname profilePicture picture likes dislikes likeUsers dislikeUsers deleteID").exec(callback);
};

PicMeSchema.statics.findByUserName = function(username, callback) {
	var user = {
		username: username
	};	
	
	return PicMeModel.find(user).select("text username firstname lastname profilePicture picture likes dislikes likeUsers dislikeUsers deleteID").exec(callback);
};

PicMeSchema.statics.findByID = function(id, user, callback) {
	var id = {
		deleteID: id
	};
	return PicMeModel.find(id).select("likes dislikes likeUsers dislikeUsers deleteID").exec(callback);
};

PicMeSchema.statics.findAll = function(callback) {
	//PicMeModel.collection.remove({}); to clear all the posts in the database ---- used for testing only!!!
	return PicMeModel.find().select("text username firstname lastname profilePicture picture likes dislikes likeUsers dislikeUsers deleteID").exec(callback);
};

PicMeModel = mongoose.model('PicMe', PicMeSchema);//this gets called

module.exports.PicMeModel = PicMeModel;
module.exports.PicMeSchema = PicMeSchema;