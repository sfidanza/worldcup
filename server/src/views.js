const foot = require('./business/foot');
const bets = require('./business/bets');
const history = require('./business/history');

const views = {};
module.exports = views;

views.all = function(request, response, ctx) {
	let data;
	foot.getData(ctx.db)
		.then(function(footData) {
			data = footData;
			return bets.getLeaderboard(ctx.db);
		}).then(function(leaderboard) {
			data.leaderboard = leaderboard;
			return bets.getBets(ctx.db);
		}).then(function(betList) {
			data.history = history.getHistory();
			data.user = request.session.user;
			data.bets = betList;
			response.json(data);
		}).catch(response.error.bind(response, 500));
};

views.teams = function(request, response, ctx) {
	foot.getTeams(ctx.db)
		.then(function(docs) {
			response.json({
				'teams': docs
			});
		}).catch(response.error.bind(response, 500));
};

views.matches = function(request, response, ctx) {
	foot.getMatches(ctx.db)
		.then(function(docs) {
			response.json({
				'matches': docs
			});
		}).catch(response.error.bind(response, 500));
};

views.stadiums = function(request, response, ctx) {
	foot.getStadiums(ctx.db)
		.then(function(docs) {
			response.json({
				'stadiums': docs
			});
		}).catch(response.error.bind(response, 500));
};

views.history = function(request, response/*, ctx*/) {
	response.json(history.getHistory());
};
