import { frw } from '@sfidanza/tahr';

let page;

export const main = new frw.Template();

main.onCreate = function (i18nRepository, pageRef) {
	this.i18n = i18nRepository;
	page = pageRef;
};

main.onParse = function () {
};

main.submitLogin = function (id, pwd) {
	page.login({
		id: id,
		pwd: pwd
	});
};
