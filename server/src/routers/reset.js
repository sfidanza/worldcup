/******************************************************************************
 * Competition data reset
 * Drops and re-imports data for all editions. Keeps everything else (users,
 * bets, ...).
 * 
 * 1. Login (no UI yet)
 *   /api/user/login?id=<ADMIN_ID>&pwd=<ADMIN_PWD>
 * 2. Reset
 *   /api/reset
 ******************************************************************************/
import { Router } from 'express';
import importer from '../admin/importer.js';

export default function getRouter(dbClient, collections) {
	const router = Router();

	router.get('/reset', function (request, response) {
		const user = request.session.user;
		if (user && user.isAdmin) {
			Promise.all(
				Object.values(collections)
					.map(edition => dbClient.db(edition))
					.map(db => db.dropDatabase()
						.then(() => importer.import(db))
					)
			).then(data => {
				response.json(data);
			}).catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
		} else {
			response.status(401).json({ error: 'Unauthorized' });
		}
	});

	return router;
}
