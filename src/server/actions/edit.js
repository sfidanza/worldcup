/******************************************************************************
 * Competition data management
 ******************************************************************************/
var Foot = require("../business/Foot");
//$ctx = context::get();
//$db = $ctx->db;
//$user = $ctx->user;
	
var actions = {};
module.exports = actions;

actions.editMatch = function(parsedRequest, user, db) {
	if (user.loggedIn.type === UT_ADMIN) {
		var myFoot = new Foot(db);
		var match = parsedRequest.query.match;
		return myFoot.setMatchScore(
			match.id,
			checkedScore(match.score1),
			checkedScore(match.score2)
		);
	}
};

actions.setRanks = function(parsedRequest, user, db) {
	if (user.loggedIn.type === UT_ADMIN) {
		var myFoot = new Foot(db);
		var group = parsedRequest.query.group;
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

//$db->close();
