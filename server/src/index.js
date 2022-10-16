import express from 'express';
import { MongoClient } from 'mongodb';
import * as routers from './routers.js';

import rateLimit from 'express-rate-limit';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const {
	MONGO_HOSTNAME,
	MONGO_PORT,
	// MONGO_DB,
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
				dbName: 'worldcup-sessions'
			}),
			resave: true,
			saveUninitialized: true
		}));

		const VALID_YEARS = {
			'2014': 'worldcup2014',
			'2018': 'worldcup2018',
			'2022': 'worldcup2022'
		};
		app.param('year', (req, res, next) => {
			const year = req.params.year;
			if (year in VALID_YEARS) {
				req.database = dbClient.db(VALID_YEARS[year]);
				next(); // return error if not valid db
			} else {
				res.status(404).json({ error: 'Not Found' });
			}
		});

		const dbUsers = dbClient.db('worldcup-users');
		app.use('/api/user/', routers.user(dbUsers));
		app.use('/api/auth/', routers.auth(dbUsers));
		app.use('/api/:year([0-9]{4})/data', routers.data());
		app.use('/api/:year([0-9]{4})/edit/', routers.edit());
		// app.use('/api/:year([0-9]{4})/bet/', routers.bet(dbClient, dbUsers));

		app.listen(NODE_PORT, function () {
			console.log(`App listening on port ${NODE_PORT}!`);
		});
	}).catch(console.error);
