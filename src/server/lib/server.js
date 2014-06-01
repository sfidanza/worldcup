var http = require("http");
var url = require("url");
var cookie = require("cookie");
var sign = require("cookie-signature").sign;

var routers = {};

exports.addRouting = function(routePath, router) {
	routers[routePath] = router;
};

exports.start = function(db) {
	return function onRequest(request, response, next) {
		var parsed = url.parse(request.url, true);
		var route = getRoute(parsed.pathname);
		var router = routers[route.base] || routers["*"];
		
		request.query = parsed.query;
		
		response.json = respondJson;
		response.error = respondError;
		response.cookie = setCookie; // compatibility with express for sessions
		response.req = request; // compatibility with express for sessions
		
		var status = router && router.serve(request, response, {
			view: route.view,
			db: db
		});
		if (!status) { // no matching route or view
			response.error(404);
		}
		next();
	};
};

function getRoute(path) {
	var pos = path.lastIndexOf("/");
	return {
		path: path,
		base: path.slice(0, pos + 1),
		view: path.slice(pos + 1)
	};
}

function respondJson(data) {
	this.writeHead(200, { "Content-Type": "application/json" });
	this.write(JSON.stringify(data || {}));
	this.end();
}

function respondError(errorCode) {
	if (!http.STATUS_CODES[errorCode]) errorCode = 500;
	if (errorCode === 401) {
		this.setHeader("WWW-Authenticate", "FormBased");
	}
	this.writeHead(errorCode, { "Content-Type": "text/plain"});
	this.end(http.STATUS_CODES[errorCode]);
}


function setCookie(name, val, options) {
	options = options || {};
	var secret = this.req.secret;
	var signed = options.signed;
	if (signed && !secret) throw new Error('cookieParser("secret") required for signed cookies');
	if ('number' == typeof val) val = val.toString();
	if ('object' == typeof val) val = 'j:' + JSON.stringify(val);
	if (signed) val = 's:' + sign(val, secret);
	if ('maxAge' in options) {
		options.expires = new Date(Date.now() + options.maxAge);
		options.maxAge /= 1000;
	}
	if (null == options.path) options.path = '/';
	var headerVal = cookie.serialize(name, String(val), options);
	
	// supports multiple 'res.cookie' calls by getting previous value
	var prev = this.getHeader('Set-Cookie');
	if (prev) {
		if (Array.isArray(prev)) {
			headerVal = prev.concat(headerVal);
		} else {
			headerVal = [ prev, headerVal ];
		}
	}
	this.setHeader('Set-Cookie', headerVal);
	return this;
}