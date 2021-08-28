/******************************************************************************
 * Social Authentication/Authorization Management
 * 
 * Live demo of what Google+ is sending in the profile:
 *  https://developers.google.com/+/api/latest/people/get
 ******************************************************************************/
import { Router } from 'express';
import fs from 'fs';
import users from '../business/users.js';
import auth from '../business/auth.js';

export default function getRouter(db) {
	const router = Router();

	router.get('/callback', function (request, response) {
		fs.readFile('./server/pages/signin.html', { encoding: 'utf8' }, function (err, data) {
			if (err) throw err;
			response.writeHead(200, { 'Content-Type': 'text/html' });
			response.write(data);
			response.end();
		});
	});

	router.get('/url', function (request, response) {
		response.json({ url: auth.url() });
	});

	router.get('/revoke', function (request, response) {
		const token = null; // store token somewhere (db, session) to be able to revoke
		auth.revoke(token, (err/*, result*/) => {
			if (err) {
				response.status(500).json({ error: err.message });
			} else {
				response.json({});
			}
		});
	});

	router.get('/profile', function (request, response) {
		const query = request.query;
		auth.profile(query.code, (error, profile) => {
			if (error) {
				response.status(500).json(error);
			} else {
				users.register(db, profile.emails[0].value, null, 'google', {
					'name': profile.displayName
				}).then(user => {
					user.profile = profile;
					request.session.user = user;
					response.json({ user: user });
				}).catch(err => response.status(500).json({ error: err.message }));
			}
		});
	});

	return router;
}
