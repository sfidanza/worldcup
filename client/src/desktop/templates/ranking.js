import { Template } from '../frw/frw.Template.js';

let frw;

export const ranking = new Template();

ranking.onCreate = function (pageRef, frwRef, i18nRepository) {
	frw = frwRef;
	this.i18n = i18nRepository;
};

ranking.onParse = function (teams, group) {
	this.set('group', group);
	teams = frw.data.sort(teams, [{ key: 'rank', dir: +1 }]);
	teams.forEach((team, i) => {
		this.set('row', i + 1);
		this.set('row_class', 'l' + (i % 2));
		this.set('team', team);
		this.parseBlock('team');
	});
};