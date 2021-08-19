/* global frw */
/**********************************************************
 * History Management
 **********************************************************/

frw.history = {};

frw.history.initialize = function(onRestore) {
	this.onRestore = onRestore;
	window.addEventListener("hashchange", this.restoreState.bind(this));
};

frw.history.getCurrentState = function() {
	return window.location.hash.slice(1);
};

frw.history.pushState = function(hash, title) {
	document.title = title;
	this.manualHash = hash;
	window.location.hash = hash;
};

frw.history.restoreState = function() {
	const hash = window.location.hash.slice(1);
	if (hash !== this.manualHash) {
		this.manualHash = null;
		this.onRestore(hash);
	}
};
