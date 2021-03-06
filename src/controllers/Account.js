var models = require('../models');
var Account = models.Account;

//render the home page
var homePage = function(req, res) {
	res.render('homepage');
};

//renders the login page
var loginPage = function(req, res) {
	res.render('login');
};
//renders the register page
var registerPage = function(req, res) {
	res.render('register');
};

var login = function(req, res) {
	//get the username and password from the page
	var username = req.body.username;
	var pass = req.body.pass;
	
	//if they did not fill in the username or password
	if (!username || !pass){
		console.log("Wrong username or password");
	}
	
	//check if the account exists
	Account.AccountModel.authenticate(username, pass, function(err, account) {
		if(err) {
			return;
		}
		if(!account) {
			return;
		}
		//otherwise, get the info from the account 
		req.session.account = account.toAPI();
		
		res.json({redirect: '/app'});
	});
};

//handle signup
var register = function(req, res) {
	//check to see if we filled in everything
	if(!req.body.username || !req.body.firstname || !req.body.lastname || !req.body.pass || !req.body.repeatpass) {
		return;
	}
	//check to see if our passwords match
	if(req.body.pass !== req.body.repeatpass) {
		return;
	}
	Account.AccountModel.generateHash(req.body.pass, function(salt, hash) {
		//create a json object with our account data
		var accountData = {
			username: req.body.username,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			profilePicture: req.body.pictureRegister,
			salt: salt, 
			password: hash
		};
		
		//create an account with our account data
		var newAccount = new Account.AccountModel(accountData);
		
		//save our account
		newAccount.save(function(err) {
			if(err){
				return;
			}
			//get our account info for the session like we do when we login
			req.session.account = newAccount.toAPI();
			
			//redirect to the /app page
			res.json({redirect: '/app'});
		});
	});
};

module.exports.homePage = homePage;
module.exports.loginPage = loginPage;
module.exports.registerPage = registerPage;
module.exports.login = login;
module.exports.register = register;