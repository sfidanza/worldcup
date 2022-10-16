/******************************************************************************
 * Competition data management
 ******************************************************************************/
import { Router } from 'express';
import foot from '../business/foot.js';
// import bets from '../business/bets.js';

export default function getRouter() {
	const router = Router();

	router.get('/editMatch', function (request, response) {
		const user = request.session.user;
		if (user && user.isAdmin) {
			const query = request.query;
			const db = request.database;
			foot.setMatchScore(db, +query.mid, getScore(query.score1), getScore(query.score2),
				getScore(query.score1PK), getScore(query.score2PK))
				.then(data => {
					// if (!match.group) { // if the match is in the final phase, trigger a betting leaderboard update
					// 	bets.updateLeaderboard(db); // no need to wait for result
					// }
					response.json(data);
				}).catch(err => {
					console.error(err);
					response.status(err.statusCode ?? 500).json({ error: err.message });
				});
		} else {
			response.status(401).json({ error: 'Unauthorized' });
		}
	});

	router.get('/setRanks', function (request, response) {
		const user = request.session.user;
		if (user && user.isAdmin) {
			const query = request.query;
			const db = request.database;
			foot.setRanks(db, query.gid, query.ranks.split('-'))
				.then(data => {
					response.json(data);
				}).catch(err => {
					console.error(err);
					response.status(err.statusCode ?? 500).json({ error: err.message });
				});
		} else {
			response.status(401).json({ error: 'Unauthorized' });
		}
	});

	/**
	 * Input validation
	 */
	function getScore(s) {
		s = (s) ? +s : null; // make sure '' and null do not become 0;
		return (isFinite(s) && s >= 0) ? s : null;
	}

	return router;
}
