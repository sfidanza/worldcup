/**********************************************************
 * Server side access layer
 **********************************************************/

export const ssa = {};

/**
 * Load client sides templates
 * @param {object} repository  templates repository to register templates in
 */
ssa.loadTemplates = async function (url, repository, ...params) {
	return fetch(url)
		.then(response => response.json())
		.then(response => {
			if (response) {
				for (const tid in response.templates) {
					repository[tid].create(response.templates[tid], ...params);
				}
			} else {
				console.error('[loadTemplates] error while retrieving templates.');
			}
		});
};
