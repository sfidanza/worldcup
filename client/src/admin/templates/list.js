import { frw } from '@sfidanza/tahr';

let page;

export const list = new frw.Template();

list.onCreate = function (i18nRepository, pageRef) {
	this.i18n = i18nRepository;
	page = pageRef;
};

list.onParse = function () {
	const active = page.data.history.find(el => !el.winnerId);
	if (active) {
		this.set('year', active.year);
		this.set('name', page.config.i18n.names[active.cid](active.year));
		this.parseBlock('active');
	}

	page.data.history.forEach((c, i) => {
		this.set('row_class', 'l' + (i % 2));
		this.set('year', c.year);
		this.set('name', page.config.i18n.names[c.cid](c.year));
		this.set('type', c.light ? page.config.i18n.light : page.config.i18n.normal);

		this.parseBlock('competition');
	});
};
