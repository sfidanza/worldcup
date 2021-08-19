/* global page, frw */
page.templates.board = new frw.Template();
page.templates.board.mode = 'default';

page.templates.board.phaseClasses = {
	"H": "round16",
	"Q": "quarter",
	"S": "semi",
	"T": "third",
	"F": "final"
};

page.templates.board.onParse = function (data) {
	const teams = frw.data.reIndex(data.teams, 'id');

	for (const match of data.matches) {
		this.set('match', match);
		this.set('class', this.phaseClasses[match.phase]);
		this.set('category', page.config.i18n["phase" + match.phase]);
		const team1 = teams[match.team1_id];
		const team2 = teams[match.team2_id];
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

page.templates.board.highlight = function (match) {
	let root = document.getElementById('contents');

	if (match) {
		root.querySelectorAll('.for-' + match).forEach(item => {
			item.classList.add('highlighted');
		});
	} else {
		root.querySelectorAll('div.highlighted').forEach(item => {
			item.classList.remove('highlighted');
		});
	}
};
