import { Template } from '../../frw/frw.Template.js';

let page, frw;

export const bet = new Template();

bet.onCreate = function (pageRef, frwRef, i18nRepository) {
	page = pageRef;
	frw = frwRef;
	this.i18n = i18nRepository;
};

bet.onParse = function () {
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
	// this.parseFriends(championBets);

	let winnerBets = bets?.filter(b => b.challenge === 'match');
	if (winnerBets) {
		winnerBets = frw.data.groupBy(winnerBets, 'target');
	}
	this.parseMatches(winnerBets);

	if (page.data.leaderboard.length) {
		this.parseLeaderboard(page.data.user, page.data.leaderboard);
		this.parseBlock('leaderboard');
	}
};

bet.parseChampion = function (bets) {
	const final = page.data.matches[63];
	const betAllowed = (new Date(final.day + ' ' + final.hour) > Date.now()) && // match is not started
		(!!page.data.user); // user is logged in
	this.set('selectableClass', (betAllowed) ? 'selectable' : '');

	const betsByTeam = bets && frw.data.groupBy(bets, 'value');
	const totalBets = bets && bets.length;

	const teamsByGroup = frw.data.groupBy(page.data.teams, 'group', true);
	for (const g in teamsByGroup) {
		this.set('group', g);
		for (const team of teamsByGroup[g]) {
			this.parseTeam(team, betsByTeam, totalBets);
		}
		this.parseBlock('group');
	}
};

bet.parseTeam = function (team, betsByTeam, totalBets) {
	const betsOnTeam = betsByTeam && betsByTeam[team.id];
	const betsOnTeamNb = betsOnTeam && betsOnTeam.length;
	const betRatio = betsOnTeamNb / totalBets;
	this.set('team', team);
	this.set('betStyle', betsOnTeamNb ? 'background-color: rgba(0, 255, 0, ' + betRatio + ');' : '');
	if (betsOnTeam) {
		this.set('betsOnTeam', betsOnTeamNb);
		this.set('betters', this.getBetters(betsOnTeam).join(', '));
		this.parseBlock('badge');
	}
	this.parseBlock('team');
};

bet.getBetters = function (listBets) {
	return listBets.map(b => b.userName);
};

bet.parseFriends = function (bets) {
	const user = page.data.user;
	const friendsBets = frw.data.sort(bets, [{ key: 'userName', dir: 1 }]);
	const teamsById = frw.data.reIndex(page.data.teams, 'id');
	friendsBets.forEach((b, i) => {
		this.set('row_class', 'l' + (i % 2));
		this.set('bet', b);
		this.set('selected', (user && b.user === user.id) ? 'selected' : '');
		this.set('bet.team', teamsById[b.value]?.name);
		this.parseBlock('bet');
	});
	this.parseBlock('friends');
};

bet.parseMatches = function (bets) {
	const user = page.data.user;
	const list = frw.data.groupBy(page.data.matches.filter(m => m.group == null), 'phase');
	const teams = frw.data.reIndex(page.data.teams, 'id');

	for (const phase in list) {
		this.set('phase', page.config.i18n['phase' + phase]);
		const phaseList = frw.data.groupBy(list[phase], 'day');
		const days = Object.keys(phaseList).sort((a, b)=> new Date(a).getTime() - new Date(b).getTime());
		for (const day of days) {
			const matches = frw.data.sort(phaseList[day], [{ key: 'hour', dir: 1 }, { key: 'id', dir: 1 }]);
			this.set('day', day);
			matches.forEach((match, i) => {
				this.set('row_class', 'l' + (i % 2));
				this.set('match', match);
				const team1 = teams[match.team1_id];
				const team2 = teams[match.team2_id];
				this.set('team1.name', team1 ? team1.name : match.team1_source);
				this.set('team2.name', team2 ? team2.name : match.team2_source);
				this.set('stadium', page.data.stadiums[match.stadium]);
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

bet.isBettable = function (m) {
	return (new Date(m.day + ' ' + m.hour) > Date.now()) && // match is not started
		(m.team1_id && m.team2_id); // both teams are known
};

bet.parseTeamBadge = function (badge, betsOnTeam) {
	if (betsOnTeam) {
		this.set('betsOnTeam', betsOnTeam.length);
		this.set('betters', this.getBetters(betsOnTeam).join(', '));
		this.parseBlock(badge);
	}
};

bet.parseLeaderboard = function(user, board) {
	frw.data.sort(board, [
		{ key: 'ratio', dir: -1 },
		{ key: 'total', dir: -1 },
		{ key: 'userName', dir: 1 }
	]).forEach((ldUser, i) => {
		this.set('row_class', 'l' + (i % 2));
		this.set('ldUser', ldUser);
		this.set('ldUser.ratio', ldUser.ratio.toFixed(0));
		this.set('transparency', ldUser.ratio/100);
		this.set('selected', (user && ldUser.user === user.id) ? 'selected' : '');
		this.parseBlock('ldUser');
	});
};
