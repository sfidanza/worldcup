/******************************************************************************
 * Live scores through server-sent events
 ******************************************************************************/
import { Router } from 'express';
import sse from 'better-sse';
import live from '../business/live.js';
const { createSession } = sse;

export default function getRouter() {
	const router = Router({ mergeParams: true });

	router.get('/', async function (request, response) {
		const session = await createSession(request, response);
		live.register(session);
	});

	return router;
}
