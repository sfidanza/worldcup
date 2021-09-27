import express from 'express';
import { MongoClient } from 'mongodb';
import * as routers from './routers.js';

import session from 'express-session';
import MongoStore from 'connect-mongo';

const {
	MONGO_HOSTNAME,
	MONGO_PORT,
	MONGO_DB,
	MONGO_USER,
	MONGO_PWD,
	NODE_PORT,
	COOKIE_SEED
} = process.env;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

new MongoClient(`mongodb://${MONGO_USER}:${MONGO_PWD}@${MONGO_HOSTNAME}:${MONGO_PORT}`)
	.connect()
	.then(dbClient => {
		console.log('Connected to mongodb!');
		const database = dbClient.db(MONGO_DB);

		app.use(session({
			secret: COOKIE_SEED,
			store: MongoStore.create({
				client: dbClient,
				dbName: MONGO_DB
			}),
			resave: true,
			saveUninitialized: true
		}));

		app.use('/api/', routers.data(database));
		app.use('/api/user/', routers.user(database));
		app.use('/api/auth/', routers.auth(database));
		app.use('/api/edit/', routers.edit(database));
		app.use('/api/bet/', routers.bet(database));

		app.listen(NODE_PORT, function () {
			console.log(`App listening on port ${NODE_PORT}!`);
		});
	}).catch(console.error);
