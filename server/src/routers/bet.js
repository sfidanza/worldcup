/******************************************************************************
 * Bet management
 ******************************************************************************/
import { Router } from 'express';
import bets from '../business/bets.js';

export default function getRouter(dbUsers) {
	const router = Router();

	/**
	 * Update Bet
	 */
	router.get('/champion', function (request, response) {
		const user = request.session.user;
		if (user && user.id) {
			const query = request.query;
			const db = request.database;
			bets.enterChampionBet(db, user.id, query.champion)
				.then(() => bets.getBets(dbUsers, db))
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
			const db = request.database;
			bets.enterMatchWinnerBet(db, user.id, +query.mid, query.winner)
				.then(() => bets.getBets(dbUsers, db))
				.then(betList => response.json({ bets: betList }))
				.catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
		} else {
			response.status(401).json({ error: 'Unauthorized' });
		}
	});

	router.get('/leaderboard', function (request, response) {
		const db = request.database;
		bets.getLeaderboard(dbUsers, db)
			.then(result => response.json(result))
			.catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
	});

	router.get('/updateLeaderboard', function (request, response) {
		const user = request.session.user;
		if (user && user.isAdmin) {
			const db = request.database;
			bets.updateLeaderboard(db)
				.then(result => response.json(result))
				.catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
		} else {
			response.status(401).json({ error: 'Unauthorized' });
		}
	});

	return router;
}
