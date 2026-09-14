import { frw } from '@sfidanza/tahr';

let page;

export const history = new frw.Template();

history.onCreate = function (i18nRepository, pageRef) {
	this.i18n = i18nRepository;
	page = pageRef;
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
