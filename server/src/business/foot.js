/********************************************************************
 * Foot data manipulation layer (teams, matches, stadiums)
 ********************************************************************/
const frw = {
	data: require('../frw/frw.data')
};

const foot = {};
module.exports = foot;

/********************************************************************
 * Retrieve data
 */

foot.getTeams = function (db) {
	return db.collection('teams')
		.find({}, { _id: 0 })
		.sort([['rank', 'asc'], ['name', 'asc']])
		.toArray();
};

foot.getMatches = function (db) {
	return db.collection('matches')
		.find({}, { _id: 0 })
		.sort([['id', 'asc']]) // [[['date', 'asc'], ['id', 'asc']] but needs date objects instead of strings
		.toArray();
};

foot.getStadiums = function (db) {
	return db.collection('stadiums')
		.find({}, { _id: 0 })
		.toArray();
};

foot.getData = function (db) {
	const data = {};
	return foot.getTeams(db)
		.then(function (teams) {
			data.teams = teams;
			return foot.getMatches(db);
		}).then(function (matches) {
			data.matches = matches;
			return foot.getStadiums(db);
		}).then(function (stadiums) {
			data.stadiums = stadiums;
			return data;
		});
};

/******************************************************************************
 * Edit data
 */

/**
 * Update stats and advance to next round
 * @param {object} db
 * @param {integer} mid - the id of the match to be updated
 * @param {integer} score1 - the score of team 1
 * @param {integer} score2 - the score of team 2
 * @param {integer} score1PK - the penalty kicks score of team 1
 * @param {integer} score2PK - the penalty kicks score of team 2
 * @api public
 */
foot.setMatchScore = function (db, mid, score1, score2, score1PK, score2PK) {
	const edit = {
		'team1_score': score1,
		'team2_score': score2,
		'team1_scorePK': score1PK,
		'team2_scorePK': score2PK
	};
	return db.collection('matches')
		.findAndModify({ query: { id: mid }, update: { $set: edit }, new: true })
		.then(function (result) { return result[0]; }) // findAndModify returns [ doc, { whatever } ]
		.then(function (match) {
			if (!match) throw new Error('Match not found: ' + mid);
			delete match._id;
			const data = { matches: [match] };
			if (match.group) {
				// update group results
				return updateGroupStats(db, match.group)
					.then(function (teams) {
						data.teams = teams;
						return data;
					});
			} else if (match.phase !== 'F' && match.phase !== 'T') {
				// update score from final rounds: winner moves forward
				advanceToNextRound(db, match); // do not wait
			}
			return data;
		});
};

/**
 * Manually set ranks in a group. Useful since exact ranking logic is not implemented.
 * @param {object} db
 * @param {string} group - the group id ('A', ...)
 * @param {string[]} ranks - array of teams id in order (['CZE', 'GRE', 'RUS', 'POL'])
 * @api public
 */
foot.setRanks = function (db, group, ranks) {
	const data = { teams: [] };

	// security: the query checks that each team passed is in specified group
	const teams = db.collection('teams');
	for (let i = 0; i < ranks.length; i++) {
		teams.updateOne({ id: ranks[i], group: group }, { $set: { rank: i } }, { w: 0 });
		data.teams.push({ id: ranks[i], rank: i });
	}

	// If all group matches have been played, update first final round
	return db.collection('matches')
		.count({ group: group, team1_score: { $ne: null } })
		.then(function (count) {
			if (count === 6) {
				advanceToFirstRound(db, group, ranks[0], ranks[1]); // do not wait
			}
			return data;
		});
};

/**
 * Update the stats of all teams in a group, to take into account new match results
 * @param {object} db
 * @param {string} group - the group to be updated ('A', 'B', ...)
 */
function updateGroupStats(db, group) {
	let teams;
	return db.collection('teams')
		.find({ group: group }, { id: 1 })
		.toArray()
		.then(t => {
			teams = t;
			return db.collection('matches')
				.find({ group: group, team1_score: { $ne: null } })
				.toArray();
		}).then(matches => {
			const newStats = computeGroupStandings(teams, matches);
			const teamsCol = db.collection('teams');
			for (const t of newStats) {
				teamsCol.updateOne({ _id: t._id }, { $set: t }, { w: 0 });
			}
			if (matches.length === 6) { // 6 matches per group
				advanceToFirstRound(db, group, newStats[0].id, newStats[1].id); // do not wait
			}
			return newStats;
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
	const stats = {};
	for (const team of teams) {
		stats[team.id] = setBlankStats(team);
	}

	// compute the effect of each match played
	for (const m of matches) {
		const team1 = stats[m['team1_id']];
		const team2 = stats[m['team2_id']];
		const score1 = m['team1_score'];
		const score2 = m['team2_score'];

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
	for (const id in stats) {
		const team = stats[id];
		team['goal_difference'] = team['goals_scored'] - team['goals_against'];
	}

	// update ranks by sorting the teams in the group
	frw.data.sort(teams, [
		{ key: 'points', dir: -1 },
		{ key: 'goal_difference', dir: -1 },
		{ key: 'goals_scored', dir: -1 },
		{ key: 'name', dir: 1 } // to get sort stable - if not enough, set ranking manually
	]);

	for (let i = 0; i < teams.length; i++) {
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
 * @param {string} group - group id ('A', 'B', ...)
 * @param {string} team1 - Id of the best team in the group to advance to finals
 * @param {string} team2 - Id of the second team in the group to advance to finals
 */
function advanceToFirstRound(db, group, tid1, tid2) {
	const matches = db.collection('matches');
	matches.updateOne({ 'team1_source': '1' + group }, { $set: { 'team1_id': tid1 } }, { w: 0 });
	matches.updateOne({ 'team2_source': '2' + group }, { $set: { 'team2_id': tid2 } }, { w: 0 });
}

/**
 * In the final phase, once a match is played, advance winner to next round
 * @param {object} db
 * @param {object} match - Match that has been played
 */
function advanceToNextRound(db, match) {
	defineWinner(match);
	const mid = match.id;

	const matches = db.collection('matches');
	matches.updateOne({ 'team1_source': 'W' + mid }, { $set: { 'team1_id': match.winner } }, { w: 0 });
	matches.updateOne({ 'team2_source': 'W' + mid }, { $set: { 'team2_id': match.winner } }, { w: 0 });

	if (match.phase == 'S') { // Loser of semi-final goes forward to third place play-off
		matches.updateOne({ 'team1_source': 'L' + mid }, { $set: { 'team1_id': match.loser } }, { w: 0 });
		matches.updateOne({ 'team2_source': 'L' + mid }, { $set: { 'team2_id': match.loser } }, { w: 0 });
	}
}

function defineWinner(match) {
	const score1 = match['team1_score'];
	const score2 = match['team2_score'];
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
