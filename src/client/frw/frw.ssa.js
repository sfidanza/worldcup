/**********************************************************
 * Server side access layer
 **********************************************************/

frw.ssa = {};

/**
 * conf properties:
 *  url
 *  callback
 *  override
 *  params
 */
frw.ssa.sendRequest = function(conf) {
	var channel = new XMLHttpRequest();
	channel.open("GET", conf.url, false);
	channel.send(null);
	channel.argument = conf;
	this.treatResponse(channel, conf);
};

frw.ssa.getEncodedParam = function(key, value) {
	return key + "=" + encodeURIComponent(value); // should 'key' be encoded as well (even if not needed here?)
};

frw.ssa.buildGETUrl = function(action, params) {
	var queryVars = [];
	for (var property in params) {
		if (params[property] instanceof Array) {
			var list = params[property];
			for (var i=0; i<list.length; i++) {
				queryVars.push(this.getEncodedParam(property, list[i]));
			}
		} else {
			queryVars.push(this.getEncodedParam(property, params[property]));
		}
	}
	var sep = (action.indexOf("?") < 0) ? "?" : "&";
	params = (queryVars.length > 0) ? sep + queryVars.join("&") : "";
	return (action + params);
};

frw.ssa.parseResponseXml = function(responseXML) {
	var parsedResponse = null;
	
	if (responseXML && responseXML.getElementsByTagName('response')) {
		parsedResponse = {};
		
		var nodeList = responseXML.getElementsByTagName('error');
		if (nodeList.length > 0) {
			parsedResponse.errors = {};
			var e, errorNode;
			for (var i=0; i<nodeList.length; i++) {
				errorNode = nodeList[i];
				e = {};
				e.number = errorNode.getAttribute("code");
				e.type = errorNode.getAttribute("type");
				e.title = errorNode.getAttribute("title");
				e.message = errorNode.firstChild.nodeValue;
				parsedResponse.errors[e.number] = e;
			}
		}
		
		var nodeList = responseXML.getElementsByTagName('content');
		if (nodeList.length > 0) {
			// ignore content if empty
			parsedResponse.content = nodeList[0].firstChild.nodeValue.trim() || undefined;
			parsedResponse.contentId = nodeList[0].getAttribute("id");
		}
		
		var nodeList = responseXML.getElementsByTagName('json');
		if (nodeList.length > 0) {
			parsedResponse.json = nodeList[0].firstChild.nodeValue;
		}
		
		var nodeList = responseXML.getElementsByTagName('template');
		if (nodeList.length > 0) {
			parsedResponse.templates = {};
			var tid, templateNode;
			for (var i=0; i<nodeList.length; i++) {
				templateNode = nodeList[i];
				tid = templateNode.getAttribute("id");
				parsedResponse.templates[tid] = templateNode.firstChild.nodeValue;
			}
		}
		
		var nodeList = responseXML.getElementsByTagName('trace');
		if (nodeList.length > 0) {
			parsedResponse.trace = nodeList[0].firstChild.nodeValue;
		}
	}
	return parsedResponse;
};

frw.ssa.errorResponse = function(errorMessage, errorCode) {
	errorCode = errorCode || "0";
	return {
		errors: {
			errorCode: {message: errorMessage, type:'E'}
		}
	};
};

frw.ssa.treatResponse = function(response) {
	var passThru = response.argument;
	var parsedResponse;
	if (response.status != 200) {
		// connection issue
		if (frw.debug) console.warn("request returned with status "+response.status);
		parsedResponse = this.errorResponse("i18n.ConnectionIssue");
	} else if (passThru.type == 'json') {
		parsedResponse = JSON.parse(response.responseText);
	} else {
		parsedResponse = this.parseResponseXml(response.responseXML);
	}
	
	if (parsedResponse == null) {
		// incorrect response format
		parsedResponse = this.errorResponse("i18n.IncorrectResponse");
	}
	
	if (parsedResponse != null) {
		if (parsedResponse.errors != null && !passThru.bypassErrors) {
			this.handleErrors(parsedResponse, passThru.modalErrorHandling);
		}
		
		if (parsedResponse.trace != null) { //display trace
//			frw.trace.add(response.argument.url, parsedResponse);
		}
	}
	
	//go to callback - whatever the status (success, error)
	if (passThru && passThru.callback) {
		if (typeof passThru.override == "object") {
			passThru.callback.call(passThru.override, parsedResponse, passThru.params);
		} else {
			passThru.callback(parsedResponse, passThru.params);
		}
	}
};

/**
 * Generic handler for error cases.
 */
frw.ssa.handleErrors = function(parsedResponse, modalErrorHandling) {
};

/**********************************************************
 * Load client sides templates
 * @param {object} repository  templates repository to register templates in
 **********************************************************/
frw.ssa.loadTemplates = function(url, repository) {
	// send request
	this.sendRequest({
		method: 'GET',
		url: url,
		callback: this.treatResponseTemplates,
		override: this,
		params: {
			repository: repository
		}
	});
};

frw.ssa.treatResponseTemplates = function(response, params) {	
	if (response) {
		var repository = params.repository;
		for (var tid in response.templates) {
			repository[tid].create(response.templates[tid]);
		}
	} else {
		// connection error
		if (frw.debug) console.error('[loadTemplates] connection error while retrieving templates.');
	}
};
