/**********************************************************
 * Data Management layer
 **********************************************************/

frw.data = {};

/**
 * Filter the list by a given property
 */
frw.data.filter = function(list, property, value) {
	var filteredList = [];
	for (var i=0; i<list.length; i++) {
		var item = list[i];
		if (item[property] == value) {
			filteredList.push(item);
		}
	}
	return filteredList;
};

/**
 * Group the list by a given property
 */
frw.data.groupBy = function(list, property, sorted) {
	var groupedList = {};
	var values = [];
	for (var i=0; i<list.length; i++) {
		var item = list[i];
		var value = (typeof property == "function") ? property(item) : item[property];
		if (value == null) continue;
		if (!groupedList[value]) {
			values.push(value);
			groupedList[value] = [];
		}
		groupedList[value].push(item);
	}
	
	if (sorted) {
		var sortedGroupedList = {};
		values.sort();
		for (var i=0; i<values.length; i++) {
			var value = values[i];
			sortedGroupedList[value] = groupedList[value];
		}
		groupedList = sortedGroupedList;
	}
	
	return groupedList;
};

/**
 * Change a list to an object, indexed by a given property
 */
frw.data.reIndex = function(list, key) {
	if (!list) return null;
	var indexedList = {};
	for (var i=0; i<list.length; i++) {
		var item = list[i];
		var newKey = (typeof key == "function") ? key(item) : item[key];
		indexedList[newKey] = item;
	}
	return indexedList;
};

/**
 * Sort an array of objects on the specified properties
 * @param {Object[]} list  the list of object to sort
 * @param {array} sorters  the sorting criterias as an array of object:
 *           {string} key  the property the sort on
 *           {number} dir  the sort direction: ascending (1, default) or descending (-1)
 */
frw.data.sort = function(list, sorters) {
	if (!list.length) return list;
	
	if (frw.browser.isIE && sorters.length == 1) {
		//single key: use the "toString" method for faster sorting
		var sorter = sorters[0];
		this._setToString(list, sorter.key);
		list.sort();
		this._delToString(list);
		
		if (sorter.dir == "DESC" || sorter.dir == -1) {
			list.reverse();
		}
	} else {
		// no bind as bind is killing performance (3x more)
		// list.sort(this._sortMultipleKeys.bind(this, sorters));
		list.sort(function(a, b) {
			return frw.data._sortMultipleKeys(sorters, a, b);
		});
	}
	return list;
};

frw.data._setToString = function(list, key) {
	var toString = function() { return this._sortValue; };
	for (var i=0; i<list.length; i++) {
		list[i].toString = toString;
		list[i]._sortValue = list[i][key];
	}
};

frw.data._delToString = function(list) {
	for (var i=0; i<list.length; i++) {
		delete list[i].toString;
		delete list[i]._sortValue;
	}
};

frw.data._sortMultipleKeys = function(sorters, a, b) {
	if (!sorters || !sorters.length) return 0;
	
	for (var i=0, len=sorters.length; i<len; i++) {
		var sorter = sorters[i];
		var va = a[sorter.key];
		var vb = b[sorter.key];
		if (va !== vb) {
			return (va < vb) ? -sorter.dir : sorter.dir;
		}
	}
	return 0;
};

/**
 * Create a filtering function from a string expression
 * @param {string} expr
 */
frw.data.getFilter = function(expr) {
	expr = expr.replace(/\$/g, "element");
	var f = null;
	try {
		f = new Function("element", "return "+expr);
	} catch(ex_eval) {
		f = function(element) { return true; };
		if (frw.debug) console.error('[getFilter] could not execute expression: "'+expr+'"\nException: '+ex_eval);
	}
	return f;
};

/**
 * Evaluate a given javascript expression on the list and return matching rows.
 * The row object should be denoted by $ (eg. "$.price").
 * @param {object[]}  list  list of data to filter
 * @param {string}    expr  javascript expression, eg. '$.price<=200 && $.distance<10' (optional)
 * @return object[]
 */
frw.data.query = function(list, expr) {
	var results, filter;
	if ((typeof expr === 'string') && (expr !== '')) { // Generic expression evaluation filter
		filter = this.getFilter(expr);
	}

	if (filter) {
		results = [];
		for (var i=0, len=list.length; i<len; i++) {
			if (filter(list[i])) {
				results.push(list[i]);
			}
		}
	} else { // no filter
		results = list.slice(0); // make sure we return a copy
	}
	return results;
};

/**
 * Update data
 */
frw.data.update = function(table, updates, key) {
	if (!table || !updates) return;
	key = key || "id";
	var kTable = frw.data.reIndex(table, key);
	for (var i=0, len=updates.length; i<len; i++) {
		var item = kTable[updates[i][key]];
		if (item) {
			frw.updateObject(item, updates[i]);
		} else {
			table.push(updates[i]);
		}
	}
};
