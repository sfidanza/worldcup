page.templates.board = new frw.Template();
page.templates.board.mode = 'default';

page.templates.board.phaseClasses = {
	"H": "round16",
	"Q": "quarter",
	"S": "semi",
	"T": "third",
	"F": "final"
};

page.templates.board.onParse = function(data) {
	var teams = frw.data.reIndex(data.teams, 'id');
	
	for (var i = 0, len = data.matches.length; i < len; i++) {
		var match = data.matches[i];
		this.set('match', match);
		this.set('class', this.phaseClasses[match.phase]);
		this.set('category', page.config.i18n["phase"+match.phase]);
		var team1 = teams[match.team1_id];
		var team2 = teams[match.team2_id];
		this.set('team1.name', team1 ? team1.name : match.team1_source);
		this.set('team2.name', team2 ? team2.name : match.team2_source);
		this.set('stadium', data.stadiums[match.stadium]);
		if (match.team1_scorePK != null) {
			this.parseBlock('PSO');
		}
		if (match.phase === "H") {
			this.set('num', match.team1_source);
			this.parseBlock('tooltip');
		} else {
			this.set('num', match.id);
			if (match.phase === "Q" || match.phase === "S") {
				this.parseBlock('highlight');
			}
		}
		this.parseBlock('match');
	}
};

page.templates.board.highlight = function(match) {
	if (!document.querySelectorAll) return; // no old browser support
	var root = document.getElementById('contents');
	
	if (match) {
		var items = root.querySelectorAll('.for-'+match);
		for (var i = 0; i < items.length; i++) {
			frw.dom.addClass(items[i], "highlighted");
		}
	} else {
		var items = root.querySelectorAll('div.highlighted');
		for (var i = 0; i < items.length; i++) {
			frw.dom.removeClass(items[i], "highlighted");
		}
	}
};
