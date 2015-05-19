var crypto = require('crypto');
var mongoose = require('mongoose');

var AccountModel;
var iterations = 10000;
var saltLength = 64;
var keyLength = 64;

/*
*	Schema for a user account
*	username, salt, password, firstname, lastname, profilePicture, createdData
*/
var AccountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: /^[A-Za-z0-9_\-\.]{1,16}$/
    },
	
	salt: {
		type: Buffer,
		required: true
	},
    
    password: {
        type: String,
        required: true
    },
    
	firstname: {
		type: String,
		required: true
	},
	
	lastname: {
		type: String, 
		required: true
	},
	
	profilePicture: {
		type: String, 
		required: true
	},
	
    createdData: {
        type: Date,
        default: Date.now
    }

});

/*
*	gets information from the account
*/
AccountSchema.methods.toAPI = function() {
    //_id is built into your mongo document and is guaranteed to be unique
    return {
        username: this.username,
		firstname: this.firstname,
		lastname: this.lastname,
		profilePicture: this.profilePicture,
        _id: this._id 
    };
};

/*
*	validates password on login
*/
AccountSchema.methods.validatePassword = function(password, callback) {
	var pass = this.password;
	
	crypto.pbkdf2(password, this.salt, iterations, keyLength, function(err, hash) {
		if(hash.toString('hex') !== pass) {
			return callback(false);
		}
		return callback(true);
	});
};

//find an account by a username (uses findOne()) -- used on the login page
AccountSchema.statics.findByUsername = function(name, callback) {

    var search = {
        username: name
    };

    return AccountModel.findOne(search, callback);
};

//another find an account by a username (uses find()) -- runs faster on my pages -- I use this on the app and profile pages
AccountSchema.statics.findByUsernameContains = function(name, callback) {

    var search = {
        username: name
    };

    return AccountModel.find(search, callback);
};

/*
*	Used when creating an account
*/
AccountSchema.statics.generateHash = function(password, callback) {
	var salt = crypto.randomBytes(saltLength);
	
	crypto.pbkdf2(password, salt, iterations, keyLength, function(err, hash){
		return callback(salt, hash.toString('hex'));
	});
};

/*
*	Used when checking if an account exists when logging in
*/
AccountSchema.statics.authenticate = function(username, password, callback) {
	return AccountModel.findByUsername(username, function(err, doc) {
		if(err)
		{
			console.log("trouble authenticating");
			return callback(err);
		}

        if(!doc) {
            return callback();
        }

        doc.validatePassword(password, function(result) {
            if(result === true) {
                return callback(null, doc);
            }
            
            return callback();
        });
        
	});
};

/*
AccountSchema.statics.findUsersBySearch = function(searchName, callback) {
	var userSearch = {
        search: searchName
    };
	AccountModel.find(userSearch).select("username").exec(callback);
};*/

AccountModel = mongoose.model('Account', AccountSchema);


module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;