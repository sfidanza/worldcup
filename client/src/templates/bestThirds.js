import { Template } from '../frw/frw.Template.js';

let frw;
const QUALIFIED_COUNT = 8;

export const bestThirds = new Template();

bestThirds.onCreate = function (pageRef, frwRef, i18nRepository) {
	frw = frwRef;
	this.i18n = i18nRepository;
};

bestThirds.onParse = function (teams) {
	const bestThirds = teams.filter(t => t.rank === 3);
	frw.data.sortBy(bestThirds, [
		{ key: 'points', dir: -1 },
		{ key: 'goal_difference', dir: -1 },
		{ key: 'goals_scored', dir: -1 },
		{ key: 'name', dir: 1 } // to get sort stable - if not enough, set ranking manually
	]);

	const stillPlaying = bestThirds.filter(t => t.played < 3).length;
	const minQualifyingPoints = bestThirds[QUALIFIED_COUNT - 1].points;
	let playedAll = 0;

	this.set('flag', page.config.cid === 'cwc' ? 'club' : 'flag');
	bestThirds.forEach((team, i) => {
		const highlighted = (team.played < 3) ? ' highlighted'      // still playing, points can only increase, goal_diff can decrease
			: (i < QUALIFIED_COUNT - stillPlaying) ? ' qualified'   // not enough still playing teams to push them below the qualifying line
			: (playedAll >= QUALIFIED_COUNT || team.points < minQualifyingPoints) ? ' eliminated' // not enough points to qualify
			: '';
		if (team.played === 3) {
			playedAll++;
		}

		this.set('row_class', 'l' + (i % 2));
		this.set('highlighted', highlighted);
		this.set('team', team);
		this.parseBlock('team');
	});
};
