import { Template } from '../../frw/frw.Template.js';

let page;

export const history = new Template();

history.onCreate = function (pageRef, frwRef, i18nRepository) {
	page = pageRef;
	this.i18n = i18nRepository;
};

history.onParse = function() {
	for (const year of page.data.history) {
		this.set('edition', year);
		this.parseBlock('edition');
	}
};
