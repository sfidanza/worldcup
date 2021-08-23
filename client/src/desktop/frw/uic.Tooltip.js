/**********************************************************
 * uic.Tooltip
 **********************************************************/

import { dom } from './frw.dom.js';

/**
 * Create the tooltip container and attaches it to document.body
 * 
 * @param {integer} hideDelay  The number of milliseconds, after the mouse moves off the target that triggered
 *                             the display of the tooltip, before the tooltip is hidden (optional, default=500).
 */
export const Tooltip = function (hideDelay) {
	this.hideDelay = hideDelay ?? 500;
	this.hideTimer = null;
	this.tooltipDiv = document.createElement('div');
	this.tooltipDiv.className = 'uic-tooltip-container';
	this.tooltipDiv.style.display = 'none';
	if (this.hideDelay > 0) {
		// Keep tooltip opened when mouse is inside the tooltip
		this.tooltipDiv.onmouseover = this.stopHideTimer.bind(this);
		// Restart the delayed close when mouse is moved out of the tooltip
		this.tooltipDiv.onmouseout = this.setHideTimer.bind(this);
	}
	document.body.appendChild(this.tooltipDiv);
};

/**
 * Trigger the display of the tooltip with specified content on a mouse event
 * 
 * @param {object} mouseEvent The event which triggered the method call.
 * @param {string} content The HTML content to place in the tooltip container.
 * @param {string} option If 'centerX' is passed, then horizontal position is centered
 */
Tooltip.prototype.showTooltip = function (mouseEvent, content, option) {
	if (this.tooltipDiv) {
		this.stopHideTimer();
		dom.updateContainer(content, this.tooltipDiv);
		this.tooltipDiv.style.display = '';
		this.positionTooltip(mouseEvent, option);
	}
};

/**
 * Set the tooltip on the lower right of the point that triggered the event.
 * If it cannot fit in the viewport on a particular axis, place it to the opposite side on that axis.
 * 
 * @param {object} mouseEvent The event which triggered the method call.
 * @param {string} option If 'centerX' is passed, then x-axis position is centered instead
 */
Tooltip.prototype.positionTooltip = function (mouseEvent, option) {
	const html = document.documentElement;
	const scroll = dom.getScroll();

	const offsetWidth = this.tooltipDiv.offsetWidth;
	let leftPos = (option === 'centerX')
		? (html.clientWidth - offsetWidth) / 2
		: mouseEvent.clientX + 20;
	if (leftPos > html.clientWidth - offsetWidth) {
		leftPos = mouseEvent.clientX - 20 - offsetWidth;
	}
	this.tooltipDiv.style.left = (leftPos + scroll.left) + 'px';

	const offsetHeight = this.tooltipDiv.offsetHeight;
	let topPos = mouseEvent.clientY + 20;
	if (topPos > html.clientHeight - offsetHeight) {
		topPos = mouseEvent.clientY - 20 - offsetHeight;
	}
	this.tooltipDiv.style.top = (topPos + scroll.top) + 'px';
};

/**
 * Hide the tooltip
 */
Tooltip.prototype.closeTooltip = function () {
	if (this.tooltipDiv) {
		this.tooltipDiv.style.display = 'none';
		dom.cleanContainer(this.tooltipDiv);
	}
};

/**
 * Trigger the hide of the tooltip a short time after the mouse leaves the target
 * 
 * @param {integer} hideDelay  A custom duration, in milliseconds, to wait before hiding the tooltip (optional, default defined in constructor).
 */
Tooltip.prototype.hideTooltip = function (hideDelay) {
	this.stopHideTimer();
	this.setHideTimer(hideDelay);
};

/**
 * Stop the timer which triggers the hide of the tooltip
 */
Tooltip.prototype.stopHideTimer = function () {
	if (this.hideTimer) {
		clearTimeout(this.hideTimer);
		this.hideTimer = null;
	}
};

/**
 * Stop the timer which triggers the hide of the tooltip
 * 
 * @param {integer} hideDelay  A custom duration, in milliseconds, to wait before hiding the tooltip (optional, default defined in constructor).
 */
Tooltip.prototype.setHideTimer = function (hideDelay) {
	this.hideTimer = setTimeout(this.closeTooltip.bind(this), hideDelay ?? this.hideDelay);
};

/**
 * Method must be called when unloading the component. Removes DOM reference.
 */
Tooltip.prototype.destroy = function () {
	if (this.tooltipDiv) {
		this.tooltipDiv.onmouseover = '';
		this.tooltipDiv.onmouseout = '';
		this.tooltipDiv = null;
	}
};
