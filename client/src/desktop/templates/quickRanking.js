import { Template } from '../frw/frw.Template.js';

export const quickRanking = new Template();

quickRanking.onCreate = function (pageRef, frwRef, i18nRepository) {
	this.i18n = i18nRepository;
};

quickRanking.onParse = function (teams, group, highlighted) {
	this.set('group', group);
	teams.forEach((team, i) => {
		this.set('row', i + 1);
		this.set('row_class', 'l' + (i % 2));
		this.set('highlighted', (i == highlighted - 1) ? ' highlighted' : '');
		this.set('team', team);
		this.parseBlock('team');
	});
};