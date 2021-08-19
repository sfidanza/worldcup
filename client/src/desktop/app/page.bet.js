/* global page */
/**********************************************************
 * Bet Engine
 **********************************************************/

page.bet = {};

page.bet.initialize = function () {
};

page.bet.destroy = function () {
};

page.bet.plug = function () {
	this.active = true;
};

page.bet.unplug = function () {
	if (this.active) {
		this.active = false;
	}
};

page.bet.betOnChampion = function (teamId) {
	if (page.data.user) { // avoid sending request if user is not logged in
		fetch('api/bet/champion?champion=' + teamId)
			.then(response => response.json())
			.then(data => {
				this.afterBet(data);
			});
	}
};

page.bet.betOnMatchWinner = function (mid, teamId) {
	if (page.data.user) { // avoid sending request if user is not logged in
		fetch('api/bet/match?mid=' + mid + '&winner=' + teamId)
			.then(response => response.json())
			.then(data => {
				this.afterBet(data);
			});
	}
};

page.bet.afterBet = function (data) {
	if (data) {
		page.data.bets = data.bets;
		page.redrawView();
	}
};
