/********************************************************************
 * Foot tournament engine
 ********************************************************************/
import frw from '../../frw/frw.data.js';

const foot = {};
export default foot;

foot.MATCHES_PER_GROUP = 6;

foot.defineWinner = function (match) {
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
};

/**
 * Compute the statistics of a group from scratch, for the list of played matches
 * !!NOTE!! Ranking strategy may depend on the tournament
 * @param {object[]} teams - the list of teams in the group (only their id)
 * @param {object[]} matches - the list of played matches
 * @returns {object[]} - the list of updated stats for each team
 */
foot.computeGroupStandings = function (teams, matches) {
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
	for (const team of teams) {
		team['goal_difference'] = team['goals_scored'] - team['goals_against'];
	}

	// update ranks by sorting the teams in the group
	frw.data.sortBy(teams, [
		{ key: 'points', dir: -1 },
		{ key: 'goal_difference', dir: -1 },
		{ key: 'goals_scored', dir: -1 },
		{ key: 'name', dir: 1 } // to get sort stable - if not enough, set ranking manually
	]);

	for (let i = 0; i < teams.length; i++) {
		teams[i]['rank'] = i + 1;
	}

	return teams;
};

/**
 * Get a fresh set of stats for a team
 */
const setBlankStats = function (team) {
	team.points = 0;
	team.played = 0;
	team.victories = 0;
	team.draws = 0;
	team.defeats = 0;
	team.goals_scored = 0;
	team.goals_against = 0;
	team.goal_difference = 0;
	return team;
};
