/**********************************************************
 * URL parsing
 **********************************************************/

frw.url = {};

frw.url.parseQueryURL = function(url) {
	var query = {};
	if (url) {
		var queryStart = url.indexOf("?");
		if (queryStart !== -1 && queryStart !== url.length-1) {
			url = url.slice(queryStart + 1);
			var params = url.split("#")[0].split("&");
			for (var i = 0, l = params.length; i < l; i++) {
				var param = params[i].split("=");
				var key = param[0];
				var value = decodeURIComponent(param[1]);
				if (query.hasOwnProperty(key)) {
					if (!(query[key] instanceof Array)) {
						query[key] = [query[key]];
					}
					query[key].push(value);
				} else {
					query[key] = value;
				}
			}
		}
	}
	return query;
};