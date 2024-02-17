import express from 'express';
import { MongoClient } from 'mongodb';
import * as routers from './routers.js';
import database from './database.js';

import rateLimit from 'express-rate-limit';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const {
	MONGO_HOSTNAME,
	MONGO_PORT,
	MONGO_USER,
	MONGO_PWD,
	NODE_PORT,
	COOKIE_SEED
} = process.env;

const app = express();

const limiter = rateLimit({
	windowMs: 10 * 1000, // 10s
	max: 5
});

app.use(limiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('trust proxy', 1); // trust our own nginx proxy
app.get('/api/ip', (request, response) => response.send(request.ip));
app.get('/api/x-forwarded-for', (request, response) => response.send(request.headers['x-forwarded-for']));

new MongoClient(`mongodb://${MONGO_USER}:${MONGO_PWD}@${MONGO_HOSTNAME}:${MONGO_PORT}`)
	.connect()
	.then(dbClient => {
		console.log('Connected to mongodb!');

		app.use(session({
			secret: COOKIE_SEED,
			cookie: {
				secure: 'auto'
			},
			store: MongoStore.create({
				client: dbClient,
				dbName: database.DB_SESSIONS
			}),
			resave: true,
			saveUninitialized: true
		}));

		app.param('year', database.getDataAccess(dbClient));

		const dbUsers = dbClient.db(database.DB_USERS);
		app.use('/api/user/', routers.user(dbUsers));
		app.use('/api/auth/', routers.auth(dbUsers));
		app.use('/api/:year([0-9]{4})/data/', routers.data(dbUsers));
		app.use('/api/:year([0-9]{4})/edit/', routers.edit());
		app.use('/api/:year([0-9]{4})/bet/', routers.bet(dbUsers));
		app.use('/api/:year([0-9]{4})/ics/', routers.ics());

		app.listen(NODE_PORT, function () {
			console.log(`App listening on port ${NODE_PORT}!`);
		});
	}).catch(console.error);
