/******************************************************************************
 * Social Authentication/Authorization Management
 ******************************************************************************/
var config = require('../settings.js').AUTH;
const { google } = require('googleapis');

var auth = {};
module.exports = auth;

auth.url = function () {
	var oauth2Client = new google.auth.OAuth2(config.CLIENT_ID, config.CLIENT_SECRET, config.REDIRECT_URL);
	var url = oauth2Client.generateAuthUrl({
		access_type: 'offline', // will return a refresh token
		scope: [
			'https://www.googleapis.com/auth/plus.me',
			'https://www.googleapis.com/auth/plus.profile.emails.read'
		].join(' ')
	});
	return url;
};

auth.revoke = function (token) {
	var oauth2Client = new google.auth.OAuth2(config.CLIENT_ID, config.CLIENT_SECRET, config.REDIRECT_URL);
	oauth2Client.revokeToken(token, callback);
};

auth.profile = function (code, callback) {
	var oauth2Client = new google.auth.OAuth2(config.CLIENT_ID, config.CLIENT_SECRET, config.REDIRECT_URL);
	oauth2Client.getToken(code, function (err, token) {
		oauth2Client.setCredentials(token);
		getUserProfile(oauth2Client, 'me', callback);
	});
};

function getUserProfile(authClient, userId, callback) {
	google
		.discover('plus', 'v1')
		.execute(function (err, client) {
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
