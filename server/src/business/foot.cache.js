const teams = require('./data/teams.json');
const matches = require('./data/matches.json');
const stadiums = require('./data/stadiums.json');

const foot = {};
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
		'teams': foot.getTeams(),
		'matches': foot.getMatches(),
		'stadiums': foot.getStadiums()
	};
};
