/******************************************************************************
 * Bet management
 ******************************************************************************/
var Bets = require("../business/Bets");
//$ctx = context::get();
//$db = $ctx->db;
//$user = $ctx->user;
	
var actions = {};
module.exports = actions;

/**
 * Update Bet
 */
actions.champion = function(parsedRequest, user, db) {
	if (user.loggedIn) {
		var myBets = new Bets(db);
		var query = parsedRequest.query;
		myBets.enterChampionBet(user.loggedIn.login, query.champion);
		return getUserBets(user);
	}
};

actions.match = function(parsedRequest, user, db) {
	if (user.loggedIn) {
		var myBets = new Bets(db);
		var query = parsedRequest.query;
		myBets.enterMatchWinnerBet(user.loggedIn.login, query.mid, query.winner);
		return getUserBets(user);
	}
};

function getUserBets(user) {
	return {
		bets: myBets.getBets(user.loggedIn.login),
		updated: true
	};
}

//$db->close();
