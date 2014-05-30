var foot = require("./business/foot");

var views = {};
module.exports = views;

views.data = function(ctx, response) {
	foot.getData(ctx.db, function(err, data) {
		if (err) {
			response.error(500);
		} else {
			response.json(data);
		}
	});
};

views.teams = function(ctx, response) {
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

views.matches = function(ctx, response) {
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

views.stadiums = function(ctx, response) {
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
