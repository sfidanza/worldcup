/******************************************************************************
 * Competition data management
 ******************************************************************************/
var foot = require("../business/foot");
var bets = require("../business/bets");
	
var actions = {};
module.exports = actions;

actions.editMatch = function(request, response, ctx) {
	var user = request.session.user;
	if (user && user.isAdmin) {
		var query = request.query;
		foot.setMatchScore(ctx.db, +query.mid, getScore(query.score1), getScore(query.score2),
				getScore(query.score1PK), getScore(query.score2PK))
			.then(function(data) {
				bets.computeLeaderboard(ctx.db); // do not wait
				return data;
			})
			.then(response.json.bind(response))
			.catch(response.error.bind(response, 500))
			.done();
	} else {
		response.error(401);
	}
};

actions.setRanks = function(request, response, ctx) {
	var user = request.session.user;
	if (user && user.isAdmin) {
		var query = request.query;
		foot.setRanks(ctx.db, query.gid, query.ranks.split('-'))
			.then(response.json.bind(response))
			.catch(response.error.bind(response, 500))
			.done();
	} else {
		response.error(401);
	}
};

/**
 * Input validation
 */
function getScore(s) {
	s = (s) ? +s : null; // make sure '' and null do not become 0;
	return (isFinite(s) && s >= 0) ? s : null;
}
