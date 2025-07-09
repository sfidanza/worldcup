/********************************************************************
 * Update matches data from live api
 ********************************************************************/
import cron from 'node-cron';
import adapter from './adapter.js';
import live from '../business/live.js';

const INTERVAL = 30; // seconds
const AUTO_STOP = 120; // minutes
const MAX_EXECUTIONS = (AUTO_STOP * 60) / INTERVAL;
const SCORE_CHECK = `*/${INTERVAL} * * * * *`; // Every N seconds
const SCORE_CHECK_TPL = (HOUR, DAY, MONTH) => `*/${INTERVAL} * ${HOUR}-23 ${DAY} ${MONTH} *`;

const updater = {
	tasks: {}
};
export default updater;

/********************************************************************
 * Update data
 * @param {object} db
 * @param {string} mid - the FIFA id of the match to be updated
 */
updater.fetch = async function (db, mid) {
	return adapter.getMatch(mid)
		.then(data => {
			return {
				date: data.Date,
				day: data.Date.slice(0, 10), // raw but should work for now
				matchTime: data.MatchTime,
				matchStatus: data.MatchStatus,
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
					live.broadcastMatchUpdate(updated);
					return updated;
				});
		});
};

updater.schedule = async function (db, mid, cronExpression) {
	const task = this.tasks[mid];
	if (!task) {
		this.tasks[mid] = cron.schedule(cronExpression, () => {
			console.log(`[${new Date().toLocaleString()}][${mid}] running a task on: ${cronExpression}`);
			updater.fetch(db, mid)
				.then(res => {
					console.log(`${res.team1_id} - ${res.team2_id}: ${res.team1_score} - ${res.team2_score}`
						+ ` / PK: ${res.team1_scorePK} - ${res.team2_scorePK} / status: ${res.matchStatus} / winner: ${res.winner}`);
				});
		}, {
			name: mid,
			maxExecutions: MAX_EXECUTIONS
		});
		this.tasks[mid].on('task:destroyed', (ctx) => {
			console.log(`task [${ctx.task?.name}] finished and destroyed`);
			delete this.tasks[mid];
		});
	}
	return !task;
};

updater.start = async function (db, mid) {
	return updater.schedule(db, mid, SCORE_CHECK);
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

updater.getCurrentMatches = async function (db, cid) {
	return adapter.getCurrentMatches(cid)
		.then(res => {
			return res.Results.map(data => {
				return {
					mid: data.IdMatch,
					date: data.Date,
					matchStatus: data.MatchStatus,
					matchTime: data.MatchTime,
					period: data.Period,
					winner: data.Winner
				};
			});
		})
		.then(list => {
			return list.map(m => {
				m.cron = getCron(m);
				if (this.tasks[m.mid]) {
					m.job = 'job already running';
				} else if (m.cron) {
					updater.schedule(db, m.mid, m.cron);
					m.job = 'job scheduled';
				}
				return m;
			});
		});
};

const getCron = function(m) {
	if (m.matchStatus == 1 || m.matchStatus == 3) {
		const d = new Date(m.date);
		return SCORE_CHECK_TPL(d.getUTCHours(), d.getUTCDate(), d.getUTCMonth() + 1);
	}
	return null;
};