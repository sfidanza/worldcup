/******************************************************************************
 * Index page
 ******************************************************************************/
import { Router } from 'express';
import fs from 'fs';

export default function getRouter() {
	const router = Router();

	router.get('/', function (request, response) {
		const ua = request.headers['user-agent'];
		const index = (/Mobi/.test(ua) || 'mobile' in request.query) ? 'index.mobile.html' : 'index.html';
		
		// return starting page
		response.writeHead(200, { 'Content-Type': 'text/html' });
		
		fs.readFile('./src/pages/' + index, { encoding: 'utf8' }, function (err, data) {
			if (err) throw err;
			response.write(data);
			response.end();
		});
	});

	return router;
}
