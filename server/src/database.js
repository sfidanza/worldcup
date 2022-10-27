/********************************************************************
 * Database access configuration
 ********************************************************************/

const database = {};
export default database;

database.DB_SESSIONS = 'worldcup-sessions';
database.DB_USERS = 'worldcup-users';

database.VALID_YEARS = {
    '2010': 'worldcup2010',
    '2014': 'worldcup2014',
    '2018': 'worldcup2018',
    '2022': 'worldcup2022'
};
database.getDataAccess = function (dbClient) {
    return (req, res, next) => {
        const year = req.params.year;
        if (year in database.VALID_YEARS) {
            req.database = dbClient.db(database.VALID_YEARS[year]);
            next();
        } else {
            res.status(404).json({ error: 'Not Found' });
        }
    };
};
