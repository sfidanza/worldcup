/********************************************************************
 * Import data from source files to DB (teams, matches, stadiums)
 ********************************************************************/
import adapter from './adapter.js';
import fs from 'fs';

const importer = {};
export default importer;

/********************************************************************
 * Preview data from file
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
 * Import data from file to DB
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
	await db.dropDatabase();
	const [teams, stadiums, matches] = await Promise.all([
		importData(db, 'teams', `./data/${edition}-01-teams.js`),
		importData(db, 'stadiums', `./data/${edition}-02-stadiums.js`),
		importData(db, 'matches', `./data/${edition}-03-matches.js`)
	]);
	return { edition, teams, stadiums, matches };
};

/********************************************************************
 * Extract data from FIFA API
 */

const writeData = async function (data, filename) {
	console.log(`Writing ${filename}.json`);
	fs.writeFile(`${filename}.json`, JSON.stringify(data, null, 2), err => {
		if (err) console.error(`Error writing data to ${filename}.json`, err);
	});
};

const getTeamsOnline = async function (sid) {
	const data = {};
	return adapter.getStages(sid)
		.then(stages => {
			data.stages = stages;
			const firstStage = stages.find(s => s.order === 1);
			return adapter.getTeams(sid, firstStage.id);
		}).then(teams => {
			data.teams = teams;
			return data;
		});
};

const getMatchesOnline = async function (sid) {
	return adapter.getPlannedMatches(sid);
};

importer.extract = async function (sid, store = false) {
	return Promise.all([ getTeamsOnline(sid), getMatchesOnline(sid) ])
		.then(([ dataTeams, dataMatches ]) => {
			if (store) {
				writeData(dataTeams, 'extract-01-teams');
				writeData(dataMatches, 'extract-03-matches');
			}
			return Object.assign({}, dataTeams, dataMatches);
		});
};
