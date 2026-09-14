import { frw } from '@sfidanza/tahr';

let page;

export const quickRanking = new frw.Template();

quickRanking.onCreate = function (i18nRepository, pageRef) {
	this.i18n = i18nRepository;
	page = pageRef;
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