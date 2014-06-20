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
	return db.collection('users').find({}, { _id: 0 }).toArray()
		.then(function(userList) {
			users = frw.data.reIndex(userList, function(user) {
				return user.type + "-" + user.login;
			});
			return db.collection('bets').find({}, { _id: 0 }).toArray();
		})
		.then(function(betList)  {
			for (var i = 0; i < betList.length; i++) {
				var bet = betList[i];
				var better = users[bet.userType + "-" + bet.user];
				if (better && better.name) {
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
 * @param {integer} user - the user login that places the bet
 * @param {integer} champion - the team id on which to bet
 * @api public
 */
bets.enterChampionBet = function(db, user, userType, champion) {
	return db.collection('bets').findAndModify({
		query: { user: user, userType: userType, challenge: 'champion' },
		update: { $set: { 'value': champion } },
		new: true,
		upsert: true
	});
};
