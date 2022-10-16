/******************************************************************************
 * Index page
 ******************************************************************************/
import { Router } from 'express';
import foot from '../business/foot.js';
// import bets from '../business/bets.js';
import history from '../business/history.js';

export default function getRouter(db) {
	const router = Router();

	router.get('/all', function (request, response) {
		Promise.all([ foot.getData(db) /*, bets.getLeaderboard(db), bets.getBets(db)*/ ])
			.then(([ data /*, leaderboard, betList*/ ]) => {
				data.history = history.getHistory();
				data.user = request.session.user;
				// data.leaderboard = leaderboard;
				// data.bets = betList;
				response.json(data);
			}).catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
		});

	router.get('/teams', function (request, response) {
		foot.getTeams(db)
			.then(docs => response.json({ 'teams': docs }))
			.catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
		});

	router.get('/matches', function (request, response) {
		foot.getMatches(db)
			.then(docs => response.json({ 'matches': docs }))
			.catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
		});

	router.get('/stadiums', function (request, response) {
		foot.getStadiums(db)
			.then(docs => response.json({ 'stadiums': docs }))
			.catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
		});

	router.get('/history', function (request, response) {
		response.json(history.getHistory());
	});

	return router;
}
