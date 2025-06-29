import { createChannel } from 'better-sse';

const live = {};
export default live;

live.initialize = function () {
	this.channel = createChannel();
	this.channel.on('session-registered', broadcastSessionCount)
	this.channel.on('session-deregistered', broadcastSessionCount);
};

const broadcastSessionCount = function () {
	live.channel.broadcast(live.channel.sessionCount, 'watcher-count');
};

live.broadcastMatchUpdate = function (match) {
	this.channel.broadcast(match, 'match-update');
};

live.initialize();
