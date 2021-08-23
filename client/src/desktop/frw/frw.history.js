/**********************************************************
 * History Management
 **********************************************************/

export const history = {};

history.initialize = function(onRestore) {
	this.onRestore = onRestore;
	window.addEventListener('hashchange', this.restoreState.bind(this));
};

history.getCurrentState = function() {
	return window.location.hash.slice(1);
};

history.pushState = function(hash, title) {
	document.title = title;
	this.manualHash = hash;
	window.location.hash = hash;
};

history.restoreState = function() {
	const hash = window.location.hash.slice(1);
	if (hash !== this.manualHash) {
		this.manualHash = null;
		this.onRestore(hash);
	}
};
