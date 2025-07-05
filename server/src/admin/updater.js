/********************************************************************
 * Update matches data from live api
 ********************************************************************/
import cron from 'node-cron';

const INTERVAL = 30; // seconds
const AUTO_STOP = 120; // minutes
const MAX_EXECUTIONS = (AUTO_STOP * 60) / INTERVAL;
const SCORE_CHECK = `*/${INTERVAL} * * * * *`; // Every N seconds

const updater = {
	tasks: {}
};
export default updater;

const LIVE_API = 'https://api.fifa.com/api/v3/live/football/';

/********************************************************************
 * Update data
 * @param {object} db
 * @param {string} mid - the FIFA id of the match to be updated
 */

updater.fetch = async function (db, mid) {
	return fetch(LIVE_API + mid)
		.then(res => res.json())
		.then(data => {
			return {
				date: data.Date,
				day: data.Date.slice(0, 10), // raw but should work for now
				matchTime: data.MatchTime,
				winner: data.Winner,
				team1: data.HomeTeam.Abbreviation,
				score1: data.HomeTeam.Score,
				team2: data.AwayTeam.Abbreviation,
				score2: data.AwayTeam.Score,
				score1PK: data.HomeTeamPenaltyScore,
				score2PK: data.AwayTeamPenaltyScore
			};
		})
		.then(match => {
			const edit = {
				'team1_score': match.score1,
				'team2_score': match.score2,
				'team1_scorePK': match.score1PK,
				'team2_scorePK': match.score2PK
			};
			return db.collection('matches')
				.findOneAndUpdate(
					{ team1_id: match.team1, team2_id: match.team2 },
					{ $set: edit },
					{ returnDocument: 'after' }
				)
				.then(updated => {
					updated.matchTime = match.matchTime;
					return updated;
				});
		});
};

updater.start = async function (db, mid) {
	const task = this.tasks[mid];
	if (!task) {
		this.tasks[mid] = cron.schedule(SCORE_CHECK, () => {
			console.log(`[${new Date().toLocaleString()}][${mid}] running a task on: ${SCORE_CHECK}`);
			updater.fetch(db, mid)
				.then(console.log);
		}, { name: mid, maxExecutions: MAX_EXECUTIONS });
		this.tasks[mid].on('execution:maxReached', () => {
			console.log(`task [${mid}] finished and destroyed`);
			delete this.tasks[mid];
		});
	}
	return !task;
};


updater.stop = async function (mid) {
	const task = this.tasks[mid];
	if (task) {
		task.destroy();
		delete this.tasks[mid];
		console.log(`task [${mid}] stopped and destroyed`);
	}
	return task;
};
