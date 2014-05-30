var Router = function(controller) {
	this.views = controller;
};

Router.prototype.serve = function(ctx, response) {
	var method = this.views && this.views[ctx.view];
	if (typeof method === 'function') {
		method(ctx, response);
		return 200;
	}
};

module.exports = Router;
