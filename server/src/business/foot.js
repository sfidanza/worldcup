/********************************************************************
 * Foot data manipulation layer (teams, matches, stadiums)
 ********************************************************************/
import engine from './engine/foot.js';
import httpError from 'http-errors';

const foot = {};
export default foot;

/********************************************************************
 * Retrieve data
 */

foot.getTeams = async function (db) {
	return db.collection('teams')
		.find({}, { projection: { _id: false }, sort: [['rank', 'asc'], ['name', 'asc']] })
		.toArray();
};

foot.getMatches = async function (db) {
	return db.collection('matches')
		.find({}, { projection: { _id: false }, sort: [['id', 'asc']] })
		.toArray();
};

foot.getStadiums = async function (db) {
	return db.collection('stadiums')
		.find({}, { projection: { _id: false } })
		.toArray();
};

foot.getData = async function (db) {
	return Promise.all([ foot.getTeams(db), foot.getMatches(db), foot.getStadiums(db) ])
		.then(([ teams, matches, stadiums ]) => { return { teams, matches, stadiums }; });
};

/******************************************************************************
 * Edit data
 */

/**
 * Update stats and advance to next round
 * @param {object} db
 * @param {string} mid - the id of the match to be updated
 * @param {integer} score1 - the score of team 1
 * @param {integer} score2 - the score of team 2
 * @param {integer} score1PK - the penalty kicks score of team 1
 * @param {integer} score2PK - the penalty kicks score of team 2
 * @api public
 */
foot.setMatchScore = async function (db, mid, score1, score2, score1PK, score2PK) {
	const edit = {
		'team1_score': score1,
		'team2_score': score2,
		'team1_scorePK': score1PK,
		'team2_scorePK': score2PK
	};
	return db.collection('matches')
		.findOneAndUpdate({ id: mid }, { $set: edit }, { returnDocument: 'after' })
		.then(result => {
			const match = result.value;
			if (!match) throw new httpError.NotFound(`Match id ${mid} not found`);
			delete match._id;
			const data = { matches: [match] };
			if (match.group) {
				// update group results
				return this.updateGroupStats(db, match.group)
					.then(teams => {
						data.teams = teams;
						return data;
					});
			} else if (match.phase !== 'F' && match.phase !== 'T') {
				// update score from final rounds: winner moves forward
				advanceToNextRound(db, match); // no wait needed
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
foot.setRanks = async function (db, group, ranks) {
	const data = { teams: [] };

	// security: the query checks that each team passed is in the specified group
	const teams = db.collection('teams');
	for (let i = 0; i < ranks.length; i++) {
		teams.updateOne({ id: ranks[i], group: group }, { $set: { rank: i } });
		data.teams.push({ id: ranks[i], rank: i });
	}

	// If all group matches have been played, update first final round
	return db.collection('matches')
		.count({ group: group, team1_score: { $ne: null } })
		.then(count => {
			if (count === engine.MATCHES_PER_GROUP) {
				advanceToFirstRound(db, group, ranks[0], ranks[1]); // no wait needed
			}
			return data;
		});
};

/**
 * Update the stats of all teams in a group, to take into account new match results
 * @param {object} db
 * @param {string} group - the group to be updated ('A', 'B', ...)
 * @param {object} options
 * @param {boolean} options.noPromotion - do not promote best teams to next round
 */
foot.updateGroupStats = async function (db, group, options) {
	return Promise.all([
		db.collection('teams').find({ group: group }, { id: true }).toArray(),
		db.collection('matches').find({ group: group, team1_score: { $ne: null } }).toArray()
	]).then(([ teams, matches ]) => {
		const newStats = engine.computeGroupStandings(teams, matches);
		for (const t of newStats) {
			db.collection('teams').updateOne({ _id: t._id }, { $set: t });
		}
		if (!options?.noPromotion && matches.length === engine.MATCHES_PER_GROUP) {
			advanceToFirstRound(db, group, newStats[0].id, newStats[1].id); // no wait needed
		}
		return newStats;
	});
};

/**
 * Once a group has played all group matches, first 2 teams go to knockout phase
 * @param {object} db
 * @param {string} group - group id ('A', 'B', ...)
 * @param {string} tid1 - Id of the best team in the group to advance to knockout
 * @param {string} tid2 - Id of the second team in the group to advance to knockout
 */
function advanceToFirstRound(db, group, tid1, tid2) {
	const matches = db.collection('matches');
	matches.updateOne({ 'team1_source': '1' + group }, { $set: { 'team1_id': tid1 } }); // 1X is only hosting in knockout first round (16, 24, 32 teams)
	matches.updateOne({ 'team1_source': '2' + group }, { $set: { 'team1_id': tid2 } }); // 2X may host in some formats (e.g. 24 teams)
	matches.updateOne({ 'team2_source': '2' + group }, { $set: { 'team2_id': tid2 } });
}

/**
 * In the final phase, once a match is played, advance winner to next round
 * @param {object} db
 * @param {object} match - Match that has been played
 */
function advanceToNextRound(db, match) {
	engine.defineWinner(match);
	const mid = match.id;

	const matches = db.collection('matches');
	matches.updateOne({ 'team1_source': 'W' + mid }, { $set: { 'team1_id': match.winner } });
	matches.updateOne({ 'team2_source': 'W' + mid }, { $set: { 'team2_id': match.winner } });

	if (match.phase == 'S') { // Loser of semi-final goes forward to third place play-off
		matches.updateOne({ 'team1_source': 'L' + mid }, { $set: { 'team1_id': match.loser } });
		matches.updateOne({ 'team2_source': 'L' + mid }, { $set: { 'team2_id': match.loser } });
	}
}
