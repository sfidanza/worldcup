page.templates.login = new frw.Template();

page.templates.login.onParse = function(backTo) {
	this.backTo = backTo || 'bet';
	this.set('backTo', this.backTo);
};

page.templates.login.submit = function(id, pwd) {
	this.cleanErrors();
	if (!id) {
		this.setError('user_id');
	} else if (!pwd) {
		this.setError('user_pwd');
	} else {
		page.login({
			id: id,
			pwd: pwd
		}, page.select.bind(page, this.backTo));
	}
};

page.templates.login.setError = function(fieldId) {
	var field = document.forms['signin-form'][fieldId];
	if (field) {
		frw.dom.addClass(field, 'error');
	}
};

page.templates.login.cleanErrors = function() {
	var fields = document.forms['signin-form'].querySelectorAll('.error');
	for (var i = 0; i < fields.length; i++) {
		frw.dom.removeClass(fields[i], 'error');
	}
};

page.templates.login.signinGoogle = function() {
	var button = document.getElementById('social-signin').querySelector('.signin-google');
	frw.dom.addClass(button, 'waiting');
	frw.ssa.sendRequest({
		url: frw.ssa.buildGETUrl(page.config.url.auth, { provider: 'google' }),
		type: 'json',
		callback: this.openSigninPopup,
		override: this
	});
};

page.templates.login.openSigninPopup = function(data) {
	if (data && data.url) {
		var popup = window.open(data.url, 'signin', 'height=600,width=450');
	}
};

page.templates.login.signinCallback = function(search) {
	var query = frw.url.parseQueryURL(search);
	if (query.code) {
		frw.ssa.sendRequest({
			url: frw.ssa.buildGETUrl(page.config.url.authProfile, { code: query.code }),
			type: 'json',
			callback: this.refreshUser,
			override: this
		});
	}
};

page.templates.login.refreshUser = function(data) {
	var button = document.getElementById('social-signin').querySelector('.signin-google');
	frw.dom.removeClass(button, 'waiting');
	page.refreshUser(data, page.select.bind(page, this.backTo));
};
