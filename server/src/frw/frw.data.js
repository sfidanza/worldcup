/**********************************************************
 * Data Management layer
 **********************************************************/

var data = {};
module.exports = data;

/**
 * Group the list by a given property
 */
data.groupBy = function(list, key) {
	const groupedList = {};
	for (let i = 0; i < list.length; i++) {
		const item = list[i];
		const newKey = (typeof key == "function") ? key(item) : item[key];
		if (newKey == null) continue;
		if (!groupedList[newKey]) {
			groupedList[newKey] = [];
		}
		groupedList[newKey].push(item);
	}
	return groupedList;
};

/**
 * Change a list to an object, indexed by a given property
 */
data.reIndex = function(list, key) {
	if (!list) return null;
	const indexedList = {};
	for (let i = 0; i < list.length; i++) {
		const item = list[i];
		const newKey = (typeof key == "function") ? key(item) : item[key];
		indexedList[newKey] = item;
	}
	return indexedList;
};

/**
 * Sort an array of objects on the specified properties
 * @param {object[]} list  the list of object to sort
 * @param {array} sorters  the sorting criterias as an array of object:
 *           {string} key  the property to sort on
 *           {number} dir  the sort direction: ascending (1, default) or descending (-1)
 */
data.sort = function(list, sorters) {
	if (!list.length) return list;
	
	// no bind as bind is killing performance
	list.sort(function(a, b) {
		return _sortMultipleKeys(sorters, a, b);
	});
	return list;
};

var _sortMultipleKeys = function(sorters, a, b) {
	if (!sorters || !sorters.length) return 0;
	
	for (var i = 0, len = sorters.length; i < len; i++) {
		var sorter = sorters[i];
		var va = a[sorter.key];
		var vb = b[sorter.key];
		if (va !== vb) {
			return (va < vb) ? -sorter.dir : sorter.dir;
		}
	}
	return 0;
};
