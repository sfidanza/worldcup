import { Template } from '../../frw/frw.Template.js';

let page;

export const list = new Template();

list.onCreate = function (pageRef, frwRef, i18nRepository) {
	page = pageRef;
	this.i18n = i18nRepository;
};

list.onParse = function () {
	const active = page.data.history.find(el => !el.winnerId);
	if (active) {
		this.set('year', active.year);
		this.set('name', page.config.i18n.names[active.cid](active.year));
		this.parseBlock('active');
	}

	page.data.history.filter(el => el.winnerId)
		.forEach((c, i) => {
			this.set('row_class', 'l' + (i % 2));
			this.set('year', c.year);
			this.set('name', page.config.i18n.names[c.cid](c.year));
			this.set('active', (c.winnerId) ? '-' : page.config.i18n.active);

			this.parseBlock('competition');
		});
};
