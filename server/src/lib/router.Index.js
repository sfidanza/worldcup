const fs = require('fs');

const Router = function() {
};

Router.prototype.serve = function(request, response, ctx) {
	const view = ctx.view;
	if (view === '' || view === 'index') {
		const ua = request.headers['user-agent'];
		const index = (/Mobi/.test(ua) || 'mobile' in request.query) ? 'index.mobile.html' : 'index.html';
		
		// return starting page
		response.writeHead(200, { 'Content-Type': 'text/html' });
		
		fs.readFile('./src/pages/' + index, { encoding: 'utf8' }, function (err, data) {
			if (err) throw err;
			response.write(data);
			response.end();
		});
		return 200;
	}
};

module.exports = Router;
