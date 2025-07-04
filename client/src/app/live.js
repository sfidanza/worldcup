/**********************************************************
 * Live scores using server-sent events
 **********************************************************/

let config;
let eventSource;

export const live = {};

/**
 * Set proper configuration for the live stream
 * @param {object} cfg
 * @param {string} cfg.url - the live stream endpoint
 */
live.initialize = function (cfg) {
	config = cfg;
};

live.start = function () {
	if (!eventSource) {
		eventSource = new EventSource(config.url);

		eventSource.addEventListener('watcher-count', (ev) => {
			console.log(`${ev.type} | ${ev.data}`);
		});
		eventSource.addEventListener('match-update', (ev) => {
			console.log(`${ev.type} | ${ev.data}`);
			page.updateMatch(JSON.parse(ev.data));
		});
	}
	return eventSource;
};

live.stop = function () {
	eventSource?.close();
	eventSource = null;
};