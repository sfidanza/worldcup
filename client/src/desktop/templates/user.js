import { Template } from '../frw/frw.Template.js';

export const user = new Template();

user.onCreate = function (pageRef, frwRef, i18nRepository) {
	this.i18n = i18nRepository;
};

user.onParse = function(data) {
	if (data.user) {
		this.set('user', data.user.name);
		this.parseBlock('login_info');
	} else {
		this.parseBlock('login_form');
	}
};
