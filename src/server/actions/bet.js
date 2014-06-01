/******************************************************************************
 * Bet management
 ******************************************************************************/
var bets = require("../business/bets");
	
var actions = {};
module.exports = actions;

/**
 * Update Bet
 */
actions.champion = function(request, response, ctx) {
	var user = request.session.user;
	if (user.login) {
		var query = request.query;
		bets.enterChampionBet(ctx.db, user.login, query.champion);
		response.json(getUserBets(user));
	} else {
		response.error(401);
	}
};

actions.match = function(request, response, ctx) {
	var user = request.session.user;
	if (user.login) {
		var query = request.query;
		bets.enterMatchWinnerBet(ctx.db, user.login, query.mid, query.winner);
		response.json(getUserBets(user));
	} else {
		response.error(401);
	}
};

function getUserBets(user) {
	return {
		bets: bets.getBets(user.login),
		updated: true
	};
}
