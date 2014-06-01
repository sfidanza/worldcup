var foot = require("./business/foot");

var views = {};
module.exports = views;

views.data = function(request, response, ctx) {
	foot.getData(ctx.db, function(err, data) {
		if (err) {
			response.error(500);
		} else {
			var user = request.session.user;
			data.user = user && user.login;
			response.json(data);
		}
	});
};

views.teams = function(request, response, ctx) {
	foot.getTeams(ctx.db, function(err, docs) {
		if (err) {
			response.error(500);
		} else {
			response.json({
				"teams": docs
			});
		}
	});
};

views.matches = function(request, response, ctx) {
	foot.getMatches(ctx.db, function(err, docs) {
		if (err) {
			response.error(500);
		} else {
			response.json({
				"matches": docs
			});
		}
	});
};

views.stadiums = function(request, response, ctx) {
	foot.getStadiums(ctx.db, function(err, docs) {
		if (err) {
			response.error(500);
		} else {
			response.json({
				"stadiums": docs
			});
		}
	});
};
