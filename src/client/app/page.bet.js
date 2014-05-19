/**********************************************************
 * Bet Engine
 **********************************************************/
 
page.bet = {};

page.bet.initialize = function() {
};

page.bet.destroy = function() {
};

page.bet.plug = function() {
	this.active = true;
};

page.bet.unplug = function() {
	if (this.active) {
		this.active = false;
	}
};

page.bet.betOnChampion = function(teamId, betAllowed) {
	if (betAllowed) { // avoid sending call. Enforcing it will be done on server anyway.
		var url = "do.bet.php?challenge=champion&champion=" + teamId;
		frw.ssa.sendRequest({
			url: url,
			type: 'json',
			callback: this.afterBet,
			override: this
		});
	}	
};

page.bet.betOnMatchWinner = function(mid, teamId, betAllowed) {
	if (betAllowed) { // avoid sending call. Enforcing it will be done on server anyway.
		var url = "do.bet.php?challenge=quarter&mid=" + mid + "&winner=" + teamId;
		frw.ssa.sendRequest({
			url: url,
			type: 'json',
			callback: this.afterBet,
			override: this
		});
	}	
};

page.bet.afterBet = function(data) {
	if (data.updated) {
		frw.data.update(page.data.bets, data.bets, "bid");
		page.redrawView();
	}
};
