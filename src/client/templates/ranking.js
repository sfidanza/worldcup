page.templates.ranking = new frw.Template();

page.templates.ranking.onParse = function(teams, group) {
	this.set('group', group);
	teams = frw.data.sort(teams, [{ key: "rank", dir: +1 }]);
	for (var i = 0; i < teams.length; i++) {
		var team = teams[i];
		this.set('row', i+1);
		this.set('row_class', 'l'+(i % 2));
		this.set('team', team);
		this.parseBlock('team');
	}
};