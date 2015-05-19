//import the controller folder (automatically calls the index.js file)
var controllers = require('./controllers'); 
var mid = require('./middleware');

var router = function(app) {
	app.get("/login", mid.requiresSecure, controllers.Account.loginPage);
	app.get("/register", mid.requiresSecure, controllers.Account.registerPage);
    app.get("/", mid.requiresSecure, controllers.Account.homePage);
	app.get("/app", mid.requiresLogin, controllers.PicMe.appPage);
	app.get("/profilePage/:user", mid.requiresLogin, controllers.PicMe.profilePage);
	app.get("/like", mid.requiresLogin, controllers.PicMe.appPage);
	
	app.post("/register", mid.requiresSecure, mid.requiresLogout, controllers.Account.register);//mid.requiresLogout breaks
	app.post("/login", mid.requiresSecure, controllers.Account.login);
	app.post("/app", mid.requiresLogin, controllers.PicMe.createPost);
	app.post("/delete", mid.requiresLogin, controllers.PicMe.deletePost);
	app.post("/search", mid.requiresLogin, controllers.PicMe.search);
	app.post("/profilePage/:user", mid.requiresLogin, controllers.PicMe.profile);
	app.post("/reload", mid.requiresLogin, controllers.PicMe.reload);
	app.post("/like", mid.requiresLogin, controllers.PicMe.like);
	app.post("/updatePic", mid.requiresLogin, controllers.PicMe.updatePic);
	app.post("/updateLikes", mid.requiresLogin, controllers.PicMe.updateLikes);
};

module.exports = router; 