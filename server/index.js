var fabulous = require("./src/lib/fabulous-pack");
var server = require("./src/lib/server");
var router = require("./src/lib/router");
var MongoClient = require('mongodb').MongoClient;
var http = require("http");

var session = require('express-session');
var MongoStore = require('./src/lib/fabulous/MongoStore')(session.Store);

server.addRouting("/", new router.Index());
server.addRouting("/api/", new router.Views(require("./src/views")));
//server.addRouting("/api/cache/", new router.Views(require("./views.cache")));
server.addRouting("/api/user/", new router.Views(require("./src/actions/user")));
server.addRouting("/api/auth/", new router.Views(require("./src/actions/auth")));
server.addRouting("/api/edit/", new router.Views(require("./src/actions/edit")));
server.addRouting("/api/bet/", new router.Views(require("./src/actions/bet")));

const {
	MONGO_HOSTNAME,
	MONGO_PORT,
	MONGO_DB,
	MONGO_USER,
	MONGO_PWD,
	NODE_PORT,
	COOKIE_SEED
} = process.env;
let app = new fabulous.App();

MongoClient.connect(`mongodb://${MONGO_USER}:${MONGO_PWD}@${MONGO_HOSTNAME}:${MONGO_PORT}`, {
		useUnifiedTopology: true
	}).then(client => {
		console.log("Connected to mongodb!");
		let database = client.db(MONGO_DB);

		app.use(session({
				secret: COOKIE_SEED,
				store: new MongoStore({
					db: database,
				}),
				resave: true,
				saveUninitialized: true
			}))
			.use(server.start(database));

		http.createServer(app.handler).listen(NODE_PORT, function () {
			console.log(`App listening on port ${NODE_PORT}!`);
		});
	}).catch(console.error);
