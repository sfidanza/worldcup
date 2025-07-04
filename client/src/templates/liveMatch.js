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

	this.set('flag', page.config.cid === 'cwc' ? 'club' : 'flag');

	this.set('match', match);
	const team1 = teams[match.team1_id];
	const team2 = teams[match.team2_id];
	
	this.set('team1.name', team1 ? team1.name : match.team1_source); // use team id instead of name for size S?
	this.set('team2.name', team2 ? team2.name : match.team2_source);
};