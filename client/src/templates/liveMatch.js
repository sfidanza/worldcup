import { Template } from '../frw/frw.Template.js';

let page, frw;

export const liveMatch = new Template();

liveMatch.onCreate = function (pageRef, frwRef, i18nRepository) {
	page = pageRef;
	frw = frwRef;
	this.i18n = i18nRepository;
};

liveMatch.onParse = function (match) {
	const teams = frw.data.indexBy(page.data.teams, 'id');
	const team1 = teams[match.team1_id];
	const team2 = teams[match.team2_id];

	// Adapt match time display during breaks
	if (match.period === 4) {
		match.matchTime = 'Half-Time';
	} else if (match.period === 10) {
		match.matchTime = 'Full Time';
	}

	// cid 17 is Worldcup (flag) - to be reviewed to support more competitions
	this.set('flag', match.cid === '17' ? 'flag' : 'club');

	this.set('match', match);
	this.set('team1.name', match.team1_name || team1?.name || match.team1_id); // always use team id instead of name for size S?
	this.set('team2.name', match.team2_name || team2?.name || match.team2_id);

	if (match.team1_goals) {
		this.parseGoals(match.team1_goals, 'home_goal');
	}
	if (match.team2_goals) {
		this.parseGoals(match.team2_goals, 'away_goal');
	}
};

liveMatch.parseGoals = function (goals, blockName) {
	for (const goal of goals) {
		this.set('g', goal);
		// Type = 1: penalty, 2: normal, 3: own goal
		this.set('g.label', goal.type == 1 ? '(P)' : (goal.type == 3 ? '(OG)' : ''));
		this.parseBlock(blockName);
	}
};

