page.templates.bet = new frw.Template();
page.templates.bet.mode = 'default';

page.templates.bet.onParse = function() {
	var bets = page.data.bets;
	
	var championBets = bets && frw.data.query(bets, "$.user === '" + page.data.user + "' && $.challenge === 'champion'");
	var championBet = null;
	if (championBets && championBets.length) {
		var championBet = championBets[0].value;
		var team = frw.data.query(page.data.teams, "$.id === '" + championBet + "'");
		if (team[0]) {
			this.set('team', team[0]);
			this.parseBlock('yourCBet');
		}
	} else {
		this.parseBlock('noCBetYet');
	}
	
	this.parseChampion(championBet);
	
	var winnerBets = bets && frw.data.query(bets, "$.user === '" + page.data.user + "' && $.challenge === 'matchWinner'");
	if (winnerBets) {
		winnerBets = frw.data.reIndex(winnerBets, 'target');
	}
	this.parseQF(winnerBets);
};

page.templates.bet.parseChampion = function(bet) {
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
	
	var betAllowed = true; //(bet === null);
	this.set('selectableClass', (betAllowed) ? 'selectable' : '');
	this.set('betAllowed', (betAllowed) ? 'true' : 'false');
	for (var line = 0; line < teamLines.length; line++) {
		var teamLine = teamLines[line];
		for (var i = 0; i < teamLine.length; i++) {
			var team = teamLine[i];
			this.set('team', team);
			this.set('betClass', (team.id === bet) ? 'selected' : '');
			this.parseBlock('team');
		}
		this.parseBlock('teamLine');
	}
};

page.templates.bet.parseQF = function(bets) {
	var matches = frw.data.filter(page.data.matches, 'phase', 'Q');
	var teamLines = [[], []];
	for (var i = 0; i < matches.length; i++) {
		var match = matches[i];
		this.set('qfNum', i + 1);
		this.parseBlock('quarterFinal');
		
		teamLines[0].push(match['team1_id']);
		teamLines[1].push(match['team2_id']);
	}
	
	var teams = frw.data.reIndex(page.data.teams, 'id');
	var betAllowed = true; //(bet === null);
	this.set('selectableClass', (betAllowed) ? 'selectable' : '');
	this.set('betAllowed', (betAllowed) ? 'true' : 'false');
	for (var line = 0; line < teamLines.length; line++) {
		var teamLine = teamLines[line];
		for (var i = 0; i < teamLine.length; i++) {
			var team = teams[teamLine[i]];
			var match = matches[i]; // ahh!!!
			this.set('mid', match.id);
			this.set('team', team || { id: '', name: '' });
			this.set('betClass', (team && bets && bets[match.id] && team.id === bets[match.id].value) ? 'selected' : '');
			this.parseBlock('teamQ');
		}
		this.parseBlock('teamLineQ');
	}
};
