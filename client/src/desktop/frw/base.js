/**
 * bind a method to a scope
 */
Function.prototype.bind = function(scope) {
	var method = this, args = Array.prototype.slice.call(arguments, 1);
	return function() {
		var params = Array.prototype.slice.call(arguments, 0);
		return method.apply(scope, args.concat(params));
//		return method.apply(scope, args.concat.apply(args, arguments)); //faster in FF, slower in Chrome
	};
};

Function.prototype.bindListener = function(scope) {
	var method = this, args = Array.prototype.slice.call(arguments, 1);
	if (!this._bindings) this._bindings = [];
	var listener;
	for (var i=0, len=this._bindings.length; i<len; i++) {
		if (this._bindings[i].scope === scope) { // args should be checked too
			listener = this._bindings[i].listener;
			break;
		}
	}
	if (!listener) {
		listener = function() {
			var params = Array.prototype.slice.call(arguments, 0);
			return method.apply(scope, args.concat(params));
		};
		this._bindings.push({
			scope: scope,
			listener: listener
		});
	}
	return listener;
};

/**
 * Add array extensions
 */
// Reference: http://es5.github.com/#x15.4.4.19
if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {
    var T, A, k;
    if (this == null) {
      throw new TypeError(" this is null or not defined");
    }
    
    // Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);
    var len = O.length >>> 0;
    
    // If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if ({}.toString.call(callback) != "[object Function]") {
      throw new TypeError(callback + " is not a function");
    }
    
    if (thisArg) {
      T = thisArg;
    }
    A = new Array(len);
    k = 0;
    while(k < len) {
      var kValue, mappedValue;
      if (k in O) {
        kValue = O[k];
        mappedValue = callback.call(T, kValue, k, O);
        A[k] = mappedValue;
      }
      k++;
    }
    
    return A;
  };
}

/**
 * Capitalize first letter
 */
String.prototype.capitalize = function() {
	return this.replace( /(?:^|\s)([a-z])/g,
		function(m, p1) {
			return p1.toUpperCase();
		}
	);
//	return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase();
};

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

/**
 * Basic JSON support for IE
 */
if (typeof JSON === "undefined") {
	/* jshint -W020 */
	JSON = {};
	JSON.parse = function(jsonstring) {
		try {
			return eval('('+jsonstring+')');
		} catch(ex) {
			if (frw.debug) console.error('Syntax error parsing JSON string:', ex);
			return null;
		}
	};
	/* jshint +W020 */
}

/**
 * Basic getElementsByClassName support for IE
 */
function getElementsByClassName(node, className) {
	if (node.getElementsByClassName) {
		return node.getElementsByClassName(className);
	} else {
		// basic support for IE
		var results = [];
		var nodeList = node.getElementsByTagName("*");
		for (var i=0, len=nodeList.length; i<len; i++) {
			var item = nodeList[i];
			if (item.className == className) {
				results.push(item);
			}
		}
		return results;
	}
}

function $(selector, el) {
	if (!el) el = document;
	return el.querySelector(selector);
}
function $$(selector, el) {
	if (!el) el = document;
	return el.querySelectorAll(selector);
}
