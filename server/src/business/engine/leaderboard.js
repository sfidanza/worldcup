/********************************************************************
 * Leaderbord computation engine
 ********************************************************************/
import frw from '../../frw/frw.data.js';

const leaderboard = {};
export default leaderboard;

/**
 * Compute the wins of each better according to played matches in the final tournament phase
 * @param {object} bets - the list of bets entered by users on final phase matches
 * @param {object} matches - the list of matches played
 * @api public
 */
leaderboard.compute = function(bets, matches) {
	bets = frw.data.groupBy(bets, 'target');

	const ld = {};
	for (const m of matches) {
		const matchBets = bets[m.id];
		if (matchBets) {
			const winner = getMatchWinner(m);
			for (const bet of matchBets) {
				if (!ld[bet.user]) ld[bet.user] = { user: bet.user, wins: 0, total: 0 };
				const ldUser = ld[bet.user];
				ldUser.total++;
				if (bet.value === winner) ldUser.wins++;
			}
		}
	}

	const list = [];
	for (const ldId in ld) {
		const ldUser = ld[ldId];
		ldUser.ratio = 100 * ldUser.wins / ldUser.total;
		list.push(ldUser);
	}
	return list;
};

const getMatchWinner = function(match) {
	const score1 = match['team1_score'];
	const score2 = match['team2_score'];
	if (score1 > score2) {
		return match['team1_id'];
	} else if (score1 < score2) {
		return match['team2_id'];
	} else if (match['team1_scorePK'] > match['team2_scorePK']) {
		return match['team1_id'];
	} else {
		return match['team2_id'];
	}
};
