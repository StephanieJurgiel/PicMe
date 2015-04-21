//import the controller folder (automatically calls the index.js file)
var controllers = require('./controllers'); 
var mid = require('./middleware');

var router = function(app) {
	app.get("/login", mid.requiresSecure, controllers.Account.loginPage);
	app.get("/register", mid.requiresSecure, controllers.Account.registerPage);
    app.get("/", mid.requiresSecure, controllers.Account.homePage);
	app.get("/app", mid.requiresLogin, controllers.PicMe.appPage);
	
	app.post("/register", mid.requiresSecure, mid.requiresLogout, controllers.Account.register);//mid.requiresLogout breaks
	app.post("/login", mid.requiresSecure, controllers.Account.login);
	app.post("/app", mid.requiresLogin, controllers.PicMe.createPost);
};

module.exports = router; 