import data from './data/history.json' with { type: 'json' };

const history = {};
export default history;

history.getHistory = function() {
	return data;
};
