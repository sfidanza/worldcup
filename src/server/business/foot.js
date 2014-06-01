/********************************************************************
 * Foot data manipulation layer (teams, matches, stadiums)
 ********************************************************************/
var fs = require("fs");
var frw = {
	data: require("../frw/frw.data")
};

var foot = {};
module.exports = foot;

/********************************************************************
 * Retrieve data
 */
	
foot.getTeams = function(db, callback) {
	db.collection('teams').find({}, { _id: 0 })
		.sort([['rank', 'asc'], ['name', 'asc']])
		.toArray(callback);
};

foot.getMatches = function(db, callback) {
	db.collection('matches').find({}, { _id: 0 })
		.sort([['id', 'asc']]) // [[['date', 'asc'], ['id', 'asc']] but needs date objects instead of strings
		.toArray(callback);
};

foot.getStadiums = function(db, callback) {
	db.collection('stadiums').find({}, { _id: 0 }).toArray(callback);
};

foot.getData = function(db, callback) {
	foot.getTeams(db, function(err, teams) {
		if (err) {
			callback(err);
		} else {
			foot.getMatches(db, function(err, matches) {
				if (err) {
					callback(err);
				} else {
					foot.getStadiums(db, function(err, stadiums) {
						if (err) {
							callback(err);
						} else {
							var data = {
								"teams": teams,
								"matches": matches,
								"stadiums": stadiums
							};
							callback(null, data);
						}
					});
				}
			});
		}
	});
};

// Using Promise...
//foot.getData = function(db, callback) {
//	var data = {};
//	foot.getTeams(db)
//		.then(function(teams) {
//			data.teams = teams;
//			return foot.getMatches(db);
//		}).then(function(matches) {
//			data.matches = matches;
//			return foot.getStadiums(db);
//		}).then(function(stadiums) {
//			data.stadiums = stadiums;
//			callback(null, data);
//		}).catch(callback).done();
//};

/******************************************************************************
 * Edit data
 */
	
/**
 * Update stats and advance to next round
 * @param {object} db
 * @param {integer} mid - the id of the match to be updated
 * @param {integer} score1 - the score of team 1
 * @param {integer} score2 - the score of team 2
 * @param {function} callback
 * @api public
 */
foot.setMatchScore = function(db, mid, score1, score2, callback) {
	var edit = {
		'team1_score': score1,
		'team2_score': score2
	};
	db.collection('matches').findAndModify({ id: mid }, 'id', { $set: edit }, { 'new': true }, function(err, match) {
		if (err || !match) {
			callback(err);
		} else {
			delete match._id;
			var data = { matches: [ match ] };
			if (match.group) {
				// update group results
				updateGroupStats(db, match.group, function(err, teams) {
					data.teams = teams;
					callback(err, data);
				});
			} else if (match.phase !== 'F' && match.phase !== 'T') {
				// update score from final rounds: winner moves forward
				advanceToNextRound(db, match);
				callback(null, data);
			} else {
				callback(null, data);
			}
		}
	});
};

/**
 * Manually set ranks in a group. Useful since exact ranking logic is not implemented.
 * @param {object} db
 * @param {string} group - the group id ('A', ...)
 * @param {string[]} ranks - array of teams id in order (['CZE', 'GRE', 'RUS', 'POL'])
 * @param {function} callback
 * @api public
 */
foot.setRanks = function(db, group, ranks, callback) {
	var data = { teams: [] };
	
	// TODO: no security -- should check all teams passed are in specified group
	var teams = db.collection('teams');
	for (var i = 0; i < ranks.length; i++) {
		teams.update({ id: ranks[i] }, { $set: { rank: i } }, { w : 0 });
		data.teams.push({ id: ranks[i], rank: i });
	}
	
	// If all group matches have been played, update first final round
	var matches = db.collection('matches');
	matches.count({ group: group, team1_score: { $ne: null } }, function(err, count) {
		if (count === 6) {
			advanceToFirstRound(db, group, ranks[0], ranks[1]);
		}
		callback(null, data);
	});
};

/**
 * Update the stats of all teams in a group, to take into account new match results
 * @param {object} db
 * @param {string} group - the group to be updated ('A', 'B', ...)
 * @param {function} callback
 */
function updateGroupStats(db, group, callback) {
	db.collection('teams').find({ group: group }, { id: 1 }).toArray(function(err1, teams) {
		db.collection('matches')
			.find({ group: group, team1_score: { $ne: null } })
			.toArray(function(err2, matches) {
				if (err1 || err2) {
					callback(err1 || err2);
				} else {
					var newStats = computeGroupStandings(teams, matches);
					var teamsCol = db.collection('teams');
					for (var i = 0; i < newStats.length; i++) {
						var t = newStats[i];
						teamsCol.update({ _id: t._id }, { $set: t }, { w : 0 });
					}
					if (matches.length === 6) { // 6 matches per group
						advanceToFirstRound(db, group, newStats[0].id, newStats[1].id);
					}
					callback(null, newStats);
				}
		});
	});
}

