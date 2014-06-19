page.templates.main = new frw.Template();

page.templates.main.onParse = function() {
};

page.templates.main.submitLogin = function(id, pwd) {
	page.login({
		id: id,
		pwd: pwd
	});
	page.loginDlg.hide();
};
