/* global page, frw */
page.templates.bet = new frw.Template();
page.templates.bet.mode = 'default';

page.templates.bet.onParse = function() {
	const bets = page.data.bets;
	const user = page.data.user;
	
	if (user) {
		const championBet = bets?.find(b => b.user === user.id && b.challenge === 'champion');
		if (championBet) {
			const team = page.data.teams.find(t => t.id === championBet.value);
			if (team) {
				this.set('team', team);
				this.parseBlock('yourCBet');
			}
		} else {
			this.parseBlock('noCBetYet');
		}
	} else {
		this.parseBlock('notLogged');
	}
	
	const championBets = bets?.filter(b => b.challenge === 'champion');
	this.parseChampion(championBets);
	
	let winnerBets = bets?.filter(b => b.challenge === 'match');
	if (winnerBets) {
		winnerBets = frw.data.groupBy(winnerBets, 'target');
	}
	this.parseMatches(winnerBets);
	
	page.templates.leaderboard.parse();
	this.set('leaderboard', page.templates.leaderboard.retrieve());
};

page.templates.bet.parseChampion = function(bets) {
	const betAllowed = (!!page.data.user);
	this.set('selectableClass', (betAllowed) ? 'selectable' : '');
	
	const betsByTeam = bets && frw.data.groupBy(bets, 'value');
	const totalBets = bets && bets.length;
	
	const teamsByGroup = frw.data.groupBy(page.data.teams, 'group', true);
	for (const g in teamsByGroup) {
		const teams = teamsByGroup[g];
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
	const user = page.data.user;
	const friendsBets = frw.data.sort(bets, [ { key: 'userName', dir: 1 } ]);
	const teamsById = frw.data.reIndex(page.data.teams, 'id');
	friendsBets.forEach((bet, i) => {
		this.set('row_class', 'l' + (i % 2));
		this.set('bet', bet);
		this.set('selected', (user && bet.user === user.id) ? 'selected' : '');
		this.set('bet.team', teamsById[bet.value].name);
		this.parseBlock('bet');
	});
};

page.templates.bet.parseTeam = function(team, betsByTeam, totalBets) {
	const betsOnTeam = betsByTeam && betsByTeam[team.id];
	const betsOnTeamNb = betsOnTeam && betsOnTeam.length;
	const betRatio = betsOnTeamNb / totalBets;
	this.set('team', team);
	this.set('betStyle', betsOnTeamNb ? 'background-color: rgba(0, 255, 0, ' + betRatio + ');' : '');
	if (betsOnTeam) {
		this.set('betsOnTeam', betsOnTeamNb);
		this.parseBlock('badge');
	}
	this.parseBlock('team');
};

page.templates.bet.parseMatches = function(bets) {
	const user = page.data.user;
	const list = frw.data.groupBy(page.data.matches.filter(m => m.group == null), 'phase');
	const teams = frw.data.reIndex(page.data.teams, 'id');
	
	for (const phase in list) {
		this.set('phase', page.config.i18n['phase'+phase]);
		const phaseList = frw.data.groupBy(list[phase], 'day');
		for (const day in phaseList) {
			const matches = phaseList[day];
			this.set('day', day);
			matches.forEach((match, i) => {
				this.set('row_class', 'l'+(i % 2));
				this.set('match', match);
				const team1 = teams[match.team1_id];
				const team2 = teams[match.team2_id];
				this.set('team1.name', team1 ? team1.name : match.team1_source);
				this.set('team2.name', team2 ? team2.name : match.team2_source);
				let pso = ''; // Penalty Shoot Out
				if (match.team1_scorePK != null) {
					pso = '<br/>(' + match.team1_scorePK + ' - ' + match.team2_scorePK + ')';
				}
				this.set('PSO', pso);
				
				let bet1Class = '', bet2Class = '';
				const isOpened = this.isBettable(match);
				if (user && isOpened) {
					bet1Class = 'selectable';
					bet2Class = 'selectable';
					this.parseBlock('bet1');
					this.parseBlock('bet2');
				}
				
				const betsOnMatch = bets[match.id];
				if (betsOnMatch) {
					if (user) {
						let yourBet = betsOnMatch.find(b => b.user === user.id);
						yourBet = yourBet && yourBet.value;
						if (yourBet === team1.id) {
							bet1Class += ' selected';
						} else if (yourBet === team2.id) {
							bet2Class += ' selected';
						}
					}
					
					const betsOnTeams = frw.data.groupBy(betsOnMatch, 'value');
					this.parseTeamBadge('badge1', betsOnTeams[team1.id]);
					this.parseTeamBadge('badge2', betsOnTeams[team2.id]);
				}
				
				this.set('bet1Class', bet1Class);
				this.set('bet2Class', bet2Class);
				this.parseBlock('match');
			});
			this.parseBlock('day');
		}
		this.parseBlock('phase');
	}
};

page.templates.bet.isBettable = function(m) {
	return (new Date(m.day + ' ' + m.hour) > Date.now()) && // match is not started
		(m.team1_id && m.team2_id); // both teams are known
};

page.templates.bet.parseTeamBadge = function(badge, betsOnTeam) {
	if (betsOnTeam) {
		this.set('betsOnTeam', betsOnTeam.length);
		this.parseBlock(badge);
	}
};
