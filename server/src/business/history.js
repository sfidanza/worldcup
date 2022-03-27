import data from './data/history.json' assert { type: 'json' };

const history = {};
export default history;

history.getHistory = function() {
	return data;
};
