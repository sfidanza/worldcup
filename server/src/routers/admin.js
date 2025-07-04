/******************************************************************************
 * Competition data import
 * 
 * With admin rights:
 *   /api/<year>/admin/preview -> preview the data from the filesystem
 *   /api/<year>/admin/drop    -> drop the database
 *   /api/<year>/admin/import  -> import the filesystem data in database
 *   /api/<year>/update?mid=xx -> update the match score (mid is the FIFA match id)
 ******************************************************************************/
import { Router } from 'express';
import importer from '../admin/importer.js';
import updater from '../admin/updater.js';
import live from '../business/live.js';

export default function getRouter() {
	const router = Router();

	router.get('/drop', function (request, response) {
		const user = request.session.user;
		if (user && user.isAdmin) {
			const db = request.database;
			db.dropDatabase()
				.then(data => {
					response.json(data);
				}).catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
		} else {
			response.status(401).json({ error: 'Unauthorized' });
		}
	});

	router.get('/preview', function (request, response) {
		const user = request.session.user;
		if (user && user.isAdmin) {
			const db = request.database;
			importer.preview(db)
				.then(data => {
					response.json(data);
				}).catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
		} else {
			response.status(401).json({ error: 'Unauthorized' });
		}
	});

	router.get('/import', function (request, response) {
		const user = request.session.user;
		if (user && user.isAdmin) {
			const db = request.database;
			importer.import(db)
				.then(data => {
					response.json(data);
				}).catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
		} else {
			response.status(401).json({ error: 'Unauthorized' });
		}
	});

	router.get('/update', function (request, response) {
		const user = request.session.user;
		if (user && user.isAdmin) {
			const query = request.query;
			const db = request.database;
			updater.fetch(db, query.mid)
				.then(match => {
					live.broadcastMatchUpdate(match);
					response.json(match);
				}).catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
		} else {
			response.status(401).json({ error: 'Unauthorized' });
		}
	});

	return router;
}
