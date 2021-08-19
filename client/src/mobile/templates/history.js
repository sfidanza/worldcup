/* global page, frw */
page.templates.history = new frw.Template();

page.templates.history.onParse = function() {
	for (const year of page.data.history) {
		this.set('edition', year);
		this.parseBlock('edition');
	}
};
