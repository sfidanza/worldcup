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
	} else if (match.period === 11) {
		match.matchTime = 'Penalty Shoot Out';
	}

	// only cwc (10005) has club icons - so far anyway...
	this.set('flag', match.cid === '10005' ? 'club' : 'flag');

	this.set('match', match);
	this.set('team1.name', match.team1_name || team1?.name || match.team1_id); // always use team id instead of name for size S?
	this.set('team2.name', match.team2_name || team2?.name || match.team2_id);
	this.set('PSO', (match.team1_scorePK != null) ?
		'<br/>(' + match.team1_scorePK + ' - ' + match.team2_scorePK + ')' : '');

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

