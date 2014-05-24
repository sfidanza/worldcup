var server = require("./server/lib/server");
var router = require("./server/lib/router");

server.addRouting("/", new router.Index());
//server.addRouting("/static/", new router.Static());
//server.addRouting("/static/img/", new router.Public());
server.addRouting("/api/", new router.Views(require("./server/views")));
server.addRouting("/api/user/", new router.Views(require("./server/actions/user")));
//server.addRouting("/api/edit/", new router.Views(require("./server/actions/edit")));
//server.addRouting("/api/bet/", new router.Views(require("./server/actions/bet")));
server.start(9090);
