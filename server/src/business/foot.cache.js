var teams = require("./data/teams.json");
var matches = require("./data/matches.json");
var stadiums = require("./data/stadiums.json");

var foot = {};
module.exports = foot;

foot.getTeams = function() {
	return teams;
};

foot.getMatches = function() {
	return matches;
};

foot.getStadiums = function() {
	return stadiums;
};

foot.getData = function() {
	return {
		"teams": foot.getTeams(),
		"matches": foot.getMatches(),
		"stadiums": foot.getStadiums()
	};
};
