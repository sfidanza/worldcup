import { Template } from '../frw/frw.Template.js';

let page;

export const history = new Template();

history.onCreate = function (pageRef, frwRef, i18nRepository) {
	page = pageRef;
	this.i18n = i18nRepository;
};

history.onParse = function() {
	for (const edition of page.data.history) {
		this.set('edition', edition);
		if (edition.year < page.config.minYear) {
			this.parseBlock('noLink');
		} else {
			this.parseBlock('link');
		}
		this.parseBlock('edition');
	}
};
