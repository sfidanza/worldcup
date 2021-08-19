/* global frw */
/**********************************************************
 * Server side access layer
 **********************************************************/

frw.ssa = {};

/**
 * Load client sides templates
 * @param {object} repository  templates repository to register templates in
 */
frw.ssa.loadTemplates = async function (url, repository) {
	return fetch(url)
		.then(response => response.text())
		.then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
		.then(frw.ssa.parseResponseXml)
		.then(response => {
			if (response) {
				for (let tid in response.templates) {
					repository[tid].create(response.templates[tid]);
				}
			} else {
				// connection error
				console.error('[loadTemplates] connection error while retrieving templates.');
			}
		});
};

frw.ssa.parseResponseXml = function (responseXML) {
	let parsedResponse = null;

	if (responseXML && responseXML.getElementsByTagName('response')) {
		parsedResponse = {};

		const nodeList = responseXML.getElementsByTagName('template');
		if (nodeList.length > 0) {
			parsedResponse.templates = {};
			for (const templateNode of nodeList) {
				const tid = templateNode.getAttribute("id");
				parsedResponse.templates[tid] = templateNode.firstChild.nodeValue;
			}
		}
	}
	return parsedResponse;
};
