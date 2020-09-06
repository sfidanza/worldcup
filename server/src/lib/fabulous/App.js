/********************************************************************
 * fabulous App is a framework to create fabulous apps.
 * 
 * Fabulous is largely inspired from connect, and is developed for
 * learning purposes.
 * https://github.com/senchalabs/connect
 ********************************************************************/

/**
 * Create a new fabulous app.
 */
var App = module.exports = function() {
	this.stack = [];
	this.handler = this.handle.bind(this);
};

/**
 * Plug the given middleware on incoming requests.
 */
App.prototype.use = function(fn) {
	if (Array.isArray(fn)) {
		this.stack.push.apply(this.stack, fn);
	} else {
		this.stack.push(fn);
	}
	return this;
};

/**
 * Handle server requests, delegating them through the middleware stack.
 */
App.prototype.handle = function(req, res, next) {
	var stack = this.stack;
	var index = 0;
	
	// needed to simulate connect
	req.originalUrl = req.originalUrl || req.url;
	
	function nextChild() {
		var child = stack[index++];
		if (child) {
			child(req, res, nextChild);
		} else if (next) {
			next();
		}
	}
	nextChild();
};
