/********************************************************************
 * Import data from source files to DB (teams, matches, stadiums)
 ********************************************************************/
const importer = {};
export default importer;

/********************************************************************
 * Preview data
 */

const getData = async function (source) {
	return import(source).then(({ default: data }) => data);
};

importer.preview = async function (db) {
	const edition = db.databaseName;
	return Promise.all([
		getData(`./data/${edition}-01-teams.js`),
		getData(`./data/${edition}-02-stadiums.js`),
		getData(`./data/${edition}-03-matches.js`)
	]).then(([teams, stadiums, matches]) => { return { edition, teams, stadiums, matches }; });
};

/********************************************************************
 * Import data
 */

const importData = async function (db, collection, source) {
	return Promise.all([db.createCollection(collection), getData(source)])
		.then(([coll, data]) => {
			coll.insertMany(data);
			return data;
		});
};

importer.import = async function (db) {
	const edition = db.databaseName;
	return Promise.all([
		importData(db, 'teams', `./data/${edition}-01-teams.js`),
		importData(db, 'stadiums', `./data/${edition}-02-stadiums.js`),
		importData(db, 'matches', `./data/${edition}-03-matches.js`)
	]).then(([teams, stadiums, matches]) => { return { edition, teams, stadiums, matches }; });
};
