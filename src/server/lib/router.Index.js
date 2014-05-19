var fs = require("fs");
var frw = require("../frw/frw");

var Router = function() {
};

Router.prototype.serve = function(view, response) {
	if (view === "" || view ==="index") {
		// return starting page
		response.writeHead(200, { "Content-Type": "text/html" });
		
		fs.readFile("./server/templates/index.html", { encoding: "utf8" }, function (err, data) {
			if (err) throw err;
			
			var tpl = new frw.Template();
			tpl.create(data);
			tpl.parse();
			response.write(tpl.retrieve());
			response.end();
		});
		return 200;
	}
};

module.exports = Router;
