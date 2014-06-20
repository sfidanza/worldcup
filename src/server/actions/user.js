/******************************************************************************
 * User Management
 ******************************************************************************/
var users = require("../business/users");

var actions = {};
module.exports = actions;

actions.register = function(request, response, ctx) {
	var query = request.query;
	users.register(ctx.db, query['id'], query['pwd'], 'native', { 'name': query['name'] })
		.then(function(user) {
			request.session.user = user;
			response.json((user && user.login) ? { "user": user } : null);
		})
		.catch(response.error.bind(response, 500))
		.done();
};

actions.login = function(request, response, ctx) {
	var query = request.query;
	users.authenticate(ctx.db, query['id'], query['pwd'])
		.then(function(user) {
			request.session.user = user;
			response.json((user && user.login) ? { "user": user } : null);
		})
		.catch(response.error.bind(response, 500))
		.done();
};

actions.changePassword = function(request, response, ctx) {
	var query = request.query;
	users.register(ctx.db, query['id'], query['pwd'], 'native', { 'pwd': query['newPwd'] })
		.then(function(user) {
			request.session.user = user;
			response.json((user && user.login) ? { "user": user } : null);
		})
		.catch(response.error.bind(response, 500))
		.done();
};

actions.logout = function(request, response, ctx) {
	delete request.session.user;
	response.json();
};
