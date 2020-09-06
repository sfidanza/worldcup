page.templates.history = new frw.Template();

page.templates.history.onParse = function() {
	var list = page.data.history;
	for (var i in list) {
		this.set('edition', list[i]);
		this.parseBlock('edition');
	}
};
