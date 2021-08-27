/********************************************************************
 * fabulous.MongoStore is an express-session Store implementation
 * using MongoDB.
 * @see https://github.com/expressjs/session
 * 
 * It is largely based on connect-mongo, and is simplified for
 * my need, meaning:
 *  - it only supports passing a node-mongodb-native db object
 *  - it assumes the db is opened and ready
 * 
 * Credits to connect-mongo by Casey Banner <kcbanner@gmail.com>
 * https://github.com/kcbanner/connect-mongo
 ********************************************************************/

/**
 * Default options
 */
const defaultOptions = {
	collection: 'sessions',
	defaultExpirationTime: 1000 * 60 * 60 * 24 * 14 // 2 weeks
};

module.exports = function(Store) {
	/**
	 * Initialize MongoStore with the given `options`.
	 * 
	 * @param {Object} options
	 * @param {Function} callback
	 * @api public
	 */
	function MongoStore(options) {
		options = options || {};
		Store.call(this, options);
		
		if (!options.db) {
			throw new Error('Required MongoStore option `db` missing');
		}
		this.defaultExpirationTime = options.defaultExpirationTime || defaultOptions.defaultExpirationTime;
		this.dbCollectionName = options.collection || defaultOptions.collection;
		this._onDbReady(options.db); // Assume it's an instantiated DB Object
	}
	
	/**
	 * Inherit from `Store`.
	 */
	MongoStore.prototype.__proto__ = Store.prototype;
	
	MongoStore.prototype._serializeSession = JSON.stringify;
	MongoStore.prototype._unserializeSession = JSON.parse;
	
	/**
	 * Set the DB to be used to persist sessions
	 * @api private
	 */
	MongoStore.prototype._onDbReady = function(db) {
		this.db = db;
		this.sessions = this.db.collection(this.dbCollectionName);
		
		// Make sure we have a TTL index on 'expires', so mongod will automatically
		// remove expired sessions. expireAfterSeconds is set to 0 because we want
		// mongo to remove anything expired without any additional delay.
		this.sessions.createIndex({ expires: 1 }, { expireAfterSeconds: 0 }, function(err/*, result*/) {
			if (err) {
				throw new Error('Error setting TTL index on session collection');
			}
		});
	};
	
	/**
	 * Attempt to fetch session by the given `sid`.
	 * 
	 * @param {String} sid
	 * @param {Function} callback
	 * @api public
	 */
	MongoStore.prototype.get = function(sid, callback) {
		this.sessions.findOne({ _id: sid }, (err, session) => {
			if (err || !session) {
				if (callback) callback(err);
			} else {
				try {
					if (!session.expires || new Date() < session.expires) {
						callback(null, this._unserializeSession(session.session));
					} else {
						this.destroy(sid, callback);
					}
				} catch (e) {
					if (callback) callback(e);
				}
			}
		});
	};
	
	/**
	 * Commit the given `sess` object associated with the given `sid`.
	 * 
	 * @param {String} sid
	 * @param {Session} sess
	 * @param {Function} callback
	 * @api public
	 */
	MongoStore.prototype.set = function(sid, session, callback) {
		let serialized;
		try { // in case serialization fails
			serialized = this._serializeSession(session);
		} catch (err) {
			if (callback) callback(err);
		}
		
		let expireTime = (session && session.cookie && session.cookie.expires);
		if (!expireTime) {
			/* If no expiration date is specified, it is a browser-session cookie or there is
			 * no cookie at all. In DB, we default to a customizable two-weeks expiration.
			 */
			expireTime = Date.now() + this.defaultExpirationTime;
		}
		const s = {
			_id: sid,
			session: serialized,
			expires: new Date(expireTime)
		};
		
		this.sessions.updateOne({ _id: sid }, { $set: s }, { upsert: true, safe: true }, callback);
	};
	
	/**
	 * Destroy the session associated with the given `sid`.
	 * 
	 * @param {String} sid
	 * @param {Function} callback
	 * @api public
	 */
	MongoStore.prototype.destroy = function(sid, callback) {
		this.sessions.remove({ _id: sid }, callback);
	};
	
	/**
	 * Fetch number of sessions.
	 * 
	 * @param {Function} callback
	 * @api public
	 */
	MongoStore.prototype.length = function(callback) {
		this.sessions.count(callback);
	};
	
	/**
	 * Clear all sessions.
	 * 
	 * @param {Function} callback
	 * @api public
	 */
	MongoStore.prototype.clear = function(callback) {
		this.sessions.drop(callback);
	};
	
	return MongoStore;
};
