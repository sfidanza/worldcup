/********************************************************************
 * Bets data manipulation layer
 ********************************************************************/
var fs = require("fs");

var bets = {};
module.exports = bets;

/********************************************************************
 * Retrieve data
 */
	
bets.getBets = function(db) {
	return db.collection('bets').find({}, { _id: 0 })
		.toArray();
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
bets.enterChampionBet = function(db, user, champion) {
	return db.collection('bets').findAndModify({
		query: { user: user, challenge: 'champion' },
		update: { $set: { 'value': champion } },
		new: true,
		upsert: true
	});
};
