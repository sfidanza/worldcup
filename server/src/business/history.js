const data = require('./data/history.json');

const history = {};
module.exports = history;

history.getHistory = function() {
	return data;
};
