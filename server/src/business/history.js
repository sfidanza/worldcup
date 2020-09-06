var data = require("./data/history.json");

var history = {};
module.exports = history;

history.getHistory = function() {
	return data;
};
