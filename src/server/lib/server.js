var http = require("http");
var url = require("url");

var routers = {};

exports.addRouting = function(routePath, router) {
	routers[routePath] = router;
};

function splitPath(path) {
	var route = {};
	var pos = path.lastIndexOf("/");
	route.path = path.slice(0, pos + 1);
	route.view = path.slice(pos + 1);
	return route;
};

function getParsedRequest(request) {
	var parsed = url.parse(request.url, true);
	parsed.method = request.method;
	parsed.headers = request.headers;
};

exports.start = function(port) {
	function onRequest(request, response) {
		var parsed = url.parse(request.url, true);
		var route = splitPath(parsed.pathname);
		var router = routers[route.path] || routers["*"];
		
		var status = router && router.serve(route.view, response, parsed);
		if (!status) {
			// send 404
			response.writeHead(404, { "Content-Type": "text/plain"});
			response.end("404 Not Found");
		}
	}
	
	http.createServer(onRequest).listen(port);
};
