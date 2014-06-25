/********************************************************************
 * Bets data manipulation layer
 ********************************************************************/
var frw = {
	data: require("../frw/frw.data")
};

var bets = {};
module.exports = bets;

/********************************************************************
 * Retrieve data
 */
	
bets.getBets = function(db) {
	var users;
	return db.collection('users').find({}).toArray()
		.then(function(userList) {
			users = frw.data.reIndex(userList, 'id');
			return db.collection('bets').find({}, { _id: 0 }).toArray();
		})
		.then(function(betList)  {
			for (var i = 0; i < betList.length; i++) {
				var bet = betList[i];
				var better = users[bet.user];
				if (better) {
					bet.userName = better.name;
				}
			}
			return betList;
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
	return db.collection('bets').findAndModify({
		query: { user: user, challenge: 'champion' },
		update: { $set: { 'value': champion } },
		new: true,
		upsert: true
	});
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

var isBettable = function(m) {
	return (new Date(m.day + " " + m.hour) > Date.now()) && // match is not started
		(m.team1_id && m.team2_id); // both teams are known
};
