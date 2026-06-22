import { createChannel } from 'better-sse';

const live = {};
export default live;

live.initialize = function () {
	this.channel = createChannel();
	this.channel
		.on('session-registered', broadcastSessionCount)
		.on('session-deregistered', broadcastSessionCount);
	this.liveMatches = {};
};

const broadcastSessionCount = function () {
	live.channel.broadcast(live.channel.sessionCount, 'watcher-count');
};

live.broadcastMatchUpdate = function (match) {
	this.channel.broadcast(match, 'match-update');
	if (match.matchStatus === 0 || match.matchStatus === 4) {
		// match finished or abandoned: remove from live matches
		delete this.liveMatches[match.id];
	} else {
		// match ongoing: update live matches
		this.liveMatches[match.id] = match;
	}
};

live.broadcastLatestMatches = function () {
	Object.values(this.liveMatches).forEach(m => {
		this.channel.broadcast(m, 'match-update');
	});
};

live.initialize();
