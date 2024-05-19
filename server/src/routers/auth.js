/******************************************************************************
 * Social Authentication/Authorization Management
 * 
 * Live demo of what Google+ is sending in the profile:
 *  https://developers.google.com/+/api/latest/people/get
 ******************************************************************************/
import { Router } from 'express';
import users from '../business/users.js';
import auth from '../business/auth.js';

export default function getRouter(db) {
	const router = Router();

	router.get('/url', function (request, response) {
		response.json({ url: auth.url() });
	});

	router.get('/revoke', function (request, response) {
		const token = null; // store token in session at login time to be able to revoke
		auth.revoke(token)
			.then((err/*, result*/) => {
				if (err) {
					response.status(err.statusCode ?? 500).json({ error: err.message });
				} else {
					response.json({});
				}
			});
	});

	router.get('/profile', function (request, response) {
		const query = request.query;
		auth.profile(query.code)
			.then(profile => {
				// profile photo: profile.photos?.[0]?.url
				return users.register(db, profile.resourceName, null, 'google', {
					'name': profile.names?.[0]?.displayName
				});
			}).then(user => {
				request.session.user = user;
				response.json((user && user.id) ? { 'user': user } : {});
			}).catch(err => {
				console.error(err);
				response.status(err.statusCode ?? 500).json({ error: err.message });
			});
	});

	return router;
}
