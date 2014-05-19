page.templates.main = new frw.Template();

page.templates.main.onParse = function() {
	var user = page.data.user;
	if (user) {
		this.parseBlock("placeABet");
		this.parseBlock("allBets");
	}
};

page.templates.main.onLoad = function() {
	var form = document.getElementById("login-form");
	frw.addListener(form, "submit", function(e) {
		frw.stopEvent(e);
		page.login({
			user_name: form.user_name.value,
			user_pwd: form.user_pwd.value
		});
		page.loginDlg.hide();
	});
};