/**
 * Compute the statistics of a group from scratch, for the list of played matches
 * @param {object[]} teams - the list of teams in the group (only their id)
 * @param {object[]} matches - the list of played matches
 * @returns {object[]} - the list of updated stats for each team
 */
function computeGroupStandings(teams, matches) {
	// start with fresh data
	var stats = {};
	for (var i = 0; i < teams.length; i++) {
		var team = teams[i];
		stats[team.id] = setBlankStats(team);
	}
	
	// compute the effect of each match played
	for (var i = 0; i < matches.length; i++) {
		var m = matches[i];
		var team1 = stats[m['team1_id']];
		var team2 = stats[m['team2_id']];
		var score1 = m['team1_score'];
		var score2 = m['team2_score'];
		
		team1['played']++;
		team2['played']++;
		
		team1['goals_scored'] += score1;
		team2['goals_scored'] += score2;
		team1['goals_against'] += score2;
		team2['goals_against'] += score1;
		
		if (score1 > score2) {
			team1['victories']++;
			team2['defeats']++;
			team1['points'] += 3;
		} else if (score1 < score2) {
			team1['defeats']++;
			team2['victories']++;
			team2['points'] += 3;
		} else {
			team1['draws']++;
			team2['draws']++;
			team1['points'] += 1;
			team2['points'] += 1;
		}
	}
	
	// update goal difference for each team
	for (var id in stats) {
		var team = stats[id];
		team['goal_difference'] = team['goals_scored'] - team['goals_against'];
	}
	
	// update ranks by sorting the teams in the group
	frw.data.sort(teams, [
		{ key: 'points', dir: -1 },
		{ key: 'goal_difference', dir: -1 },
		{ key: 'goals_scored', dir: -1 },
		{ key: 'name', dir: 1 } // to get sort stable - if not enough, set ranking manually
	]);
	
	for (var i = 0; i < teams.length; i++) {
		teams[i]['rank'] = i + 1;
	}
	
	return teams;
}

/**
 * Get a fresh set of stats for a team
 */
function setBlankStats(team) {
	team.points = 0;
	team.played = 0;
	team.victories = 0;
	team.draws = 0;
	team.defeats = 0;
	team.goals_scored = 0;
	team.goals_against = 0;
	team.goal_difference = 0;
	return team;
}

/**
 * Once a group has played all 6 matches, first 2 teams go to final phase
 * @param {object} db
 * @param {string} group - group id ("A", "B", ...)
 * @param {string} team1 - Id of the best team in the group to advance to finals
 * @param {string} team2 - Id of the second team in the group to advance to finals
 */
function advanceToFirstRound(db, group, tid1, tid2) {
	var matches = db.collection('matches');
	matches.update({ 'team1_source': '1' + group }, { $set: { 'team1_id': tid1 } }, { w : 0 });
	matches.update({ 'team2_source': '2' + group }, { $set: { 'team2_id': tid2 } }, { w : 0 });
}

/**
 * In the final phase, once a match is played, advance winner to next round
 * @param {object} db
 * @param {object} match - Match that has been played
 */
function advanceToNextRound(db, match) {
	defineWinner(match);
	var mid = match.id;
	
	var matches = db.collection('matches');
	matches.update({ 'team1_source': 'W' + mid }, { $set: { 'team1_id': match.winner } }, { w : 0 });
	matches.update({ 'team2_source': 'W' + mid }, { $set: { 'team2_id': match.winner } }, { w : 0 });
	
	if (match.phase == 'S') { // Loser of semi-final goes forward to third place play-off
		matches.update({ 'team1_source': 'L' + mid }, { $set: { 'team1_id': match.loser } }, { w : 0 });
		matches.update({ 'team2_source': 'L' + mid }, { $set: { 'team2_id': match.loser } }, { w : 0 });
	}
}

function defineWinner(match) {
	var score1 = match['team1_score'];
	var score2 = match['team2_score'];
	if (score1 > score2) {
		match.winner = match['team1_id'];
		match.loser = match['team2_id'];
	} else if (score1 < score2) {
		match.winner = match['team2_id'];
		match.loser = match['team1_id'];
	} else if (match['team1_scorePK'] > match['team2_scorePK']) {
		match.winner = match['team1_id'];
		match.loser = match['team2_id'];
	} else {
		match.winner = match['team2_id'];
		match.loser = match['team1_id'];
	}
}
