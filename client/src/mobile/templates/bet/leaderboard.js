page.templates.leaderboard = new frw.Template();

page.templates.leaderboard.onParse = function() {
	var user = page.data.user;
	var leaderboard = frw.data.sort(page.data.leaderboard, [
		{ key: 'ratio', dir: -1 },
		{ key: 'total', dir: -1 },
		{ key: 'userName', dir: 1 }
	]);
	
	for (var i = 0; i < leaderboard.length; i++) {
		var ldUser = leaderboard[i];
		this.set('row_class', 'l' + (i % 2));
		this.set('ldUser', ldUser);
		this.set('ldUser.ratio', ldUser.ratio.toFixed(0));
		this.set('transparency', ldUser.ratio/100);
		this.set('selected', (user && ldUser.user === user.id) ? 'selected' : '');
		this.parseBlock('ldUser');
	}
};
