/********************************************************************
 * Database access configuration
 ********************************************************************/

const database = {};
export default database;

database.DB_SESSIONS = 'worldcup-sessions';
database.DB_USERS = 'worldcup-users';

/**
 * Data from DB
 */
database.VALID_YEARS = {
	// worldcup
	'1998': 'worldcup1998',
	'2002': 'worldcup2002',
	'2006': 'worldcup2006',
	'2010': 'worldcup2010',
	'2014': 'worldcup2014',
	'2018': 'worldcup2018',
	'2022': 'worldcup2022',
	'2026': 'worldcup2026',
	// euro
	'2008': 'euro2008',
	'2012': 'euro2012',
	'2016': 'euro2016',
	'2020': 'euro2020',
	'2024': 'euro2024',
	// club world cup
	'2025': 'cwc2025'
};

/**
 * Data from light files
 */
database.LIGHT_YEARS = {
	// worldcup
	'1994': 'worldcup1994',
	'1990': 'worldcup1990',
	'1986': 'worldcup1986',
	'1982': 'worldcup1982',
	'1978': 'worldcup1978',
	'1974': 'worldcup1974',
	'1970': 'worldcup1970',
	'1966': 'worldcup1966',
	'1962': 'worldcup1962',
	'1958': 'worldcup1958',
	'1954': 'worldcup1954',
	'1950': 'worldcup1950',
	'1938': 'worldcup1938',
	'1934': 'worldcup1934',
	'1930': 'worldcup1930'
};

database.getDataAccess = function (dbClient) {
	return (req, res, next) => {
		const year = req.params.year;
		if (year in database.VALID_YEARS) {
			req.database = dbClient.db(database.VALID_YEARS[year]);
			next();
		} else if (year in database.LIGHT_YEARS) {
			req.light = database.LIGHT_YEARS[year];
			next();
		} else {
			res.status(404).json({ error: 'Not Found' });
		}
	};
};
