/**********************************************************
 * Framework
 **********************************************************/
 
var frw = {};
module.exports = frw;

frw.Template = require("./frw.Template");

/**
 * Remove blank space on right and left side of the string
 */
if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, "");
	};
}

/**
 * supplant is used by the template engine
 */
String.prototype.supplant = function (o) {
	return this.replace(/{([^{}]*)}/g,
		function (a, b) {
			var r = o[b];
			return (r !== undefined) ? r : a;
		}
	);
};
