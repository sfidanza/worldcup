/******************************************************************************
 * User Management
 ******************************************************************************/
var authenticate = require("../business/authenticate");

var actions = {};
module.exports = actions;

actions.login = function(request, response, ctx) {
	var query = request.query;
	authenticate(ctx.db, query['id'], query['pwd'], function(err, user) {
		if (err) {
			response.error(500);
		} else {
			request.session.user = user;
			response.json((user && user.login) ? { "user": user.login } : null);
		}
	});
};

actions.logout = function(request, response, ctx) {
	delete request.session.user;
	response.json();
};
