/******************************************************************************
 * User Management
 ******************************************************************************/
import { Router } from 'express';
import users from '../business/users.js';

export default function getRouter(db) {
	const router = Router();

	router.post('/login', function (request, response) {
		const { id, pwd } = request.body;
		users.authenticate(db, id, pwd)
			.then(user => {
				request.session.user = user;
				response.json((user && user.id) ? { 'user': user } : {});
			}).catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
	});

	router.post('/logout', function (request, response) {
		delete request.session.user;
		response.json({});
	});

	router.post('/register', function (request, response) {
		const { id, pwd, name } = request.body;
		users.register(db, id, pwd, 'native', { 'name': name })
			.then(user => {
				request.session.user = user;
				response.json((user && user.id) ? { 'user': user } : {});
			}).catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
	});

	router.put('/changePassword', function (request, response) {
		const { id, pwd, newPwd } = request.body;
		users.register(db, id, pwd, 'native', { 'pwd': newPwd })
			.then(user => {
				request.session.user = user;
				response.json((user && user.id) ? { 'user': user } : {});
			}).catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
	});

	return router;
}
