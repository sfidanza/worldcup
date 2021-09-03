import { Template } from '../../frw/frw.Template.js';

let page;

export const register = new Template();

register.onCreate = function (pageRef, frwRef, i18nRepository) {
	page = pageRef;
	this.i18n = i18nRepository;
};

register.onParse = function(backTo) {
	this.backTo = backTo || 'bet';
	this.set('backTo', this.backTo);
};

register.submit = function(id, name, pwd1, pwd2) {
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

register.setError = function(fieldId) {
	const field = document.forms['register-form'][fieldId];
	if (field) {
		field.classList.add('error');
	}
};

register.cleanErrors = function() {
	const fields = document.forms['register-form'].querySelectorAll('.error');
	for (const field of fields) {
		field.classList.remove('error');
	}
};
