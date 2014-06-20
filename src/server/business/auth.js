/******************************************************************************
 * Social Authentication/Authorization Management
 ******************************************************************************/
var googleapis = require('googleapis');
var OAuth2Client = googleapis.OAuth2Client;
var config = require('../settings.js').AUTH;

var auth = {};
module.exports = auth;

auth.url = function() {
	var oauth2Client = new OAuth2Client(config.CLIENT_ID, config.CLIENT_SECRET, config.REDIRECT_URL);
	var url = oauth2Client.generateAuthUrl({
		access_type: 'offline', // will return a refresh token
		scope: [
			'https://www.googleapis.com/auth/plus.me',
			'https://www.googleapis.com/auth/plus.profile.emails.read'
		].join(' ')
	});
	return url;
};

auth.revoke = function(token) {
	var oauth2Client = new OAuth2Client(config.CLIENT_ID, config.CLIENT_SECRET, config.REDIRECT_URL);
	oauth2Client.revokeToken(token, callback);
};

auth.profile = function(code, callback) {
	var oauth2Client = new OAuth2Client(config.CLIENT_ID, config.CLIENT_SECRET, config.REDIRECT_URL);
	oauth2Client.getToken(code, function(err, token) {
		oauth2Client.setCredentials(token);
		getUserProfile(oauth2Client, 'me', callback);
	});
};

function getUserProfile(authClient, userId, callback) {
	googleapis
		.discover('plus', 'v1')
		.execute(function(err, client) {
			if (err) {
				callback(err);
			} else {
				client
					.plus.people.get({ userId: userId })
					.withAuthClient(authClient)
					.execute(callback);
			}
		});
}
