/******************************************************************************
 * Index page
 ******************************************************************************/
import { Router } from 'express';
import foot from '../business/foot.js';
import bets from '../business/bets.js';
import history from '../business/history.js';
import light from '../business/light.js';

export default function getRouter(dbUsers) {
	const router = Router({ mergeParams: true });

	router.get('/all', function (request, response) {
		if (request.database) {
			const db = request.database;
			Promise.all([foot.getData(db), bets.getLeaderboard(dbUsers, db), bets.getBets(dbUsers, db)])
				.then(([data, leaderboard, betList]) => {
					data.history = history.getHistory();
					data.user = request.session.user;
					data.leaderboard = leaderboard;
					data.bets = betList;
					response.json(data);
				}).catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
		} else if (request.light) {
			light.getData(request.light)
				.then(data => {
					data.history = history.getHistory();
					data.user = request.session.user;
					response.status(200).json(data);
				}).catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
		}
	});

	router.get('/teams', function (request, response) {
		const db = request.database;
		foot.getTeams(db)
			.then(docs => response.json({ 'teams': docs }))
			.catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
	});

	router.get('/matches', function (request, response) {
		const db = request.database;
		foot.getMatches(db)
			.then(docs => response.json({ 'matches': docs }))
			.catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
	});

	router.get('/stadiums', function (request, response) {
		const db = request.database;
		foot.getStadiums(db)
			.then(docs => response.json({ 'stadiums': docs }))
			.catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
	});

	router.get('/history', function (request, response) {
		response.json(history.getHistory());
	});

	return router;
}
