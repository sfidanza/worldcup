/********************************************************************
 * User Authentication Class
 ********************************************************************/
import httpError from 'http-errors';

const users = {};
export default users;

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
users.authenticate = async function (db, login, pwd) {
	return db.collection('users')
		.findOne(
			{ 'id': getId('native', login), 'pwd': pwd },
			{ projection: { _id: false, pwd: false} }
		);
};

/**
 * Creates a user in DB, or update its name if login/pwd match.
 * Uses a Promise API.
 * If successful, returns a user object (like authenticate).
 */
users.register = async function (db, login, pwd, type, info) {
	const id = getId(type, login);
	delete info.login; // can not be changed
	delete info.type; // can not be changed
	info.name = info.name || login;
	return db.collection('users')
		.findOne({ 'id': id })
		.then(user => {
			if (user && user.pwd !== pwd) {
				throw new httpError.UnprocessableEntity('User already exists: ' + login);
			}
			return db.collection('users').findOneAndUpdate(
				{ 'id': id, 'pwd': pwd },
				{ $set: info },
				{ upsert: true, returnDocument: 'after', projection: { _id: false, pwd: false} }
			);
		});
};

function getId(type, login) {
	return type + '-' + login;
}
