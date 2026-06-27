import { Template } from '../frw/frw.Template.js';

let page;

export const history = new Template();

history.onCreate = function (pageRef, frwRef, i18nRepository) {
	page = pageRef;
	this.i18n = i18nRepository;
};

history.onParse = function (cid) {
	cid = cid || 'worldcup';
	this.set('flag', cid === 'cwc' ? 'club' : 'flag');
	page.data.history[cid].forEach((edition, i) => {
		this.set('row_class', 'l' + (i % 2));
		this.set('edition', edition);
		if (edition.available) {
			this.parseBlock('link');
		} else {
			this.parseBlock('noLink');
		}
		this.parseBlock('edition');
	});
};
