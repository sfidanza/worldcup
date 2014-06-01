/********************************************************************
 * User Authentication Class
 * 
 * Takes login/pwd to authenticate against a MongoDB collection.
 * If successful, returns a user object:
 * {
 *   login: 'john',
 *   isAdmin: true,
 * }
 ********************************************************************/

//var userTypes: {
//	'UT_CONTRIBUTOR': 1,
//	'UT_ADMIN': 16
//};

function authenticate(db, login, pwd, callback) {
	db.collection('users').findOne({ login: login, pwd: pwd }, function(err, user) {
		callback(err, user && {
			login: user.login,
			isAdmin: user.isAdmin
		});
	});
}

module.exports = authenticate;