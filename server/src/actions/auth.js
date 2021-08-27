/******************************************************************************
 * Social Authentication/Authorization Management
 * 
 * Live demo of what Google+ is sending in the profile:
 *  https://developers.google.com/+/api/latest/people/get
 ******************************************************************************/
const fs = require('fs');
const users = require('../business/users');
const auth = require('../business/auth');

const actions = {};
module.exports = actions;

actions.callback = function(request, response/*, ctx*/) {
	fs.readFile('./server/pages/signin.html', { encoding: 'utf8' }, function (err, data) {
		if (err) throw err;
		response.writeHead(200, { 'Content-Type': 'text/html' });
		response.write(data);
		response.end();
	});
};

actions.url = function(request, response/*, ctx*/) {
	response.json({ url: auth.url() });
};

actions.revoke = function(request, response/*, ctx*/) {
	const token = null; // store token somewhere (db, session) to be able to revoke
	auth.revoke(token, function(err/*, result*/) {
		if (err) {
			response.error(500, err);
		} else {
			response.json({});
		}
	});
};

actions.profile = function(request, response, ctx) {
	const query = request.query;
	auth.profile(query.code, (err, profile) => {
		if (err) {
			response.error(500, err);
		} else {
			users.register(ctx.db, profile.emails[0].value, null, 'google', {
				'name': profile.displayName
			})
			.then(user => {
				user.profile = profile;
				request.session.user = user;
				response.json({ user: user });
			})
			.catch(response.error.bind(response, 500))
			.done();
		}
	});
};
