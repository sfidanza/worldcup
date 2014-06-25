page.templates.user = new frw.Template();

page.templates.user.onParse = function(data) {
	if (data.user) {
		this.set('user', data.user.name);
		this.parseBlock('login_info');
	} else {
		this.parseBlock('login_form');
	}
};
