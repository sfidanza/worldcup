/********************************************************************
 * Bets data manipulation layer
 ********************************************************************/
import frw from '../frw/frw.data.js';

const bets = {};
export default bets;

/********************************************************************
 * Retrieve data
 */
	
bets.getBets = function(db) {
	return Promise.all([
			db.collection('users').find({}).toArray(),
			db.collection('bets').find({}, { projection: { _id: false } }).toArray()
		]).then(values => respondList(...values));
};

bets.getLeaderboard = function(db) {
	return Promise.all([
			db.collection('users').find({}).toArray(),
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
 * @param {object} db
 * @param {string} user - the user id that places the bet
 * @param {string} champion - the team id on which to bet
 * @api public
 */
bets.enterChampionBet = function(db, user, champion) {
	return db.collection('bets').updateOne(
		{ user: user, challenge: 'champion' },
		{ $set: { 'value': champion } },
		{ upsert: true }
	);
};

/**
 * Enter a bet for a match
 * @param {object} db
 * @param {string} user - the user id that places the bet
 * @param {integer} mid - the match id to bet on
 * @param {string} winner - the team id on which to bet
 * @api public
 */
bets.enterMatchWinnerBet = function(db, user, mid, winner) {
	return db.collection('matches').findOne({ 'id': mid })
		.then(match => {
			if (!isBettable(match)) {
				throw new Error('Match is not opened to bet!');
			} else if (winner !== match.team1_id && winner !== match.team2_id) {
				throw new Error('You can only bet for one of the two teams playing!');
			}
		}).then(() => {
			return db.collection('bets').findOneAndUpdate(
				{ user: user, challenge: 'match', 'target': mid },
				{ $set: { 'value': winner } },
				{ upsert: true }
			);
		});
};

const isBettable = function(m) {
	return (new Date(m.day + ' ' + m.hour) > Date.now()) && // match is not started
		(m.team1_id && m.team2_id); // both teams are known
};

/**
 * Compute the wins of each better
 * @param {object} db
 * @api public
 */
bets.computeLeaderboard = function(db) {
	return getDataForLeaderboard(db)
		.then(data => {
			const ld = {};
			for (const m of data.matches) {
				const matchBets = data.bets[m.id];
				if (matchBets) {
					const winner = getMatchWinner(m);
					for (const bet of matchBets) {
						if (!ld[bet.user]) ld[bet.user] = { wins: 0, total: 0 };
						const ldUser = ld[bet.user];
						ldUser.user = bet.user;
						ldUser.total++;
						if (bet.value === winner) ldUser.wins++;
					}
				}
			}
			
			const list = [];
			for (const ldUser of ld) {
				ldUser.ratio = 100 * ldUser.wins / ldUser.total;
				list.push(ldUser);
			}
			return storeLeaderboard(db, list);
		});
};

const getDataForLeaderboard = function(db) {
	const data = {};
	return db.collection('bets').find({ challenge: 'match' }).toArray()
		.then(betList => {
			data.bets = frw.data.groupBy(betList, 'target');
			return db.collection('matches').find({ group: null, team1_score: { $ne: null } }).toArray();
		}).then(matchList => {
			data.matches = matchList;
			return data;
		});
};

const getMatchWinner = function(match) {
	const score1 = match['team1_score'];
	const score2 = match['team2_score'];
	if (score1 > score2) {
		return match['team1_id'];
	} else if (score1 < score2) {
		return match['team2_id'];
	} else if (match['team1_scorePK'] > match['team2_scorePK']) {
		return match['team1_id'];
	} else {
		return match['team2_id'];
	}
};

const storeLeaderboard = function(db, list) {
	return db.collection('leaderboard').remove({})
		.then(() => {
			return db.collection('leaderboard').insert(list);
		}).then(() => {
			return list;
		});
};
