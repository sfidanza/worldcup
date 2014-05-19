var foot = require("./business/foot");
var views = {};
module.exports = views;

views.data = function() {
	return {
		"teams": foot.getTeams(),
		"matches": foot.getMatches(),
		"stadiums": foot.getStadiums()
	};
};
