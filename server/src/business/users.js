/********************************************************************
 * User Authentication Class
 ********************************************************************/
 const users = {};
module.exports = users;

/**
 * Takes login/pwd to authenticate against a MongoDB collection.
 * Uses a Promise API.
 * If successful, returns a user object:
 * {
 *   id: 'native-john',
 *   name: 'John',
 *   type: 'native',
 *   isAdmin: true
 * }
 */
users.authenticate = function (db, login, pwd) {
	return db.collection('users')
		.findOne({ 'id': getId('native', login), 'pwd': pwd })
		.then(filterUser);
};

/**
 * Creates a user in DB, or update its name if login/pwd match.
 * Uses a Promise API.
 * If successful, returns a user object (like authenticate).
 */
users.register = function (db, login, pwd, type, info) {
	const id = getId(type, login);
	delete info.login; // can not be changed
	delete info.type; // can not be changed
	info.name = info.name || login;
	return db.collection('users')
		.findOne({ 'id': id })
		.then(function (user) {
			if (user && user.pwd !== pwd) {
				throw new Error('User already exists: ' + login);
			}
			return db.collection('users').findOneAndUpdate(
				{ 'id': id, 'pwd': pwd },
				{ $set: info },
				{ new: true, upsert: true }
			);
		})
		.then(function (result) { return result[0]; }) // findAndModify returns [ doc, { whatever } ]
		.then(filterUser);
};

function getId(type, login) {
	return type + '-' + login;
}

function filterUser(user) {
	if (user) {
		delete user._id;
		delete user.pwd;
	}
	return user;
}
