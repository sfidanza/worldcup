page.templates.register = new frw.Template();

page.templates.register.onParse = function(backTo) {
	this.backTo = backTo || 'bet';
	this.set('backTo', this.backTo);
};

page.templates.register.submit = function(id, name, pwd1, pwd2) {
	this.cleanErrors();
	if (!id) {
		this.setError('user_id');
	} else if (!pwd1) {
		this.setError('user_pwd1');
	} else if (pwd1 !== pwd2) {
		this.setError('user_pwd2');
	} else {
		page.register({
			id: id,
			pwd: pwd1,
			name: name
		}, page.select.bind(page, this.backTo));
	}
};

page.templates.register.setError = function(fieldId) {
	var field = document.forms['register-form'][fieldId];
	if (field) {
		frw.dom.addClass(field, 'error');
	}
};

page.templates.register.cleanErrors = function() {
	var fields = document.forms['register-form'].querySelectorAll('.error');
	for (var i = 0; i < fields.length; i++) {
		frw.dom.removeClass(fields[i], 'error');
	}
};
