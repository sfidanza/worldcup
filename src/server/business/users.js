/********************************************************************
 * User Authentication Class
 ********************************************************************/
var users = {};
module.exports = users;

/**
 * Takes login/pwd to authenticate against a MongoDB collection.
 * Uses a Promise API.
 * If successful, returns a user object:
 * {
 *   login: 'john',
 *   name: 'John',
 *   type: 'native',
 *   isAdmin: true
 * }
 */
users.authenticate = function(db, login, pwd) {
	return db.collection('users').findOne({ 'login': login, 'pwd': pwd, 'type': 'native' })
		.then(filterUser);
};

/**
 * Creates a user in DB, or update its name if login/pwd match.
 * Uses a Promise API.
 * If successful, returns a user object (like authenticate).
 */
users.register = function(db, login, pwd, type, info) {
	delete info.login; // can not be changed
	delete info.type; // can not be changed
	return db.collection('users').findOne({ 'login': login, 'type': type })
		.then(function(user) {
			if (user && user.pwd !== pwd) {
				throw new Error('User already exists: ' + login);
			}
			return db.collection('users').findAndModify({
				query: { 'login': login, 'pwd': pwd, 'type': type },
				update: { $set: info },
				new: true,
				upsert: true
			});
		})
		.then(function(result) { return result[0]; }) // findAndModify returns [ doc, { whatever } ]
		.then(filterUser);
};

function filterUser(user) {
	if (user) {
		delete user._id;
		delete user.pwd;
	}
	return user;
}
