page.templates.bet = new frw.Template();
page.templates.bet.mode = 'default';

page.templates.bet.onParse = function() {
	var bets = page.data.bets;
	var user = page.data.user;
	
	if (user) {
		var userBets = bets && frw.data.query(bets, "$.user === '" + user.login + "' && $.challenge === 'champion'");
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
	this.parseFriends(championBets);
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
		
		this.parseBlock('groupHeader');
		this.parseTeam(teams[0], betsByTeam, totalBets);
		this.parseTeam(teams[2], betsByTeam, totalBets);
		this.parseBlock('group');
		
		this.parseTeam(teams[1], betsByTeam, totalBets);
		this.parseTeam(teams[3], betsByTeam, totalBets);
		this.parseBlock('group');
	}
};

page.templates.bet.parseFriends = function(bets) {
	var friendsBets = frw.data.sort(bets, [ { key: 'userName', dir: 1 } ]);
	var teamsById = frw.data.reIndex(page.data.teams, 'id');
	for (var i = 0; i < friendsBets.length; i++) {
		var bet = friendsBets[i];
		this.set('row_class', 'l' + (i % 2));
		this.set('bet.user', this.getBetterName(bet, page.data.user));
		this.set('bet.teamId', bet.value);
		this.set('bet.team', teamsById[bet.value].name);
		this.parseBlock('bet');
	}
};

page.templates.bet.getBetterName = function(bet, user) {
	var better = bet.userName || bet.user;
	if (user && bet.user === user.login) {
		better += " (you)";
	}
	return better;
};

page.templates.bet.parseTeam = function(team, betsByTeam, totalBets) {
	var betsOnTeam = betsByTeam && betsByTeam[team.id];
	var betsOnTeamNb = betsOnTeam && betsOnTeam.length;
	var betRatio = betsOnTeamNb / totalBets;
	this.set('team', team);
	this.set('betStyle', betsOnTeamNb ? 'background-color: rgba(0, 255, 0, ' + betRatio + ');' : '');
	if (betsOnTeam) {
		this.set('betsOnTeam', betsOnTeamNb);
		this.parseBlock('badge');
	}
	this.parseBlock('team');
};
