import { Template } from '../frw/frw.Template.js';

let frw, page;

export const main = new Template();

main.onCreate = function (pageRef, frwRef, i18nRepository) {
	frw = frwRef;
	page = pageRef;
	this.i18n = i18nRepository;
};

main.onParse = function (year) {
	this.set('year', year);
	this.set('cid', page.config.cid);
	this.set('name', page.config.name);

	const teamsByGroup = frw.data.groupBy(page.data.teams, 'group');
	Object.keys(teamsByGroup).sort().forEach(g => {
		this.set('group', g);
		this.parseBlock('group');
	});

	const current = page.data.history[page.config.cid].find(el => el.year === year);
	if (current && !current.winnerId) {
		this.parseBlock('bet');
		this.parseBlock('tip');
	}
};

main.submitLogin = function (id, pwd) {
	page.login({
		id: id,
		pwd: pwd
	});
	page.loginDlg.hide();
};
