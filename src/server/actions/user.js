/******************************************************************************
 * User Management
 ******************************************************************************/
//var user = require("./business/user");
//$ctx = context::get();
//$db = $ctx->db;
//$user = $ctx->user;

var actions = {};
module.exports = actions;

actions.login = function(parsedRequest) {
	var query = parsedRequest.query;
	user.login(query['user_name'], query['user_pwd']);
	return getUser();
};

actions.logout = function() {
	user.logout();
	return getUser();
};

function getUser() {
	return user.loggedIn ?
		{ "user": user.loggedIn.login } :
		{};
}

//$db->close();
