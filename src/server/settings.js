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
		COOKIE_SEED: "There can be only two: an Apprentice and a Master."
	};
}

/**
 * Add non-sensitive settings
 */

/****/

module.exports = settings;