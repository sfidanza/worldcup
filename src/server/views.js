var foot = require("./business/foot");

var views = {};
module.exports = views;

views.data = function(request, response, ctx) {
	foot.getData(ctx.db)
		.then(function(data) {
			var user = request.session.user;
			data.user = user && user.login;
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
