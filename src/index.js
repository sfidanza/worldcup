var server = require("./server/lib/server");
var router = require("./server/lib/router");
var MongoClient = require('mongodb').MongoClient;

server.addRouting("/", new router.Index());
server.addRouting("/api/", new router.Views(require("./server/views")));
//server.addRouting("/api/cache/", new router.Views(require("./server/views.cache")));
//server.addRouting("/api/user/", new router.Views(require("./server/actions/user")));
//server.addRouting("/api/edit/", new router.Views(require("./server/actions/edit")));
//server.addRouting("/api/bet/", new router.Views(require("./server/actions/bet")));


MongoClient.connect('mongodb://127.0.0.1:27017/worldcup2014', function(err, database) {
	if (err) throw err;
	server.start(9090, database);
});
