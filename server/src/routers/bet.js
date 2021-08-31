/******************************************************************************
 * Bet management
 ******************************************************************************/
import { Router } from 'express';
import bets from '../business/bets.js';

export default function getRouter(db) {
	const router = Router();

	/**
	 * Update Bet
	 */
	router.get('/champion', function (request, response) {
		const user = request.session.user;
		if (user && user.id) {
			const query = request.query;
			bets.enterChampionBet(db, user.id, query.champion)
				.then(() => bets.getBets(db))
				.then(betList => response.json({ bets: betList }))
				.catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
		} else {
			response.status(401).json({ error: 'Unauthorized' });
		}
	});

	router.get('/match', function (request, response) {
		const user = request.session.user;
		if (user && user.id) {
			const query = request.query;
			bets.enterMatchWinnerBet(db, user.id, +query.mid, query.winner)
				.then(() => bets.getBets(db))
				.then(betList => response.json({ bets: betList }))
				.catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
		} else {
			response.status(401).json({ error: 'Unauthorized' });
		}
	});

	router.get('/leaderboard', function (request, response) {
		bets.getLeaderboard(db)
			.then(result => response.json(result))
			.catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
	});

	router.get('/updateLeaderboard', function (request, response) {
		const user = request.session.user;
		if (user && user.isAdmin) {
			bets.updateLeaderboard(db)
				.then(result => response.json(result))
				.catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
		} else {
			response.status(401).json({ error: 'Unauthorized' });
		}
	});

	return router;
}
