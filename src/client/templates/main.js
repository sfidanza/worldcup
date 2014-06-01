page.templates.main = new frw.Template();

page.templates.main.onParse = function() {
	var user = page.data.user;
	if (user) {
		this.parseBlock("placeABet");
		this.parseBlock("allBets");
	}
};

page.templates.main.submitLogin = function(id, pwd) {
	page.login({
		id: form.user_name.value,
		pwd: form.user_pwd.value
	});
	page.loginDlg.hide();
};
