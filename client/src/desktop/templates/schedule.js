/* global page, frw */
page.templates.schedule = new frw.Template();
page.templates.schedule.mode = 'default';

page.templates.schedule.onParse = function (data) {
	var list = frw.data.groupBy(data.matches, 'phase');
	var teams = frw.data.reIndex(data.teams, 'id');

	for (var phase in list) {
		this.set('phase', page.config.i18n["phase" + phase]);
		var phaseList = frw.data.groupBy(list[phase], 'day');
		for (var day in phaseList) {
			var matches = phaseList[day];
			this.set('day', day);
			for (var i = 0; i < matches.length; i++) {
				var match = matches[i];
				this.set('row_class', 'l' + (i % 2));
				this.set('match', match);
				var category = (match.group) ?
					page.config.i18n.group(match.group) :
					match.id;
				this.set('category', category);
				var team1 = teams[match.team1_id];
				var team2 = teams[match.team2_id];
				this.set('team1.name', team1 ? team1.name : match.team1_source);
				this.set('team2.name', team2 ? team2.name : match.team2_source);
				this.set('stadium', data.stadiums[match.stadium]);
				var pso = ''; // Penalty Shoot Out
				if (match.team1_scorePK != null) {
					pso = "<br/>(" + match.team1_scorePK + " - " + match.team2_scorePK + ")";
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

page.templates.schedule.highlight = function (team) {
	let table = document.getElementById('schedule-foot');
	if (!table) return; // no schedule on this page

	if (team) {
		page.data.matches
			.filter(m => m.team1_id == team || m.team2_id == team)
			.forEach(m => {
				var row = document.getElementById('m-' + m.id);
				if (row) {
					row.classList.add('highlighted');
				}
			});
	} else {
		table.querySelectorAll('tr.highlighted').forEach(row => {
			row.classList.remove('highlighted');
		});
	}
};
