/**********************************************************
 * Framework
 **********************************************************/
 
var frw = {};

frw.require = function() {
};

/**
 * Update receiver with properties from updater.
 * Values already present in receiver are overwritten by new values.
 */
frw.updateObject = function(receiver, updater) {
	for (var p in updater) {
		receiver[p] = updater[p];
	}
};

/**
 * 
 */
frw.onLoad = function(callback) {
	frw.addListener(window, "load", callback);
};

frw.addListener = function(target, event, callback) {
	if (target.addEventListener) {
		target.addEventListener(event, callback, false);
	} else if (attachEvent) {
		target.attachEvent("on"+event, callback);
	}
};

frw.removeListener = function(target, event, callback) {
	if (target.removeEventListener) {
		target.removeEventListener(event, callback, false);
	} else if (detachEvent) {
		target.detachEvent("on"+event, callback);
	}
};

frw.stopEvent = function(event) {
	if (!event) return;
	if (event.preventDefault) {
		event.preventDefault();
	} else {
		event.returnValue = false;
	}
	if (event.stopPropagation) {
		event.stopPropagation();
	} else {
		event.cancelBubble = true;
	}
};

/**
 * This singleton object helps finding out which browser the application is loaded in.
 */
frw.browser = new function() {
	var ua = navigator.userAgent.toLowerCase();
	
	this.isOpera = (ua.indexOf('opera') > -1);
	this.isChrome = (ua.indexOf('chrome') > -1);
	this.isSafari = (ua.indexOf('safari') > -1);
	this.isIE = (!this.isOpera && ua.indexOf('msie') > -1);
	this.isIE6 = this.isIE && (ua.indexOf('msie 6') > -1);
	this.isIE7 = this.isIE && (ua.indexOf('msie 7') > -1);
	this.isIE8 = this.isIE && (ua.indexOf('msie 8') > -1);
	this.isGecko = (!this.isOpera && !this.isSafari && !this.isChrome && (ua.indexOf('gecko') > -1));
	this.isFirefox = (ua.indexOf('firefox') > -1);
}();
