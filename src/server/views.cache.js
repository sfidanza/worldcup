var foot = require("./business/foot.cache.js");

var views = {};
module.exports = views;

views.data = function(ctx, response) {
	response.json(foot.getData());
};

views.import = function(ctx, response) {
	var data = foot.getData();
	
	ctx.db.collection('teams').drop(function(err, reply) {
		ctx.db.collection('teams').insert(data.teams, function(err, docs) {
			ctx.db.collection('stadiums').drop(function(err, reply) {
				ctx.db.collection('stadiums').insert(data.stadiums, function(err, docs) {
					ctx.db.collection('matches').drop(function(err, reply) {
						ctx.db.collection('matches').insert(data.matches, function(err, docs) {
							response.json();
						});
					});
				});
			});
		});
	});
};
