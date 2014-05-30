/******************************************************************************
 * User Management
 ******************************************************************************/
//var user = require("../business/user");

var actions = {};
module.exports = actions;

actions.login = function(ctx, response) {
	var query = ctx.request.query;
	ctx.user.login(query['user_name'], query['user_pwd']);
	return getPublicUser(ctx.user);
};

actions.logout = function(ctx, response) {
	ctx.user.logout();
	return getPublicUser(ctx.user);
};

function getPublicUser(user) {
	return user.loggedIn ?
		{ "user": user.loggedIn.login } :
		{};
}
