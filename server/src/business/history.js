import data from './data/history.json';

const history = {};
export default history;

history.getHistory = function() {
	return data;
};
