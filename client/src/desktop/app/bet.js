/**********************************************************
 * Bet Engine
 **********************************************************/

let page;

export const bet = {};

bet.initialize = function (pageRef) {
	page = pageRef;
};

bet.destroy = function () {
};

bet.plug = function () {
	this.active = true;
};

bet.unplug = function () {
	if (this.active) {
		this.active = false;
	}
};

bet.betOnChampion = function (teamId) {
	if (page.data.user) { // avoid sending request if user is not logged in
		fetch('api/bet/champion?champion=' + teamId)
			.then(response => response.json())
			.then(data => {
				this.afterBet(data);
			});
	}
};

bet.betOnMatchWinner = function (mid, teamId) {
	if (page.data.user) { // avoid sending request if user is not logged in
		fetch('api/bet/match?mid=' + mid + '&winner=' + teamId)
			.then(response => response.json())
			.then(data => {
				this.afterBet(data);
			});
	}
};

bet.afterBet = function (data) {
	if (data) {
		page.data.bets = data.bets;
		page.redrawView();
	}
};
