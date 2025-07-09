/********************************************************************
 * Connect to FIFA api to retrieve match data
 ********************************************************************/

const LIVE_API = 'https://api.fifa.com/api/v3/live/football/';

const adapter = {};
export default adapter;
/**
 * Match structure used by the FIFA api
 * @typedef {object} Match
 * @property {Enum} MatchStatus
 *      0  Full Time
 *      1  Not started yet
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
		.then(res => res.json());
};

/**
 * Retrieves upcoming/ongoing matches for the specified competition
 * @param {string} cid - the FIFA competition id (ex: Club World Cup => cid=10005)
 * @returns {Match[]}
 */
adapter.getCurrentMatches = async function (cid) {
	return fetch(LIVE_API + `?idCompetition=${cid}`)
		.then(res => res.json());
};
