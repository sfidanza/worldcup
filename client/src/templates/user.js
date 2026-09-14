import { frw } from '@sfidanza/tahr';

export const user = new frw.Template();

user.onParse = function(data) {
	if (data.user) {
		this.set('user', data.user.name);
		this.parseBlock('login_info');
	} else {
		this.parseBlock('login_form');
	}
};
