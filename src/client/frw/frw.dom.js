/**********************************************************
 * Framework - DOM utilities
 **********************************************************/
 
frw.dom = {};

/*********************************************************/

frw.dom.updateContainer = function(content, region) {
	if (region.innerHTML != "") {
		frw.dom.cleanContainer(region);
	}
	region = frw.dom.addContent(content, region);
	frw.dom.executeScript(region);
};

frw.dom.cleanContainer = function(container) {
	while (container.firstChild) {
		frw.dom.removeContent(container.firstChild);
	}
};

frw.dom.executeScript = function(region) {
	var d = region.getElementsByTagName("script");
	for (var i=0, len=d.length; i<len; i++) {
		if (d[i].src == "") {
			if (window.execScript) {
				window.execScript(d[i].text); // eval in global scope for IE
			} else {
				window.eval(d[i].text);
			}
		} else {
			frw.require(d[i].src);
		}
	}
};

frw.dom.addContent = frw.browser.isIE ? function(content, region) {
	if (region.tagName == "TBODY") {
		var trashBinDiv = document.createElement('div');
		trashBinDiv.innerHTML = "<table><tbody>" + content + "</tbody></table>";
		var tbody = trashBinDiv.getElementsByTagName("tbody")[0];
		
		// TODO: Try the appendChild method
		tbody.id = region.id;
		tbody.className = region.className;
		
		var oldTbody = region.parentNode.replaceChild(tbody, region);
		var table = trashBinDiv.getElementsByTagName("table")[0];
		table.appendChild(oldTbody);
		trashBinDiv.innerHTML = "";
		trashBinDiv = null;		
		return tbody;
	} else {
		region.innerHTML = content;
		return region;
	}
} : function(content, region) {
	region.innerHTML = content;
	return region;
};

frw.dom.removeContent = frw.browser.isIE ? function(region) {
	if (!region || region.tagName == 'BODY') {
		return;
	} else if (region.tagName == 'TBODY' || region.tagName == 'TR') {
		var trashBinDiv = document.createElement('div');
		var t = document.createElement('table');
		t.appendChild(region);
		trashBinDiv.appendChild(t);
		trashBinDiv.innerHTML = "";
		trashBinDiv = null;		
	} else if (region.outerHTML) {
		region.outerHTML = "";
	} else { // text nodes
		region.parentNode.removeChild(region);
	}
} : function(region){
	if(region && region.parentNode && region.tagName != 'BODY'){
		region.parentNode.removeChild(region);
	}
};

/*********************************************************/

frw.dom.hasClass = function(obj, name) {
	if (!obj.className) {
		return false;
	} else if (obj.className == name) {
		return true;
	} else {
		return (obj.className.search(new RegExp("\\b"+name+"\\b")) != -1);
	}
};

frw.dom.addClass = function(obj, name) {
	if (!obj.className) {
		obj.className = name;
	} else if (!frw.dom.hasClass(obj, name)) {
		obj.className += " "+name;
	}
};

frw.dom.removeClass = function(obj, name) {
	if (obj.className == name) {
		obj.className = "";
	} else if (frw.dom.hasClass(obj, name)) {
		var classList = obj.className.split(" ");
		var newList = [];
		for (var i=0; i<classList.length; i++) {
			if (classList[i] != name) newList.push(classList[i]);
		}
		obj.className = newList.join(" ");
	}
};

/*********************************************************/

frw.dom.addOverlay = function() {
	if (!this.overlay) {
		this.overlay = document.createElement('div');
		this.overlay.className = "uic-overlay";
	}
	frw.dom.positionOverlay();
	document.body.appendChild(this.overlay);
};

frw.dom.positionOverlay = function() {
	var overlay = this.overlay;
	var html = document.documentElement;
	var scroll = frw.dom.getScroll();
	overlay.style.left = (scroll.left)+"px";
	overlay.style.top = (scroll.top)+"px";
	overlay.style.width = (html.clientWidth)+"px";
	overlay.style.height = (html.clientHeight)+"px";
};

frw.dom.removeOverlay = function() {
	if (this.overlay) {
		this.overlay.parentNode.removeChild(this.overlay);
	}
};

/*********************************************************/

frw.dom.getPos = function(obj) {
	var objTop = objLeft = 0;
	while (obj) {
		objTop += obj.offsetTop;
		objLeft += obj.offsetLeft;
		obj = obj.offsetParent;
	}
	return {top: objTop, left: objLeft};
};

frw.dom.mousePosition = function(e) {
	var html = document.documentElement;
	return {
		x: e.clientX + html.scrollLeft,
		y: e.clientY + html.scrollTop
	};
};

frw.dom.getScroll = function() {
	var html = document.documentElement;
	var body = document.body;
	return {
		top: html.scrollTop + body.scrollTop, // fix for Chrome
		left: html.scrollLeft + body.scrollLeft
	};
};

frw.dom.center = function(element, ratioX, ratioY) {
	ratioX = ratioX || 0.5;
	ratioY = ratioY || 0.5;
	
	var html = document.documentElement;
	var scroll = frw.dom.getScroll();
	var elTop = scroll.top + Math.max(0, Math.round(html.clientHeight*ratioY - element.clientHeight/2));
	var elLeft = scroll.left + Math.round(html.clientWidth*ratioX - element.clientWidth/2);
	
	element.style.top = elTop + "px";
	element.style.left = elLeft + "px";
};
