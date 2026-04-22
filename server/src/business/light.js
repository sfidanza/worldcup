/********************************************************************
 * Foot: light data retriever (teams, matches)
 ********************************************************************/
import httpError from 'http-errors';

const light = {};
export default light;

/********************************************************************
 * Retrieve data
 */

async function getData (source) {
	return import(`../admin/data/${source}`, { with: { type: 'json' } }).then(({ default: data }) => data);
};

light.getData = async function (edition) {
	return Promise.all([
		getData(`${edition}-01-teams.json`),
		getData(`${edition}-03-matches.json`)
	]).then(([ dataTeams, dataMatches ]) => {
		if (!dataTeams || !dataMatches) {
			console.error(`Data not found for edition ${edition}`);
			throw new httpError.NotFound('Data not found for edition ' + edition);
		}
		return Object.assign({}, dataTeams, dataMatches);
	});
};
