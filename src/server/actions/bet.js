/******************************************************************************
 * Bet management
 ******************************************************************************/
var Bets = require("../business/Bets");
	
var actions = {};
module.exports = actions;

/**
 * Update Bet
 */
actions.champion = function(ctx, response) {
	var user = ctx.user;
	if (user.loggedIn) {
		var myBets = new Bets(ctx.db);
		var query = ctx.request.query;
		myBets.enterChampionBet(user.loggedIn.login, query.champion);
		return getUserBets(user);
	}
};

actions.match = function(ctx, response) {
	var user = ctx.user;
	if (user.loggedIn) {
		var myBets = new Bets(ctx.db);
		var query = ctx.request.query;
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
