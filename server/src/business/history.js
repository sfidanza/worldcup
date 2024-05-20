import euro from './data/euro-history.json' with { type: 'json' };
import worldcup from './data/worldcup-history.json' with { type: 'json' };

const history = {};
export default history;

history.getHistory = function() {
	return { euro, worldcup };
};
