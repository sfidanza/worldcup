var Router = function(controller) {
	this.views = controller;
};

Router.prototype.serve = function(request, response, ctx) {
	var method = this.views && this.views[ctx.view];
	if (typeof method === 'function') {
		method(request, response, ctx);
		return 200;
	}
};

module.exports = Router;
