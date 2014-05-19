page.templates.schedule = new frw.Template();
page.templates.schedule.mode = 'default';

page.templates.schedule.onParse = function(data) {
	var list = frw.data.groupBy(data.matches, 'phase');
	var teams = frw.data.reIndex(data.teams, 'id');
	
	for (var phase in list) {
		this.set('phase', page.config.i18n["phase"+phase]);
		var phaseList = frw.data.groupBy(list[phase], 'day');
		for (var day in phaseList) {
			var matches = phaseList[day];
			this.set('day', day.capitalize());
			for (var i = 0; i < matches.length; i++) {
				var match = matches[i];
				this.set('row_class', 'l'+(i % 2));
				this.set('match', match);
				var category = (match.group) ?
					page.config.i18n.group.supplant(match) :
					match.id;
				this.set('category', category);
				var team1 = teams[match['team1.id']];
				var team2 = teams[match['team2.id']];
				this.set('team1.name', team1 ? team1.name : match['team1.source']);
				this.set('team2.name', team2 ? team2.name : match['team2.source']);
				this.set('stadium', data.stadiums[match.stadium]);
				var pso = ''; // Penalty Shoot Out
				if (match['team1.scorePSO'] != null) {
					pso = "<br/>(" + match['team1.scorePSO'] + " - " + match['team2.scorePSO'] + ")";
				}
				this.set('PSO', pso);
				if (match.channel) {
					this.parseBlock('channelLogo');
				}
				this.parseBlock('match');
			}
			this.parseBlock('day');
		}
		this.parseBlock('phase');
	}
};

page.templates.schedule.highlight = function(team) {
	if (!document.querySelectorAll) return; // no old browser support
	
	var table = document.getElementById('schedule-foot');
	if (!table) return; // no schedule on this page
	
	if (team) {
		var matches = frw.data.query(page.data.matches,
			"$['team1.id'] == '"+team+"' || $['team2.id'] == '"+team+"'");
		for (var i = 0; i < matches.length; i++) {
			var mid = matches[i].id;
			var row = document.getElementById('m-'+mid);
			if (row) {
				frw.dom.addClass(row, "highlighted");
			}
		}
	} else {
		var rows = table.querySelectorAll('tr.highlighted');
		for (var i = 0; i < rows.length; i++) {
			frw.dom.removeClass(rows[i], "highlighted");
		}
	}
};
