var settings = require('./server/settings.js');
var fabulous = require("./server/lib/fabulous-pack");
var server = require("./server/lib/server");
var router = require("./server/lib/router");
var MongoClient = require('mongodb').MongoClient;
var http = require("http");

var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('./server/lib/fabulous/MongoStore')(session.Store);

server.addRouting("/", new router.Index());
server.addRouting("/api/", new router.Views(require("./server/views")));
//server.addRouting("/api/cache/", new router.Views(require("./server/views.cache")));
server.addRouting("/api/user/", new router.Views(require("./server/actions/user")));
server.addRouting("/api/auth/", new router.Views(require("./server/actions/auth")));
server.addRouting("/api/edit/", new router.Views(require("./server/actions/edit")));
server.addRouting("/api/bet/", new router.Views(require("./server/actions/bet")));
// Serve statics if nginx is not deployed
// server.addRouting("/static/", new router.Static());
// server.addRouting("/static/img/", new router.Public("./client/img/"));
// server.addRouting("/static/img/flags/", new router.Public("./client/img/flags/"));
// server.addRouting("/static/img/signin/", new router.Public("./client/img/signin/"));

const {
	MONGO_HOSTNAME,
	MONGO_PORT,
	MONGO_DB,
	MONGO_USER,
	MONGO_PWD,
	NODE_PORT
} = process.env;
let app = new fabulous.App();

MongoClient.connect(`mongodb://${MONGO_USER}:${MONGO_PWD}@${MONGO_HOSTNAME}:${MONGO_PORT}`, {
		useUnifiedTopology: true
	}).then(client => {
		console.log("Connected to mongodb!");
		let database = client.db(MONGO_DB);

		app.use(cookieParser()) // required before session.
			.use(session({
				secret: settings.COOKIE_SEED,
				store: new MongoStore({
					db: database,
				})
			}))
			.use(server.start(database));

		http.createServer(app.handler).listen(NODE_PORT, function () {
			console.log(`App listening on port ${NODE_PORT}!`);
		});
	}).catch(console.error);
