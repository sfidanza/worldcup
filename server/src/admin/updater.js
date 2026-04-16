/********************************************************************
 * Update match data from live api
 * 3 levels of cron jobs, each triggering the one below:
 *   1. [C-{year}] competition: executes once per day to schedule match triggers of the day
 *   2. [MT-{mid}] match trigger: set at game start time to trigger the score follow-up
 *   3. [SF-{mid}] score follow-up: executes every N seconds to update the score until the game is finished
 ********************************************************************/
import cron from 'node-cron';
import adapter from './adapter.js';
import live from '../business/live.js';

const COMPETITIONS = ['euro', 'cwc', 'worldcup'];

const C_INTERVAL = 24; // hours
const C_CRON_EXP = `0 */${C_INTERVAL} * * *`; // Every N hours

const MT_CRON_EXP_TPL = (HOUR, DAY, MONTH) => `0 ${HOUR} ${DAY} ${MONTH} *`; // At start of match

const SF_INTERVAL = 30; // seconds
const SF_AUTO_STOP = 120; // minutes
const SF_MAX_EXECUTIONS = (SF_AUTO_STOP * 60) / SF_INTERVAL;
const SF_CRON_EXP = `*/${SF_INTERVAL} * * * * *`; // Every N seconds

const tasks = {};

const updater = {};
export default updater;

/**
 * Schedule a cron job if not already started for the given task id
 * @param {string} tid - the task id
 * @param {string} cronExpression
 * @param {number} maxExecutions
 * @param {function} payload - the function to be executed at each scheduled time
 * @returns {boolean} true if a new job was scheduled, false if a job already exists for this match
 */
function schedule (tid, cronExpression, maxExecutions, payload) {
	const task = tasks[tid];
	if (!task) {
		console.log(`[${new Date().toLocaleString()}][${tid}] scheduling task on: ${cronExpression}`);
		tasks[tid] = cron.schedule(cronExpression, () => {
			console.log(`[${new Date().toLocaleString()}][${tid}] running a task on: ${cronExpression}`);
			payload();
		}, {
			name: tid,
			maxExecutions: maxExecutions
		});
		tasks[tid].on('task:destroyed', (ctx) => {
			console.log(`task [${ctx.task?.name}] finished and destroyed`);
			delete tasks[tid];
		});
	} else {
		console.log(`[${new Date().toLocaleString()}][${tid}] already scheduled with: ${cronExpression}`);
	}
	return viewTask(tasks[tid]);
};

/**
 * Unschedule a cron job
 * @param {string} tid - the task id
 * @returns
 */
function unschedule (tid) {
	const task = tasks[tid];
	if (task) {
		task.destroy();
		return viewTask(task);
	}
	return false;
};

function viewTask (task) {
	return {
		tid: task.name,
		status: task.getStatus(),
		cron: task.cronExpression,
		next: task.getNextRun()
	};
};

/**
 * Schedule a cron job to follow match score and update it in DB
 * @param {object} db
 * @param {string} mid
 * @returns {boolean} true if a new job was scheduled, false if a job already exists for this match
 */
function followScore (db, mid) {
	const tid = `SF-${mid}`;
	return schedule(tid, SF_CRON_EXP, SF_MAX_EXECUTIONS, () => {
		updater.fetchMatch(db, mid)
			.then(res => {
				console.log(`${res.team1_id} - ${res.team2_id}: ${res.team1_score} - ${res.team2_score}`
					+ ` / PK: ${res.team1_scorePK} - ${res.team2_scorePK}`
					+ ` / status: ${res.matchStatus} / period: ${res.period} / winner: ${res.winner}`);
			});
	});
};

/**
 * Schedule a cron job to trigger match follow up at match start time
 * @param {object} db - the database connection object
 * @param {object} m - match object containing its FIFA id, status and date
 * @returns {boolean} true if a new job was scheduled, false if a job already exists for this match
 */
function triggerMatch (db, m) {
	if (m.matchStatus == 1 || m.matchStatus == 3) {
		const d = new Date(m.date);
		const cronExpression = MT_CRON_EXP_TPL(d.getUTCHours(), d.getUTCDate(), d.getUTCMonth() + 1);
		return schedule(`MT-${m.mid}`, cronExpression, 1, () => {
			followScore(db, m.mid);
		});
	}
	return false;
};

/**
 * Get matches of the day for a competition
 * @param {object} db
 * @param {string} year
 * @returns {Match[]} List of matches
 */
async function getCurrentMatches (db, year) {
	const competitionId = COMPETITIONS[year % 4];
	return adapter.getCurrentMatches(competitionId)
		.then(res => {
			return res.Results.map(data => {
				return {
					mid: data.IdMatch,
					date: data.Date,
					matchStatus: data.MatchStatus,
					matchTime: data.MatchTime,
					period: data.Period
				};
			});
		})
		.then(list => {
			return list.map(m => {
				const job = triggerMatch(db, m);
				return { job: job, match: m};
			});
		});
};

/********************************************************************
 * Update match data in DB from live API
 * @param {object} db
 * @param {string} mid - the FIFA id of the match to be updated
 */
updater.fetchMatch = async function (db, mid) {
	return adapter.getMatch(mid)
		.then(data => {
			return {
				date: data.Date,
				day: data.Date.slice(0, 10), // raw but should work for now
				matchTime: data.MatchTime,
				matchStatus: data.MatchStatus,
				period: data.Period,
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
					updated.matchStatus = match.matchStatus;
					updated.period = match.period;
					updated.winner = match.winner;
					live.broadcastMatchUpdate(updated);
					return updated;
				});
		});
};

/**
 * Schedule a cron job to follow a competition
 * @param {object} db - the database connection object
 * @param {string} year - the year of the competition
 * @returns {boolean} true if a new job was scheduled, false if a job already exists for this match
 */
updater.startCompetition = async function (db, year) {
	const job = schedule(`C-${year}`, C_CRON_EXP, null, () => {
		getCurrentMatches(db, year);
	});
	tasks[`C-${year}`].execute(); // execute immediately to trigger today's matches right away
	return job;
};

/**
 * Stop a competition cron job
 * @param {string} year - the year of the competition
 * @returns
 */
updater.stopCompetition = async function (year) {
	return unschedule(`C-${year}`);
};

/**
 * Manually start a score follow-up cron job
 * @param {object} db
 * @param {string} mid
 * @returns
 */
updater.startMatch = async function (db, mid) {
	return followScore(db, mid);
};

/**
 * Manually stop a score follow-up cron job
 * @param {string} mid
 * @returns
 */
updater.stopMatch = async function (mid) {
	return unschedule(`SF-${mid}`);
};

/**
 * Get a list of all scheduled cron jobs
 * @returns {Job[]} List of scheduled jobs
 */
updater.getJobs = async function () {
	return Object.values(tasks).map(viewTask);
};
