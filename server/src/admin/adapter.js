/********************************************************************
 * Connect to FIFA api to retrieve match data
 * Sample requests:
 *   2026 Worldcup planned matches:
 *     https://api.fifa.com/api/v3/calendar/matches?language=en&count=500&idSeason=285023
 *   Worldcup matches since 1930:
 *     https://api.fifa.com/api/v3/calendar/matches?language=en&count=500&idCompetition=17
 *   Current live matches:
 *     https://api.fifa.com/api/v3/live/football/
 *   Current live matches for Ligue 1:
 *     https://api.fifa.com/api/v3/live/football/?idCompetition=2000000018
 ********************************************************************/

const LIVE_API = 'https://api.fifa.com/api/v3/live/football/';
const CALENDAR_API = 'https://api.fifa.com/api/v3/calendar/';

const COMPETITION_IDS = {
	'worldcup': '17',
	'cwc': '10005'
};
const STAGES = {
	'First Stage': 'G',
	'Round of 32': '5',
	'Round of 16': 'H',
	'Quarter-final': 'Q',
	'Semi-final': 'S',
	'Play-off for third place': 'T',
	'Final': 'F'
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

/**
 * Retrieves calendar matches for the specified competition
 * @param {string} sid - the FIFA season id (ex: 2026 Worldcup => sid=285023)
 * @returns {Match[]}
 */
adapter.getPlannedMatches = async function (sid) {
	return fetch(CALENDAR_API + `matches?count=500&idSeason=${sid}`)
		.then(res => res.json())
		.then(res => {
			const dayFormat = Intl.DateTimeFormat('en-CA', { dateStyle: 'short', timeZone: 'Europe/Paris' });
			const hourFormat = Intl.DateTimeFormat('fr-FR', { timeStyle: 'short', timeZone: 'Europe/Paris' });
			const season = res.Results[0]?.SeasonName[0]?.Description || 'unknown';
			const matches = res.Results.map(data => {
				const date = new Date(data.Date);
				return {
					id: data.MatchNumber,
					phase: STAGES[data.StageName[0]?.Description],
					date: data.Date, // UTC
					day: dayFormat.format(date),
					hour: hourFormat.format(date),
					stadium: data.Stadium.IdStadium,
					stadium_name: data.Stadium.Name[0]?.Description,
					stadium_city: data.Stadium.CityName[0]?.Description,
					group: data.GroupName[0]?.Description.slice(-1),
					team1_id: data.Home?.Abbreviation,
					team2_id: data.Away?.Abbreviation,
					team1_source: data.PlaceHolderA,
					team2_source: data.PlaceHolderB
				};
			});
			return { season, matches };
		});
};
/**
 * Season ids:
 * - 2026 Worldcup: 285023
 * - 2022 Worldcup: 255711
 * - 2018 Worldcup: 254645
 * - 2014 Worldcup: 
 * - 2010 Worldcup: 
 * - 2006 Worldcup: 
 * - 2002 Worldcup: 
 * - 1998 Worldcup: 
 * - 1994 Worldcup: 84
 * - 1990 Worldcup: 76
 * - 1986 Worldcup: 68
 * - 1982 Worldcup: 59
 * - 1978 Worldcup: 50
 * - 1974 Worldcup: 39
 * - 1970 Worldcup: 32
 * - 1966 Worldcup: 26
 * - 1962 Worldcup: 21
 * - 1958 Worldcup: 15
 * - 1954 Worldcup: 9
 * - 1950 Worldcup: 7
 * - 1938 Worldcup: 5
 * - 1934 Worldcup: 3
 * - 1930 Worldcup: 1
 */