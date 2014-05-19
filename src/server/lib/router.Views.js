var Router = function(controller) {
	this.views = controller;
};

Router.prototype.serve = function(view, response, parsedRequest) {
	var method = this.views && this.views[view];
	if (typeof method === 'function') {
		var data = method(parsedRequest);
		response.writeHead(200, { "Content-Type": "application/json" });
		response.write(JSON.stringify(data));
		response.end();
		return 200;
	}
};

module.exports = Router;
