const foot = require('./business/foot.cache.js');

const views = {};
module.exports = views;

views.data = function(request, response/*, ctx*/) {
	response.json(foot.getData());
};

views.import = function(request, response, ctx) {
	const data = foot.getData();
	const db = ctx.db;
	
	db.collection('teams').drop(() => {
		db.collection('teams').insertMany(data.teams, () => {
			db.collection('stadiums').drop(() => {
				db.collection('stadiums').insertMany(data.stadiums, () => {
					db.collection('matches').drop(() => {
						db.collection('matches').insertMany(data.matches, () => {
							response.json();
						});
					});
				});
			});
		});
	});
};
