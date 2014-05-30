/********************************************************************
 * Foot data manipulation layer (teams, matches, stadiums)
 ********************************************************************/
var fs = require("fs");

var foot = {};
module.exports = foot;

/**
 * Retrieve data
 */
	
foot.getTeams = function(db, callback) {
	db.collection('teams').find({}, { _id: 0 }).toArray(callback);
};

foot.getMatches = function(db, callback) {
	db.collection('matches').find({}, { _id: 0 }).toArray(callback);
};

foot.getStadiums = function(db, callback) {
	db.collection('stadiums').find({}, { _id: 0 }).toArray(callback);
};

foot.getData = function(db, callback) {
	foot.getTeams(db, function(err, teams) {
		if (err) {
			callback(err);
		} else {
			foot.getMatches(db, function(err, matches) {
				if (err) {
					callback(err);
				} else {
					foot.getStadiums(db, function(err, stadiums) {
						if (err) {
							callback(err);
						} else {
							var data = {
								"teams": teams,
								"matches": matches,
								"stadiums": stadiums
							};
							callback(null, data);
						}
					});
				}
			});
		}
	});
};
