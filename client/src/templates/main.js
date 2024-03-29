import { Template } from '../frw/frw.Template.js';

let page;

export const main = new Template();

main.onCreate = function (pageRef, frwRef, i18nRepository) {
	page = pageRef;
	this.i18n = i18nRepository;
};

main.onParse = function (year) {
	this.set('year', year);
	const current = page.data.history.find(el => el.year == page.config.year);
	if (!current.winnerId) {
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
