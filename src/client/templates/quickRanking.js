page.templates.quickRanking = new frw.Template();

page.templates.quickRanking.onParse = function(teams, group, highlighted) {
	this.set('group', group);
	for (var i=0; i<teams.length; i++) {
		var team = teams[i];
		this.set('row', i+1);
		this.set('row_class', 'l'+(i % 2));
		this.set('highlighted', (i == highlighted-1) ? " highlighted" : "");
		this.set('team', team);
		this.parseBlock('team');
	}
};