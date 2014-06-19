var foot = require("./business/foot");
var bets = require("./business/bets");

var views = {};
module.exports = views;

views.data = function(request, response, ctx) {
	var data;
	foot.getData(ctx.db)
		.then(function(footData) {
			data = footData;
			return bets.getBets(ctx.db);
		})
		.then(function(bets) {
			var user = request.session.user;
			data.user = user && user.login;
			data.bets = bets;
			response.json(data);
		}).catch(response.error.bind(response, 500)).done();
};

views.teams = function(request, response, ctx) {
	foot.getTeams(ctx.db)
		.then(function(docs) {
			response.json({
				"teams": docs
			});
		}).catch(response.error.bind(response, 500)).done();
};

views.matches = function(request, response, ctx) {
	foot.getMatches(ctx.db)
		.then(function(docs) {
			response.json({
				"matches": docs
			});
		}).catch(response.error.bind(response, 500)).done();
};

views.stadiums = function(request, response, ctx) {
	foot.getStadiums(ctx.db)
		.then(function(docs) {
			response.json({
				"stadiums": docs
			});
		}).catch(response.error.bind(response, 500)).done();
};
