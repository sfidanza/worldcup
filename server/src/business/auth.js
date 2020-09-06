/******************************************************************************
 * Social Authentication/Authorization Management
 ******************************************************************************/
const { google } = require('googleapis');

const {
	AUTH_CLIENT_ID,
	AUTH_CLIENT_SECRET,
	AUTH_REDIRECT_URL
} = process.env;

var auth = {};
module.exports = auth;

auth.url = function () {
	var oauth2Client = new google.auth.OAuth2(AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_REDIRECT_URL);
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
	var oauth2Client = new google.auth.OAuth2(AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_REDIRECT_URL);
	oauth2Client.revokeToken(token, callback);
};

auth.profile = function (code, callback) {
	var oauth2Client = new google.auth.OAuth2(AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_REDIRECT_URL);
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
