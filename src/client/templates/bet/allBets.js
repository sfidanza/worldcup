page.templates.allBets = new frw.Template();
page.templates.allBets.mode = 'default';

page.templates.allBets.onParse = function() {
	var bets = page.data.bets;
	
	var championBets = bets && frw.data.query(bets, "$.challenge === 'champion'");
	if (championBets && championBets.length) {
		for (var i = 0; i < championBets.length; i++) {
			var championBet = championBets[i];
			this.set('user', championBet.user);
			var team = frw.data.query(page.data.teams, "$.id === '" + championBet.value + "'");
			if (team[0]) {
				this.set('team', team[0]);
				this.parseBlock('hasBet');
			}
			this.parseBlock('championBet');
		}
		if (championBets.length === 1) {
			this.set('championBetSummary', 'One bet has been placed already.');
		} else {
			this.set('championBetSummary', championBets.length + ' bets have been placed already.');
		}
	} else {
		this.set('championBetSummary', 'Nobody has place any bet yet!');
	}
	
	this.parseChampion(championBets);
	
	var winnerBets = bets && frw.data.query(bets, "$.challenge === 'matchWinner'");
	if (winnerBets) {
		winnerBets = frw.data.groupBy(winnerBets, 'target');
	}
	this.parseQF(winnerBets);
};

page.templates.allBets.parseChampion = function(bets) {
	var teamsByGroup = frw.data.groupBy(page.data.teams, 'group', true);
	var teamLines = [];
	for (var g in teamsByGroup) {
		var teams = teamsByGroup[g];
		this.set('group', g);
		this.parseBlock('group');
		
		for (var i = 0; i < teams.length; i++) {
			var team = teams[i];
			if (!teamLines[i]) teamLines[i] = [];
			teamLines[i].push(team);
		}
	}
	
	var betsByTeam = bets && frw.data.groupBy(bets, 'value');
	var totalBets = bets && bets.length;
	
	for (var line = 0; line < teamLines.length; line++) {
		var teamLine = teamLines[line];
		for (var i = 0; i < teamLine.length; i++) {
			var team = teamLine[i];
			var betsOnTeam = betsByTeam && betsByTeam[team.id] && betsByTeam[team.id].length;
			var betRatio = betsOnTeam / totalBets;
			this.set('team', team);
			this.set('betsOnTeam', betsOnTeam);
			this.set('betStyle', betsOnTeam ? 'background-color: rgba(0, 255, 0, ' + betRatio + ');' : '');
			this.parseBlock('team');
		}
		this.parseBlock('teamLine');
	}
};

page.templates.allBets.getUser = function(item) {
	return item.user;
};

page.templates.allBets.parseQF = function(bets) {
	var matches = frw.data.filter(page.data.matches, 'phase', 'Q');
	var teamLines = [[], []];
	for (var i = 0; i < matches.length; i++) {
		var match = matches[i];
		this.set('qfNum', i + 1);
		this.parseBlock('quarterFinal');
		
		teamLines[0].push(match['team1.id']);
		teamLines[1].push(match['team2.id']);
	}
	
	var teams = frw.data.reIndex(page.data.teams, 'id');
	for (var line = 0; line < teamLines.length; line++) {
		var teamLine = teamLines[line];
		for (var i = 0; i < teamLine.length; i++) {
			var team = teams[teamLine[i]];
			var match = matches[i]; // ahh!!!
			var betsOnTeam = 0;
			var betRatio = 0;
			var listUsers = "";
			this.set('team', team || { id: '', name: '' });
			if (team && bets && bets[match.id]) {
				var betsByTeam = frw.data.groupBy(bets[match.id], 'value');
				var betsOnTeam = betsByTeam[team.id] && betsByTeam[team.id].length;
				var betRatio = betsOnTeam / bets[match.id].length;
				var listUsers = betsByTeam[team.id] && betsByTeam[team.id].map(this.getUser).join(", ");
			}
			this.set('betsOnTeam', betsOnTeam);
			this.set('betStyle', betsOnTeam ? 'background-color: rgba(0, 255, 0, ' + betRatio + ');' : '');
			this.set('listUsers', listUsers);
			this.parseBlock('teamQ');
		}
		this.parseBlock('teamLineQ');
	}
};

page.templates.allBets.toggle = function(link, elementId) {
	var element = document.getElementById(elementId);
	if (element.style.display === 'none') {
		element.style.display = "";
		link.innerHTML = 'Hide details';
	} else {
		element.style.display = "none";
		link.innerHTML = 'Show details';
	}
};
