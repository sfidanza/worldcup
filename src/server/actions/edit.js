/******************************************************************************
 * Competition data management
 ******************************************************************************/
var Foot = require("../business/Foot");
	
var actions = {};
module.exports = actions;

actions.editMatch = function(ctx, response) {
	if (ctx.user.loggedIn.type === UT_ADMIN) {
		var myFoot = new Foot(ctx.db);
		var match = ctx.request.query.match;
		return myFoot.setMatchScore(
			match.id,
			checkedScore(match.score1),
			checkedScore(match.score2)
		);
	}
};

actions.setRanks = function(ctx, response) {
	if (ctx.user.loggedIn.type === UT_ADMIN) {
		var myFoot = new Foot(ctx.db);
		var group = ctx.request.query.group;
		return myFoot.setRanks(
			group.id,
			group.ranks.split('-')
		);
	}
};

/**
 * Input validation
 */
	 
function checkedScore(s) {
	s = +s;
	return (isFinite(s) && s >= 0) ? s : null;
}
