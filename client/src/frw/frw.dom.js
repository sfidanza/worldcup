/**********************************************************
 * Framework - DOM utilities
 **********************************************************/

export const dom = {};

/*********************************************************/

dom.updateContainer = function (content, region) {
	dom.addContent(content, region);
	dom.executeScripts(region);
};

dom.executeScripts = function (region) {
	const scripts = region.getElementsByTagName('script');
	for (const script of scripts) {
		window.eval(script.text);
	}
};

dom.addContent = function (content, region) {
	region.innerHTML = content;
};

dom.cleanContainer = function (region) {
	region.innerHTML = '';
};

/*********************************************************/

dom.addOverlay = function () {
	if (!this.overlay) {
		this.overlay = document.createElement('div');
		this.overlay.className = 'uic-overlay';
	}
	dom.positionOverlay();
	document.body.appendChild(this.overlay);
};

dom.positionOverlay = function () {
	const overlay = this.overlay;
	const html = document.documentElement;
	const scroll = dom.getScroll();
	overlay.style.left = (scroll.left) + 'px';
	overlay.style.top = (scroll.top) + 'px';
	overlay.style.width = (html.clientWidth) + 'px';
	overlay.style.height = (html.clientHeight) + 'px';
};

dom.removeOverlay = function () {
	if (this.overlay) {
		this.overlay.parentNode.removeChild(this.overlay);
	}
};

/*********************************************************/

dom.getPos = function (obj) {
	let objTop = 0, objLeft = 0;
	while (obj) {
		objTop += obj.offsetTop;
		objLeft += obj.offsetLeft;
		obj = obj.offsetParent;
	}
	return { top: objTop, left: objLeft };
};

dom.mousePosition = function (e) {
	const html = document.documentElement;
	return {
		x: e.clientX + html.scrollLeft,
		y: e.clientY + html.scrollTop
	};
};

dom.getScroll = function () {
	const html = document.documentElement;
	const body = document.body;
	return {
		top: html.scrollTop + body.scrollTop, // fix for Chrome
		left: html.scrollLeft + body.scrollLeft
	};
};

dom.center = function (element, ratioX, ratioY) {
	ratioX = ratioX || 0.5;
	ratioY = ratioY || 0.5;

	const html = document.documentElement;
	const scroll = dom.getScroll();
	const elTop = scroll.top + Math.max(0, Math.round(html.clientHeight * ratioY - element.clientHeight / 2));
	const elLeft = scroll.left + Math.round(html.clientWidth * ratioX - element.clientWidth / 2);

	element.style.top = elTop + 'px';
	element.style.left = elLeft + 'px';
};
