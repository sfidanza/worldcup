/********************************************************************
 * Bets data manipulation layer
 ********************************************************************/
import httpError from 'http-errors';
import frw from '../frw/frw.data.js';
import leaderboard from './engine/leaderboard.js';

const bets = {};
export default bets;

/********************************************************************
 * Retrieve data
 */

bets.getBets = async function (dbUsers, db) {
	return Promise.all([
		dbUsers.collection('users').find({}).toArray(),
		db.collection('bets').find({}, { projection: { _id: false } }).toArray()
	]).then(values => respondList(...values));
};

bets.getLeaderboard = async function (dbUsers, db) {
	return Promise.all([
		dbUsers.collection('users').find({}).toArray(),
		db.collection('leaderboard').find({}, { projection: { _id: false } }).toArray()
	]).then(values => respondList(...values));
};

const respondList = function (userList, list) {
	const users = frw.data.reIndex(userList, 'id');
	for (const item of list) {
		const better = users[item.user];
		item.userName = (better && better.name) || item.user;
	}
	return list;
};

/******************************************************************************
 * Edit data
 */

/**
 * Enter a bet for champion
 * @param {object} db - the database connection
 * @param {string} user - the user id that places the bet
 * @param {string} champion - the team id on which to bet
 * @api public
 */
bets.enterChampionBet = async function (db, user, champion) {
	return db.collection('bets').updateOne(
		{ user: user, challenge: 'champion' },
		{ $set: { 'value': champion } },
		{ upsert: true }
	);
};

/**
 * Enter a bet for a match
 * @param {object} db - the database connection
 * @param {string} user - the user id that places the bet
 * @param {string} mid - the match id to bet on
 * @param {string} winner - the team id on which to bet
 * @api public
 */
bets.enterMatchWinnerBet = async function (db, user, mid, winner) {
	return db.collection('matches').findOne({ 'id': mid })
		.then(match => {
			if (!match) {
				throw new httpError.UnprocessableEntity('Match is not valid');
			} else if (!isBettable(match)) {
				throw new httpError.UnprocessableEntity('Match is not opened to bet!');
			} else if (winner !== match.team1_id && winner !== match.team2_id) {
				throw new httpError.UnprocessableEntity('You can only bet for one of the two teams playing!');
			}
			return db.collection('bets').findOneAndUpdate(
				{ user: user, challenge: 'match', 'target': mid },
				{ $set: { 'value': winner } },
				{ upsert: true }
			);
		});
};

const isBettable = function (m) {
	return (new Date(m.day + ' ' + m.hour) > Date.now()) && // match is not started
		(m.team1_id && m.team2_id); // both teams are known
};

/**
 * Update the leaderboard according to match results
 * @param {object} db - the database connection
 * @api public
 */
bets.updateLeaderboard = async function (db) {
	const values = await Promise.all([
		db.collection('bets').find({ challenge: 'match' }).toArray(),
		db.collection('matches').find({ group: null, team1_score: { $ne: null } }).toArray()
	]);
	const list = leaderboard.compute(...values);
	if (list?.length > 0) {
		await db.collection('leaderboard').deleteMany({});
		await db.collection('leaderboard').insertMany(list);
	}
	return list;
};
