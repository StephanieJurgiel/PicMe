var mongoose = require('mongoose');
var _ = require('underscore');

var PicMeModel;

var setName = function(name) {
    return _.escape(name).trim();
};

var PicMeSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
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
        poster: this.poster
    };
};

PicMeSchema.statics.findByOwner = function(ownerId, callback) {
    var search = {
        poster: mongoose.Types.ObjectId(ownerId)
    };

	return PicMeModel.find(search).select("text username firstname lastname deleteID").exec(callback);
};

PicMeSchema.statics.findByDeleteID = function(deleteID, callback) {
    var search = {
        deleteID: deleteID
    };
	return PicMeModel.find(search).select("username deleteID text").exec(callback);
};
PicMeModel = mongoose.model('PicMe', PicMeSchema);//this gets called


module.exports.PicMeModel = PicMeModel;
module.exports.PicMeSchema = PicMeSchema;