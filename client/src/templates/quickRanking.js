import { Template } from '../frw/frw.Template.js';

let page;

export const quickRanking = new Template();

quickRanking.onCreate = function (pageRef, frwRef, i18nRepository) {
	page = pageRef;
	this.i18n = i18nRepository;
};

quickRanking.onParse = function (teams, group, highlighted) {
	this.set('group', group);
	this.set('flag', page.config.cid === 'cwc' ? 'club' : 'flag');
	teams.forEach((team, i) => {
		this.set('row_class', 'l' + (i % 2));
		this.set('highlighted', (i == highlighted - 1) ? ' highlighted' : '');
		this.set('team', team);
		this.parseBlock('team');
	});
};