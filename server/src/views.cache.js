var foot = require("./business/foot.cache.js");

var views = {};
module.exports = views;

views.data = function(request, response, ctx) {
	response.json(foot.getData());
};

views.import = function(request, response, ctx) {
	var data = foot.getData();
	var db = ctx.db;
	
	db.collection('teams').drop(function(err, reply) {
		db.collection('teams').insertMany(data.teams, function(err, docs) {
			db.collection('stadiums').drop(function(err, reply) {
				db.collection('stadiums').insertMany(data.stadiums, function(err, docs) {
					db.collection('matches').drop(function(err, reply) {
						db.collection('matches').insertMany(data.matches, function(err, docs) {
							response.json();
						});
					});
				});
			});
		});
	});
};
