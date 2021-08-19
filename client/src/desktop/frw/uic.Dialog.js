/* global frw */
/**********************************************************
 * uic.Dialog
 **********************************************************/
 
const uic = {};

uic.Dialog = function(params) {
	this.params = params;
	
	this.dom = {};
	this.dom.dlg = document.getElementById(params.id);
	this.dom.close = document.getElementById(params.id + "-close");
	this.dom.title = this.dom.dlg.getElementsByTagName('h5')[0];
	this.dom.body = document.getElementById(params.id + "-body");
	
	this.dom.close.onclick = this.hide.bind(this);
	this.dom.close.onmousedown = function(e) { if (e) e.cancelBubble=true; };
	this.dom.title.onmousedown = frw.drag.start.bind(frw.drag, this.dom.dlg);
};

uic.Dialog.prototype.destroy = function() {
	this.dom.dlg = null;
	this.dom.close = null;
	this.dom.title = null;
	this.dom.body = null;
};

uic.Dialog.prototype.center = function() {
	frw.dom.center(this.dom.dlg, 0.5, 0.4);
};

uic.Dialog.prototype.handleEvent = function(event) {
	if (event.type === 'resize') {
		this.keepInPlace();
	}
};

uic.Dialog.prototype.show = function() {
	if (this.params.centered) {
		this.center();
	}
	
	document.body.style.overflow = "hidden";
	frw.dom.addOverlay();
	
	const dlg = this.dom.dlg;
	dlg.parentNode.removeChild(dlg);
	document.body.appendChild(dlg);
	dlg.style.visibility = "visible";
	
	window.addEventListener("resize", this); // registers this.handleEvent in the correct scope
};

uic.Dialog.prototype.keepInPlace = function() {
	if (this.params.centered) this.center();
	frw.dom.positionOverlay();
};

uic.Dialog.prototype.isVisible = function() {
	return (this.dom.dlg.style.visibility == "visible");
};

uic.Dialog.prototype.hide = function() {
	if (this.isVisible()) {
		window.removeEventListener("resize", this);
		document.body.style.overflow = "auto";
		frw.dom.removeOverlay();
		const dlg = this.dom.dlg;
		dlg.style.visibility = "hidden";
		dlg.style.top = "0px";
		dlg.style.left = "0px";
	}
	return false;
};

uic.Dialog.prototype.setTitle = function(title) {
	this.dom.title.innerHTML = title;
};

uic.Dialog.prototype.getBody = function() {
	return this.dom.body;
};

/*********************************************************/

frw.drag = {
	dragged: null,
	dragOffset: {x:0, y:0}
};

frw.drag.start = function(dragged, e) {
	frw.stopEvent(e);
	this.dragged = dragged;
	const iPos = frw.dom.getPos(dragged);
	const mPos = frw.dom.mousePosition(e);
	this.dragOffset.x = mPos.x - iPos.left;
	this.dragOffset.y = mPos.y - iPos.top;
	document.onmousemove = this.move.bind(this);
	document.onmouseup = this.end.bind(this);
};

frw.drag.move = function(e) {
	frw.stopEvent(e);
	if (this.dragged != null) {
		const mPos = frw.dom.mousePosition(e);
		this.dragged.style.left = (mPos.x - this.dragOffset.x) + 'px';
		this.dragged.style.top = (mPos.y - this.dragOffset.y) + 'px';
	}
};

frw.drag.end = function(e) {
	frw.stopEvent(e);
	if (this.dragged != null) {
		this.dragged = null;
		document.onmousemove = null;
		document.onmouseup = null;
	}
};
