/* global frw */
/**********************************************************
 * Framework - DOM utilities
 **********************************************************/

frw.dom = {};

/*********************************************************/

frw.dom.updateContainer = function (content, region) {
	frw.dom.addContent(content, region);
	frw.dom.executeScripts(region);
};

frw.dom.executeScripts = function (region) {
	const scripts = region.getElementsByTagName('script');
	for (const script of scripts) {
		window.eval(script.text);
	}
};

frw.dom.addContent = function (content, region) {
	region.innerHTML = content;
};

frw.dom.cleanContainer = function (region) {
	region.innerHTML = '';
};

/*********************************************************/

frw.dom.addOverlay = function () {
	if (!this.overlay) {
		this.overlay = document.createElement('div');
		this.overlay.className = "uic-overlay";
	}
	frw.dom.positionOverlay();
	document.body.appendChild(this.overlay);
};

frw.dom.positionOverlay = function () {
	var overlay = this.overlay;
	var html = document.documentElement;
	var scroll = frw.dom.getScroll();
	overlay.style.left = (scroll.left) + "px";
	overlay.style.top = (scroll.top) + "px";
	overlay.style.width = (html.clientWidth) + "px";
	overlay.style.height = (html.clientHeight) + "px";
};

frw.dom.removeOverlay = function () {
	if (this.overlay) {
		this.overlay.parentNode.removeChild(this.overlay);
	}
};

/*********************************************************/

frw.dom.getPos = function (obj) {
	var objTop = 0, objLeft = 0;
	while (obj) {
		objTop += obj.offsetTop;
		objLeft += obj.offsetLeft;
		obj = obj.offsetParent;
	}
	return { top: objTop, left: objLeft };
};

frw.dom.mousePosition = function (e) {
	var html = document.documentElement;
	return {
		x: e.clientX + html.scrollLeft,
		y: e.clientY + html.scrollTop
	};
};

frw.dom.getScroll = function () {
	var html = document.documentElement;
	var body = document.body;
	return {
		top: html.scrollTop + body.scrollTop, // fix for Chrome
		left: html.scrollLeft + body.scrollLeft
	};
};

frw.dom.center = function (element, ratioX, ratioY) {
	ratioX = ratioX || 0.5;
	ratioY = ratioY || 0.5;

	var html = document.documentElement;
	var scroll = frw.dom.getScroll();
	var elTop = scroll.top + Math.max(0, Math.round(html.clientHeight * ratioY - element.clientHeight / 2));
	var elLeft = scroll.left + Math.round(html.clientWidth * ratioX - element.clientWidth / 2);

	element.style.top = elTop + "px";
	element.style.left = elLeft + "px";
};
