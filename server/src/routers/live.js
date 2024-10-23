/******************************************************************************
 * Live scores through server-sent events
 ******************************************************************************/
import { Router } from 'express';
import { createSession } from 'better-sse';
import live from '../business/live.js';

export default function getRouter() {
	const router = Router({ mergeParams: true });

	router.get('/', async function (request, response) {
		const session = await createSession(request, response);
		live.register(session);
	});

	return router;
}
