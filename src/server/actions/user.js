/******************************************************************************
 * User Management
 ******************************************************************************/
//var user = require("../business/user");
//$ctx = context::get();
//$db = $ctx->db;
//$user = $ctx->user;

var actions = {};
module.exports = actions;

actions.login = function(parsedRequest, user) {
	var query = parsedRequest.query;
	user.login(query['user_name'], query['user_pwd']);
	return getPublicUser(user);
};

actions.logout = function(parsedRequest, user) {
	user.logout();
	return getPublicUser(user);
};

function getPublicUser(user) {
	return user.loggedIn ?
		{ "user": user.loggedIn.login } :
		{};
}

//$db->close();
