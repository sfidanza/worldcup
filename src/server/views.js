var foot = require("./business/foot");
var bets = require("./business/bets");
var history = require("./business/history");

var views = {};
module.exports = views;

views.all = function(request, response, ctx) {
	var data;
	foot.getData(ctx.db)
		.then(function(footData) {
			data = footData;
			return bets.getLeaderboard(ctx.db);
		}).then(function(leaderboard) {
			data.leaderboard = leaderboard;
			return bets.getBets(ctx.db);
		}).then(function(bets) {
			data.history = history.getHistory();
			data.user = request.session.user;
			data.bets = bets;
			response.json(data);
		}).catch(response.error.bind(response, 500));
};

views.teams = function(request, response, ctx) {
	foot.getTeams(ctx.db)
		.then(function(docs) {
			response.json({
				"teams": docs
			});
		}).catch(response.error.bind(response, 500));
};

views.matches = function(request, response, ctx) {
	foot.getMatches(ctx.db)
		.then(function(docs) {
			response.json({
				"matches": docs
			});
		}).catch(response.error.bind(response, 500));
};

views.stadiums = function(request, response, ctx) {
	foot.getStadiums(ctx.db)
		.then(function(docs) {
			response.json({
				"stadiums": docs
			});
		}).catch(response.error.bind(response, 500));
};

views.history = function(request, response, ctx) {
	response.json(history.getHistory());
};
