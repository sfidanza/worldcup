/* global page, frw */
page.templates.login = new frw.Template();

page.templates.login.onParse = function (backTo) {
	this.backTo = backTo || 'bet';
	this.set('backTo', this.backTo);
};

page.templates.login.submit = function (id, pwd) {
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

page.templates.login.setError = function (fieldId) {
	const field = document.forms['signin-form'][fieldId];
	if (field) {
		field.classList.add('error');
	}
};

page.templates.login.cleanErrors = function () {
	const fields = document.forms['signin-form'].querySelectorAll('.error');
	for (const field of fields) {
		field.classList.remove('error');
	}
};

page.templates.login.signinGoogle = function () {
	const button = document.getElementById('social-signin').querySelector('.signin-google');
	button.classList.add('waiting');
	fetch(page.config.url.auth('google'))
		.then(response => response.json())
		.then(data => {
			if (data && data.url) {
				window.open(data.url, 'signin', 'height=600,width=450');
			}
		});
};

page.templates.login.signinCallback = function (query) {
    const params = new URLSearchParams(query);
    const code = params.get('code');
	if (code) {
		fetch(page.config.url.authProfile(code))
			.then(response => response.json())
			.then(data => {
				const button = document.getElementById('social-signin').querySelector('.signin-google');
				button.classList.remove('waiting');
				page.refreshUser(data, page.select.bind(page, this.backTo));
			});
	}
};
