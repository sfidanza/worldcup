var fs = require('fs');

/**
 * Load settings from a private config file.
 * Define defaults if the config file is not present.
 */
var settings;
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
settings.userTypes = {
	'UT_CONTRIBUTOR': 1,
	'UT_ADMIN': 16
};

module.exports = settings;