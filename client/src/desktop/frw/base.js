/**
 * Update target with properties from source.
 * Values already present in receiver are overwritten by new values.
 * Very basic polyfill for Object.assign to support IE
 */
 if (typeof Object.assign !== 'function') {
	Object.assign = function(target, source) {
		for (var p in source) {
			target[p] = source[p];
		}
	};
}
