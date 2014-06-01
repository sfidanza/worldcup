/******************************************************************************
 * Competition data management
 ******************************************************************************/
var foot = require("../business/foot");
	
var actions = {};
module.exports = actions;

actions.editMatch = function(request, response, ctx) {
	var user = request.session.user;
	if (user && user.isAdmin) {
		var query = request.query;
		foot.setMatchScore(ctx.db,
			+query.mid,
			getScore(query.score1),
			getScore(query.score2),
			respond.bind(null, response));
	} else {
		response.error(401);
	}
};

actions.setRanks = function(request, response, ctx) {
	var user = request.session.user;
	if (user && user.isAdmin) {
		var query = request.query;
		foot.setRanks(ctx.db,
			query.gid,
			query.ranks.split('-'),
			respond.bind(null, response));
	} else {
		response.error(401);
	}
};

/**
 * HTTP response handling
 */
function respond(response, err, data) {
	if (err) {
		response.error(500);
	} else {
		if (data) data.updated = true;
		response.json(data);
	}
}

/**
 * Input validation
 */
function getScore(s) {
	s = (s) ? +s : null; // make sure '' and null do not become 0;
	return (isFinite(s) && s >= 0) ? s : null;
}
