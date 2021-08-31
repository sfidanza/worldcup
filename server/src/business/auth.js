/******************************************************************************
 * Social Authentication/Authorization Management
 * https://www.npmjs.com/package/googleapis#oauth2-client
 * https://googleapis.dev/nodejs/googleapis/latest/people/classes/Resource$People.html#get
 ******************************************************************************/
import { google } from 'googleapis';

const {
	AUTH_CLIENT_ID,
	AUTH_CLIENT_SECRET,
	AUTH_REDIRECT_URL
} = process.env;

const auth = {};
export default auth;

auth.url = function () {
	const oauth2Client = new google.auth.OAuth2(AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_REDIRECT_URL);
	const url = oauth2Client.generateAuthUrl({
		access_type: 'offline', // will return a refresh token
		scope: 'profile'
	});
	return url;
};

auth.revoke = function (token) {
	const oauth2Client = new google.auth.OAuth2(AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_REDIRECT_URL);
	return oauth2Client.revokeToken(token);
};

auth.profile = async function (code) {
	const oauth2Client = new google.auth.OAuth2(AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_REDIRECT_URL);
	const { tokens } = await oauth2Client.getToken(code);
	oauth2Client.setCredentials(tokens);
	return getUserProfile(oauth2Client);
};

async function getUserProfile(authClient) {
	const service = google.people({ version: 'v1', auth: authClient });
	const result = await service.people.get({
		resourceName: 'people/me',
		personFields: 'names,emailAddresses,photos',
	});
	return result.data;
}
