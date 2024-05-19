/******************************************************************************
 * Competition data import
 * 
 * With admin rights:
 *   /api/<year>/drop    -> drop the database
 *   /api/<year>/preview -> preview the data from the filesystem
 *   /api/<year>/import  -> import the filesystem data in database
 ******************************************************************************/
import { Router } from 'express';
import importer from '../admin/importer.js';

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

	return router;
}
