/* global page, frw */
page.templates.ranking = new frw.Template();

page.templates.ranking.onParse = function (teams, group) {
	this.set('group', group);
	teams = frw.data.sort(teams, [{ key: "rank", dir: +1 }]);
	teams.forEach((team, i) => {
		this.set('row', i + 1);
		this.set('row_class', 'l' + (i % 2));
		this.set('team', team);
		this.parseBlock('team');
	});
};