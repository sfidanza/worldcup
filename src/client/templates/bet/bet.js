page.templates.bet = new frw.Template();
page.templates.bet.mode = 'default';

page.templates.bet.onParse = function() {
	var bets = page.data.bets;
	
	if (page.data.user) {
		var userBets = bets && frw.data.query(bets, "$.user === '" + page.data.user + "' && $.challenge === 'champion'");
		if (userBets && userBets.length) {
			var championBet = userBets[0].value;
			var team = frw.data.query(page.data.teams, "$.id === '" + championBet + "'");
			if (team[0]) {
				this.set('team', team[0]);
				this.parseBlock('yourCBet');
			}
		} else {
			this.parseBlock('noCBetYet');
		}
	} else {
		this.parseBlock('notLogged');
	}
	
	var championBets = bets && frw.data.query(bets, "$.challenge === 'champion'");
	this.parseChampion(championBets);
};

page.templates.bet.parseChampion = function(bets) {
	var betAllowed = (!!page.data.user); //(bet === null);
	this.set('selectableClass', (betAllowed) ? 'selectable' : '');
	
	var betsByTeam = bets && frw.data.groupBy(bets, 'value');
	var totalBets = bets && bets.length;
	
	var teamsByGroup = frw.data.groupBy(page.data.teams, 'group', true);
	for (var g in teamsByGroup) {
		var teams = teamsByGroup[g];
		this.set('group', g);
		
		for (var i = 0; i < teams.length; i++) {
			var team = teams[i];
			var betsOnTeam = betsByTeam && betsByTeam[team.id];
			var betsOnTeamNb = betsOnTeam && betsOnTeam.length;
			var betRatio = betsOnTeamNb / totalBets;
			this.set('team', team);
			this.set('betStyle', betsOnTeamNb ? 'background-color: rgba(0, 255, 0, ' + betRatio + ');' : '');
			if (betsOnTeam) {
				this.set('betsOnTeam', betsOnTeamNb);
				this.set('betters', this.getBetters(betsOnTeam).join(", "));
				this.parseBlock('badge');
			}
			this.parseBlock('team');
		}
		
		this.parseBlock('group');
	}
};

page.templates.bet.getBetters = function(listBets) {
	var betters = [];
	for (var i = 0; i < listBets.length; i++) {
		betters.push(listBets[i].user);
	}
	return betters;
};
