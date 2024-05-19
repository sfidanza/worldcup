/******************************************************************************
 * User Management
 ******************************************************************************/
import { Router } from 'express';
import users from '../business/users.js';

export default function getRouter(db) {
	const router = Router();

	router.get('/login', function (request, response) {
		const { id, pwd } = request.query;
		users.authenticate(db, id, pwd)
			.then(user => {
				request.session.user = user;
				response.json((user && user.id) ? { 'user': user } : {});
			}).catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
	});

	router.get('/logout', function (request, response) {
		delete request.session.user;
		response.json({});
	});

	router.get('/register', function (request, response) {
		const { id, pwd, name } = request.query;
		users.register(db, id, pwd, 'native', { 'name': name })
			.then(user => {
				request.session.user = user;
				response.json((user && user.id) ? { 'user': user } : {});
			}).catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
	});

	router.get('/changePassword', function (request, response) {
		const { id, pwd, newPwd } = request.query;
		users.register(db, id, pwd, 'native', { 'pwd': newPwd })
			.then(user => {
				request.session.user = user;
				response.json((user && user.id) ? { 'user': user } : {});
			}).catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
	});

	return router;
}
