/**********************************************************
 * Data Management layer
 **********************************************************/

const data = {};
export default { // export frw directly as we don't need any other library on server side
	data: data
};

/**
 * Group a list of objects by a given property
 * @param {Object[]} list - the list of objects
 * @param {(string|Function)} key - the property name or a function to evaluate on each item
 */
data.groupBy = function (list, key) {
	const map = {};
	for (const item of list) {
		const value = (typeof key === 'function') ? key(item) : item[key];
		if (!map[value]) {
			map[value] = [];
		}
		map[value].push(item);
	}
	return map;
};

/**
 * Index a list of objects by a given property
 * @param {Object[]} list - the list of objects
 * @param {(string|Function)} key - the property name or a function to evaluate on each item
 */
data.indexBy = function (list, key) {
	if (!list) return null;
	const map = {};
	for (const item of list) {
		const value = (typeof key === 'function') ? key(item) : item[key];
		map[value] = item;
	}
	return map;
};

/**
 * Sort a list of objects on the specified properties
 * @param {Object[]} list - the list of objects to sort
 * @param {Object[]} sorters - the sorting criterias as an array of objects:
 * @param {string} sorters[].key - the property to sort on
 * @param {number} sorters[].dir - the sort direction: ascending (+1) or descending (-1)
 */
data.sortBy = function (list, sorters) {
	if (!list.length || !sorters || !sorters.length) return list;

	list.sort(_sortMultipleKeys.bind(null, sorters));
	return list;
};

const _sortMultipleKeys = function (sorters, a, b) {
	for (const sorter of sorters) {
		const va = a[sorter.key];
		const vb = b[sorter.key];
		if (va !== vb) {
			return (va < vb) ? -sorter.dir : sorter.dir;
		}
	}
	return 0;
};
