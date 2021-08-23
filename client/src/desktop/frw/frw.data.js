/**********************************************************
 * Data Management layer
 **********************************************************/

export const data = {};

/**
 * Group the list by a given property
 */
data.groupBy = function (list, key, sorted) {
	let groupedList = {};
	const keys = [];
	for (const item of list) {
		const newKey = (typeof key == 'function') ? key(item) : item[key];
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
		for (const k of keys) {
			sortedGroupedList[k] = groupedList[k];
		}
		groupedList = sortedGroupedList;
	}

	return groupedList;
};

/**
 * Change a list to an object, indexed by a given property
 */
data.reIndex = function (list, key) {
	if (!list) return null;
	const indexedList = {};
	for (const item of list) {
		const newKey = (typeof key == 'function') ? key(item) : item[key];
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
data.sort = function (list, sorters) {
	if (!list.length) return list;

	// no bind as bind is killing performance (3x more)
	list.sort((a, b) => _sortMultipleKeys(sorters, a, b));
	return list;
};

const _sortMultipleKeys = function(sorters, a, b) {
	if (!sorters || !sorters.length) return 0;

	for (const sorter of sorters) {
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
data.update = function (table, updates, key) {
	if (!table || !updates) return;
	key = key || 'id';
	const kTable = data.reIndex(table, key);
	for (const update of updates) {
		const item = kTable[update[key]];
		if (item) {
			Object.assign(item, update);
		} else {
			table.push(update);
		}
	}
};

/**
 * Update target with properties from source.
 * Values already present in receiver are overwritten by new values.
 * Very basic polyfill for Object.assign to support IE
 */
if (typeof Object.assign !== 'function') {
	Object.assign = function(target, source) {
		for (const p in source) {
			target[p] = source[p];
		}
	};
}
