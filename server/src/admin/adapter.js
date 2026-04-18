/********************************************************************
 * Connect to FIFA api to retrieve match data
 * Sample requests:
 *   2026 Worldcup planned matches:
 *     https://api.fifa.com/api/v3/calendar/matches?language=en&count=500&idSeason=285023
 *   Current live matches:
 *     https://api.fifa.com/api/v3/live/football/
 *   Current live matches for Ligue 1:
 *     https://api.fifa.com/api/v3/live/football/?idCompetition=2000000018
 ********************************************************************/

const LIVE_API = 'https://api.fifa.com/api/v3/live/football/';

const COMPETITION_IDS = {
	'worldcup': '17',
	'cwc': '10005'
};

const adapter = {};
export default adapter;
/**
 * Match structure used by the FIFA api
 * @typedef {object} Match
 * @property {Enum} MatchStatus
 *      0  Full Time
 *      1  Not yet started
 *      3  Ongoing
 *      4  Abandoned
 *      7  Postponed
 *      8  Cancelled
 *      12 Lineups
 * @property {Enum} Period
 *      0  Not yet started
 *      3  First half playing
 *      4  Half time break
 *      5  Second Half playing
 *      6  Extra time
 *      8  Extra half time
 *      10 Full time
 *      11 Penalty shootouts
 */

/**
 * List of Matches
 * @typedef {object} MatchList
 * @property {Match[]} Results
 */

/**
 * Retrieves match data for the specified match id
 * @param {string} mid - the FIFA match id
 * @returns {MatchList}
 */
adapter.getMatch = async function (mid) {
	return fetch(LIVE_API + mid)
		.then(res => res.json())
		.then(data => {
			return {
				cid: data.IdCompetition,
				date: data.Date,
				day: data.Date.slice(0, 10), // raw but should work for now
				matchTime: data.MatchTime,
				matchStatus: data.MatchStatus,
				period: data.Period,
				winner: data.Winner,
				team1_id: data.HomeTeam.Abbreviation,
				team1_name: data.HomeTeam.TeamName[0].Description,
				team1_score: data.HomeTeam.Score,
				team2_id: data.AwayTeam.Abbreviation,
				team2_name: data.AwayTeam.TeamName[0].Description,
				team2_score: data.AwayTeam.Score,
				team1_scorePK: data.HomeTeamPenaltyScore,
				team2_scorePK: data.AwayTeamPenaltyScore
			};
		});
};

/**
 * Retrieves upcoming/ongoing matches for the specified competition
 * @param {string} competitionId - 'worldcup' or 'cwc' ('euro' is not supported yet)
 * @returns {Match[]}
 */
adapter.getCurrentMatches = async function (competitionId) {
	const cid = COMPETITION_IDS[competitionId];
	return fetch(LIVE_API + `?idCompetition=${cid}`)
		.then(res => res.json())
		.then(res => {
			return res.Results.map(data => {
				return {
					mid: data.IdMatch,
					date: data.Date,
					matchStatus: data.MatchStatus,
					matchTime: data.MatchTime,
					period: data.Period
				};
			});
		});
};
