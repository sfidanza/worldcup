import sse from 'better-sse';
const { createChannel } = sse;

const live = createChannel();
export default live;

const broadcastSessionCount = () => {
	live.broadcast(live.sessionCount, 'watcher-count');
};

live
	.on('session-registered', broadcastSessionCount)
	.on('session-deregistered', broadcastSessionCount);
