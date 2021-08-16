/* global frw */
/**********************************************************
 * Data Management layer
 **********************************************************/

frw.data = {};

/**
 * Group the list by a given property
 */
frw.data.groupBy = function (list, key, sorted) {
	let groupedList = {};
	const keys = [];
	for (let i = 0; i < list.length; i++) {
		const item = list[i];
		const newKey = (typeof key == "function") ? key(item) : item[key];
		if (newKey == null) continue;
		if (!groupedList[newKey]) {
			keys.push(newKey);
			groupedList[newKey] = [];
		}
		groupedList[newKey].push(item);
	}

	if (sorted) {
		const sortedGroupedList = {};
		keys.sort();
		for (let i = 0; i < keys.length; i++) {
			const k = keys[i];
			sortedGroupedList[k] = groupedList[k];
		}
		groupedList = sortedGroupedList;
	}

	return groupedList;
};

/**
 * Change a list to an object, indexed by a given property
 */
frw.data.reIndex = function (list, key) {
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
 * @param {Object[]} list  the list of object to sort
 * @param {array} sorters  the sorting criterias as an array of object:
 *           {string} key  the property to sort on
 *           {number} dir  the sort direction: ascending (1, default) or descending (-1)
 */
frw.data.sort = function (list, sorters) {
	if (!list.length) return list;

	// no bind as bind is killing performance (3x more)
	list.sort((a, b) => this._sortMultipleKeys(sorters, a, b));
	return list;
};

frw.data._sortMultipleKeys = function (sorters, a, b) {
	if (!sorters || !sorters.length) return 0;

	for (let i = 0, len = sorters.length; i < len; i++) {
		const sorter = sorters[i];
		const va = a[sorter.key];
		const vb = b[sorter.key];
		if (va !== vb) {
			return (va < vb) ? -sorter.dir : sorter.dir;
		}
	}
	return 0;
};

/**
 * Update data
 */
frw.data.update = function (table, updates, key) {
	if (!table || !updates) return;
	key = key || "id";
	const kTable = frw.data.reIndex(table, key);
	for (let i = 0, len = updates.length; i < len; i++) {
		const item = kTable[updates[i][key]];
		if (item) {
			Object.assign(item, updates[i]);
		} else {
			table.push(updates[i]);
		}
	}
};
