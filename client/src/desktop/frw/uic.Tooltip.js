/* global frw, uic */
/**********************************************************
 * uic.Tooltip
 **********************************************************/
 
//frw.namespace("uic");

/**
 * Create the tooltip container and attaches it to document.body
 * 
 * @param {integer} hideDelay  The number of milliseconds, after the mouse moves off the target that triggered
 *                             the display of the tooltip, before the tooltip is hidden (optional, default=500).
 */
uic.Tooltip = function(hideDelay) {
	this.hideDelay = (hideDelay == null) ? 500 : hideDelay;
	this.tooltipDiv = document.createElement("div");
	this.tooltipDiv.className = "uic-tooltip-container";
	this.tooltipDiv.style.display = "none";
	this.tooltipDiv.onmouseover = this.mouseOverTooltip.bind(this);
	this.tooltipDiv.onmouseout = this.mouseOutTooltip.bind(this);
	document.body.appendChild(this.tooltipDiv);
	this.hideTimer = null;
};

/**
 * Trigger the display of the tooltip with specified content on a mouse event
 * 
 * @param {object} mouseEvent The event which triggered the method call.
 * @param {string} content The HTML content to place in the tooltip container.
 */
uic.Tooltip.prototype.showTooltip = function(mouseEvent, content) {
	if (this.tooltipDiv) {
		this.stopHideTimer();
		frw.dom.updateContainer(content, this.tooltipDiv);
		this.tooltipDiv.style.display = "";
		this.positionTooltip(mouseEvent);
	}
};

/**
 * Set the tooltip position depending on the mouse and the viewport
 */
uic.Tooltip.prototype.positionTooltip = function(mouseEvent) {
	var html = document.documentElement;
	var scroll = frw.dom.getScroll();
	
	// Set the tooltip on the lower right of the point that triggered the event.
	// If it cannot fit on a particular axis, place it to the opposite side on that axis. 
	var leftPos = mouseEvent.clientX + 20;
	var offsetWidth = this.tooltipDiv.offsetWidth;
	if (leftPos > html.clientWidth - offsetWidth) {
		leftPos = mouseEvent.clientX - 20 - offsetWidth;
	}
	this.tooltipDiv.style.left = (leftPos + scroll.left) + "px";
	
	var topPos = mouseEvent.clientY + 20;
	var offsetHeight = this.tooltipDiv.offsetHeight;
	if (topPos > html.clientHeight - offsetHeight) {
		topPos = mouseEvent.clientY - 20 - offsetHeight;
	}
	this.tooltipDiv.style.top = (topPos + scroll.top) + "px";
};

/**
 * Trigger the hide of the tooltip a short time after the mouse leaves the target
 * 
 * @param {integer} hideDelay  A custom duration, in milliseconds, to wait before hiding the tooltip (optional, default defined in constructor).
 */
uic.Tooltip.prototype.hideTooltip = function(hideDelay) {
	this.stopHideTimer();
	this.hideTimer = setTimeout(this.closeTooltip.bind(this), hideDelay || this.hideDelay);
};

/**
 * Stop the timer which triggers the hide of the tooltip
 */
uic.Tooltip.prototype.stopHideTimer = function() {
	if (this.hideTimer) {
		clearTimeout(this.hideTimer);
		this.hideTimer = null;
	}
};

/**
 * Hide the tooltip
 */
uic.Tooltip.prototype.closeTooltip = function() {
	if (this.tooltipDiv){
		this.tooltipDiv.style.display = "none";
		frw.dom.cleanContainer(this.tooltipDiv);
	}
};

/**
 * Disable the delayed close of the tooltip if the mouse was moved inside the tooltip
 */
uic.Tooltip.prototype.mouseOverTooltip = function(mouseEvent) {
	this.stopHideTimer();
	this.positionTooltip(mouseEvent);
};

/**
 * Restart the delayed close of the tooltip if the mouse was moved out of the tooltip
 */
uic.Tooltip.prototype.mouseOutTooltip = function(){
	this.hideTimer = setTimeout(this.closeTooltip.bind(this), this.hideDelay);
};

/**
 * Method must be called when unloading the component. Removes DOM reference.
 */
uic.Tooltip.prototype.destroy = function() {
	if (this.tooltipDiv) {
		this.tooltipDiv.onmouseover = "";
		this.tooltipDiv.onmouseout = "";
		this.tooltipDiv = null;
	}
};
