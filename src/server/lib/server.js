var http = require("http");
var url = require("url");

var routers = {};

exports.addRouting = function(routePath, router) {
	routers[routePath] = router;
};

exports.start = function(port, db) {
	function onRequest(request, response) {
		var parsed = url.parse(request.url, true);
		var route = splitPath(parsed.pathname);
		var router = routers[route.path] || routers["*"];
		response.json = respondJson;
		response.error = respondError;
		
		var status = router && router.serve({
			view: route.view,
			request: parsed,
			db: db
		}, response);
		if (!status) {
			// send 404
			response.error(404);
		}
	}
	
	http.createServer(onRequest).listen(port);
};

function splitPath(path) {
	var route = {};
	var pos = path.lastIndexOf("/");
	route.path = path.slice(0, pos + 1);
	route.view = path.slice(pos + 1);
	return route;
}

function getParsedRequest(request) {
	var parsed = url.parse(request.url, true);
	parsed.method = request.method;
	parsed.headers = request.headers;
}

function respondJson(data) {
	this.writeHead(200, { "Content-Type": "application/json" });
	this.write(JSON.stringify(data || {}));
	this.end();
}

function respondError(errorCode) {
	if (!ERRORS[errorCode]) errorCode = 500;
	this.writeHead(errorCode, { "Content-Type": "text/plain"});
	this.end(ERRORS[errorCode]);
}

var ERRORS = {
	400: "Bad request", // The request had bad syntax or was inherently impossible to be satisfied.
	401: "Unauthorized", // The parameter to this message gives a specification of authorization schemes which are acceptable. The client should retry the request with a suitable Authorization header.
	402: "PaymentRequired", // The parameter to this message gives a specification of charging schemes acceptable. The client may retry the request with a suitable ChargeTo header.
	403: "Forbidden", // The request is for something forbidden. Authorization will not help.
	404: "Not found", // The server has not found anything matching the URI given
	500: "Internal Error", // The server encountered an unexpected condition which prevented it from fulfilling the request.
	501: "Not implemented", // The server does not support the facility required.
	502: "Service temporarily overloaded", // The server cannot process the request due to a high load (whether HTTP servicing or other requests). The implication is that this is a temporary condition which maybe alleviated at other times.
	503: "Gateway timeout", // 	This is equivalent to Internal Error 500, but in the case of a server which is in turn accessing some other service, this indicates that the response from the other service did not return within a time that the gateway was prepared to wait. As from the point of view of the client and the HTTP transaction the other service is hidden within the server, this maybe treated identically to Internal error 500, but has more diagnostic value.
};
