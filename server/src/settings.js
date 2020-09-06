var fs = require('fs');
var settings;

/**
 * Load settings from a private config file.
 * Define defaults if the config file is not present.
 */
if (fs.existsSync(__dirname + '/env/config.json')) {
	settings = require('./env/config.json');
} else {
	settings = {
		"COOKIE_SEED": "There can be only two: an Apprentice and a Master.",
		"AUTH": {
			// these are from the Google API console web interface
			// https://code.google.com/apis/console
			// (section CLient ID for installed Application)
			"CLIENT_ID": "xxxxxxxxxxxx.apps.googleusercontent.com",
			"CLIENT_SECRET": "xxxxxxxx_xxxxxxxxxxxxxxx",
			"REDIRECT_URL": "/api/auth/callback"
		}
	};
}

/**
 * Add non-sensitive settings
 */

/****/

module.exports = settings;