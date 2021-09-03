/**********************************************************
 * uic.Dialog
 **********************************************************/

import { dom } from './frw.dom.js';

export const Dialog = function(params) {
	this.params = params;
	
	this.dom = {};
	this.dom.dlg = document.getElementById(params.id);
	this.dom.close = document.getElementById(params.id + '-close');
	this.dom.title = this.dom.dlg.getElementsByTagName('h5')[0];
	this.dom.body = document.getElementById(params.id + '-body');
	
	this.dom.close.onclick = this.hide.bind(this);
	this.dom.close.onmousedown = function(e) { if (e) e.cancelBubble = true; };
	this.dom.title.onmousedown = drag.start.bind(drag, this.dom.dlg);
};

Dialog.prototype.destroy = function() {
	this.dom.dlg = null;
	this.dom.close = null;
	this.dom.title = null;
	this.dom.body = null;
};

Dialog.prototype.center = function() {
	dom.center(this.dom.dlg, 0.5, 0.4);
};

Dialog.prototype.handleEvent = function(event) {
	if (event.type === 'resize') {
		this.keepInPlace();
	}
};

Dialog.prototype.show = function() {
	if (this.params.centered) {
		this.center();
	}
	
	document.body.style.overflow = 'hidden';
	dom.addOverlay();
	
	const dlg = this.dom.dlg;
	dlg.parentNode.removeChild(dlg);
	document.body.appendChild(dlg);
	dlg.style.visibility = 'visible';
	
	window.addEventListener('resize', this); // registers this.handleEvent in the correct scope
};

Dialog.prototype.keepInPlace = function() {
	if (this.params.centered) this.center();
	dom.positionOverlay();
};

Dialog.prototype.isVisible = function() {
	return (this.dom.dlg.style.visibility == 'visible');
};

Dialog.prototype.hide = function() {
	if (this.isVisible()) {
		window.removeEventListener('resize', this);
		document.body.style.overflow = 'auto';
		dom.removeOverlay();
		const dlg = this.dom.dlg;
		dlg.style.visibility = 'hidden';
		dlg.style.top = '0px';
		dlg.style.left = '0px';
	}
	return false;
};

Dialog.prototype.setTitle = function(title) {
	this.dom.title.innerHTML = title;
};

Dialog.prototype.getBody = function() {
	return this.dom.body;
};

/*********************************************************/

const drag = {
	dragged: null,
	dragOffset: {x:0, y:0}
};

drag.start = function(dragged, e) {
	e.preventDefault();
	this.dragged = dragged;
	const iPos = dom.getPos(dragged);
	const mPos = dom.mousePosition(e);
	this.dragOffset.x = mPos.x - iPos.left;
	this.dragOffset.y = mPos.y - iPos.top;
	document.onmousemove = this.move.bind(this);
	document.onmouseup = this.end.bind(this);
};

drag.move = function(e) {
	e.preventDefault();
	if (this.dragged != null) {
		const mPos = dom.mousePosition(e);
		this.dragged.style.left = (mPos.x - this.dragOffset.x) + 'px';
		this.dragged.style.top = (mPos.y - this.dragOffset.y) + 'px';
	}
};

drag.end = function(e) {
	e.preventDefault();
	if (this.dragged != null) {
		this.dragged = null;
		document.onmousemove = null;
		document.onmouseup = null;
	}
};
