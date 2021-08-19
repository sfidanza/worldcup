/**********************************************************
 * Framework
 **********************************************************/
 
 const frw = {};

/**
 * Stops both default action and event propagation
 */
frw.stopEvent = function(event) {
	if (!event) return;
	event.preventDefault();
	event.stopPropagation();
};
