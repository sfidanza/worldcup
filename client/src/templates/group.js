import { frw } from '@sfidanza/tahr';

let page;

export const group = new frw.Template();

group.onCreate = function (i18nRepository, pageRef) {
	this.i18n = i18nRepository;
	page = pageRef;
};

group.onParse = function (group) {
	const data = {
		teams: page.data.teams.filter(item => item.group === group),
		matches: page.data.matches.filter(item => item.group === group),
		stadiums: page.data.stadiums
	};

	page.templates.ranking.parse(data.teams, group);
	page.templates.schedule.parse(data);

	this.set('ranking', page.templates.ranking.retrieve());
	this.set('schedule', page.templates.schedule.retrieve());
};

group.onLoad = function () {
	page.templates.ranking.onLoad();
	page.templates.schedule.onLoad();
};