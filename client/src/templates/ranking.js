import { Template } from '../frw/frw.Template.js';

let page, frw;

export const ranking = new Template();

ranking.onCreate = function (pageRef, frwRef, i18nRepository) {
	page = pageRef;
	frw = frwRef;
	this.i18n = i18nRepository;
};

ranking.onParse = function (teams, group) {
	this.set('group', group);
	this.set('flag', page.config.cid === 'cwc' ? 'club' : 'flag');
	teams = frw.data.sortBy(teams, [{ key: 'rank', dir: 1 }, { key: 'name', dir: 1 }]);
	teams.forEach((team, i) => {
		this.set('row_class', 'l' + (i % 2));
		this.set('team', team);
		this.parseBlock('team');
	});
};