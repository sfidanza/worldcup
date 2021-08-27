/********************************************************************
 * Bets data manipulation layer
 ********************************************************************/
 const frw = {
	data: require('../frw/frw.data')
};

const bets = {};
module.exports = bets;

/********************************************************************
 * Retrieve data
 */
	
bets.getBets = function(db) {
	let users;
	return db.collection('users').find({}).toArray()
		.then(userList => {
			users = frw.data.reIndex(userList, 'id');
			return db.collection('bets').find({}, { _id: 0 }).toArray();
		})
		.then(betList => {
			for (const bet of betList) {
				const better = users[bet.user];
				bet.userName = (better && better.name) || bet.user;
			}
			return betList;
		});
};

bets.getLeaderboard = function(db) {
	let users;
	return db.collection('users').find({}).toArray()
		.then(userList => {
			users = frw.data.reIndex(userList, 'id');
			return db.collection('leaderboard').find({}, { _id: false }).toArray();
		}).then(ldList => {
			for (const ldUser of ldList) {
				const better = users[ldUser.user];
				ldUser.userName = (better && better.name) || ldUser.user;
			}
			return ldList;
		});
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
		.then(function(match) {
			if (!isBettable(match)) {
				throw new Error('Match is not opened to bet!');
			} else if (winner !== match.team1_id && winner !== match.team2_id) {
				throw new Error('You can only bet for one of the two teams playing!');
			}
		}).then(function() {
			return db.collection('bets').findAndModify({
				query: { user: user, challenge: 'match', 'target': mid },
				update: { $set: { 'value': winner } },
				new: true,
				upsert: true
			});
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
