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
			if (/^\d+$/.test(query.mid)) {
				const db = request.database;
				updater.fetch(db, query.mid)
					.then(match => {
						response.json(match);
					}).catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
			} else {
				response.status(400).json({ error: 'Invalid query parameter `mid`' });
			}
		} else {
			response.status(401).json({ error: 'Unauthorized' });
		}
	});

	router.get('/start', function (request, response) {
		const user = request.session.user;
		if (user && user.isAdmin) {
			const query = request.query;
			if (/^\d+$/.test(query.mid)) {
				const db = request.database;
				updater.start(db, query.mid)
					.then(job => {
						if (job) {
							response.status(200).json({ success: 'job started' });
						} else {
							response.status(400).json({ error: 'job already running' });
						}
					});
			} else {
				response.status(400).json({ error: 'Invalid query parameter `mid`' });
			}
		} else {
			response.status(401).json({ error: 'Unauthorized' });
		}
	});

	router.get('/stop', function (request, response) {
		const user = request.session.user;
		if (user && user.isAdmin) {
			const query = request.query;
			if (/^\d+$/.test(query.mid)) {
				updater.stop(query.mid)
					.then(job => {
						if (job) {
							response.status(200).json({ success: 'job stopped' });
						} else {
							response.status(404).json({ error: 'no job defined' });
						}
					});
			} else {
				response.status(400).json({ error: 'Invalid query parameter `mid`' });
			}
		} else {
			response.status(401).json({ error: 'Unauthorized' });
		}
	});

	return router;
}
