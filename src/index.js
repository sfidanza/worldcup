var settings = require('./server/settings.js');
var fabulous = require("./server/lib/fabulous-pack");
var server = require("./server/lib/server");
var router = require("./server/lib/router");
var MongoClient = require('promised-mongo');
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

var database = MongoClient('mongodb://127.0.0.1:27017/worldcup2014');
database.on('error', function(err) {
	if (err) throw err;
});

var app = new fabulous.App()
//	.use(fabulous.defaults) // where fabulous.defaults = [parseQuery, parseCookie, parseBody, easyRespond]
	.use(cookieParser()) // required before session.
//	.use(fabulous.session(...config...))
	.use(session({
		secret: settings.COOKIE_SEED,
		store: new MongoStore({
			db: database,
		})
	}))
	.use(server.start(database));

http.createServer(app.handler).listen(9090);
