/* global page, frw */
page.templates.leaderboard = new frw.Template();

page.templates.leaderboard.onParse = function() {
	const user = page.data.user;
	const leaderboard = frw.data.sort(page.data.leaderboard, [
		{ key: 'ratio', dir: -1 },
		{ key: 'total', dir: -1 },
		{ key: 'userName', dir: 1 }
	]);
	
	leaderboard.forEach((ldUser, i) => {
		this.set('row_class', 'l' + (i % 2));
		this.set('ldUser', ldUser);
		this.set('ldUser.ratio', ldUser.ratio.toFixed(0));
		this.set('transparency', ldUser.ratio/100);
		this.set('selected', (user && ldUser.user === user.id) ? 'selected' : '');
		this.parseBlock('ldUser');
	});
};
