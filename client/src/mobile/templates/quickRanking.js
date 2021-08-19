/* global page, frw */
page.templates.quickRanking = new frw.Template();

page.templates.quickRanking.onParse = function(teams, group, highlighted) {
	this.set('group', group);
	teams.forEach((team, i) => {
		this.set('row_class', 'l'+(i % 2));
		this.set('highlighted', (i == highlighted-1) ? " highlighted" : "");
		this.set('team', team);
		this.parseBlock('team');
	});
};