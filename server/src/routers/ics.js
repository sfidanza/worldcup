/******************************************************************************
 * Index page
 ******************************************************************************/
import { Router } from 'express';
import foot from '../business/foot.js';
import frw from '../frw/frw.data.js';
import ics from 'ics';

const TAGS = {
	G: (group) => `Group ${group}`,
	H: () => 'Round of 16',
	Q: () => 'Quarter-Finals',
	S: () => 'Semi-Finals',
	T: () => 'Third place',
	F: () => 'Final'
};

export default function getRouter() {
	const router = Router({ mergeParams: true });

	router.get('/', function (request, response) {
		const db = request.database;
		const year = request.params.year;
		const tz = (year === '2022') ? 'UTC+1' : 'UTC+2'; // hack until timezones are handled in the dates directly

		foot.getData(db)
			.then(data => {
				const teams = frw.data.reIndex(data.teams, 'id');

				const events = data.matches.map(m => {
					const d = new Date(`${m.day} ${m.hour} ${tz}`); // need explicit date timezone as container is in UTC
					const team1 = teams[m.team1_id]?.name ?? m.team1_source;
					const team2 = teams[m.team2_id]?.name ?? m.team2_source;
					const category = TAGS[m.phase](m.group);
					const ev = {
						title: `[${category}] ${team1} - ${team2}`,
						start: [d.getFullYear(), 1 + d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()],
						duration: { hours: 2 },
						uid: 'wc-' + year + '-' + m.id + '@dagobah-online.com',
						url: 'https://worldcup.dagobah-online.com/'
					};
					return ev;
				});

				const { error, value } = ics.createEvents(events);
				if (error) {
					console.log(error);
					response.status(500).json({ error });
					return;
				}

				response.send(value);
			}).catch(err => response.status(err.statusCode ?? 500).json({ error: err.message }));
	});

	return router;
}
