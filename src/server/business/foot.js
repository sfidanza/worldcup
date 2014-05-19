var teams = require("./data/teams.json");
var matches = require("./data/matches.json");
var stadiums = require("./data/stadiums.json");

exports.getTeams = function() {
	return teams;
};

exports.getMatches = function() {
	return matches;
};

exports.getStadiums = function() {
	return stadiums;
};
