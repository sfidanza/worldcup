import { Template } from '../frw/frw.Template.js';

let page, frw;

export const schedule = new Template();

schedule.onCreate = function (pageRef, frwRef, i18nRepository) {
	page = pageRef;
	frw = frwRef;
	this.i18n = i18nRepository;
};

schedule.onParse = function (data) {
	const list = frw.data.groupBy(data.matches, 'phase');
	const teams = frw.data.indexBy(data.teams, 'id');
	const dateFormat = page.config.i18n.formats.date;
	
	this.set('flag', page.config.cid === 'cwc' ? 'club' : 'flag');

	for (const phase of ['G', 'H', 'Q', 'S', 'T', 'F']) {
		if (!list[phase]) continue;
		this.set('phase', page.config.i18n['phase' + phase]);
		const phaseList = frw.data.groupBy(list[phase], 'day');
		const days = Object.keys(phaseList).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
		for (const day of days) {
			const matches = frw.data.sortBy(phaseList[day], [{ key: 'hour', dir: 1 }, { key: 'id', dir: 1 }]);
			this.set('day', dateFormat.format(new Date(day)));
			matches.forEach((match, i) => {
				this.set('row_class', 'l' + (i % 2));
				this.set('match', match);
				const category = (match.group) ?
					page.config.i18n.group(match.group) :
					match.id;
				this.set('category', category);
				const team1 = teams[match.team1_id];
				const team2 = teams[match.team2_id];
				this.set('team1.name', team1 ? team1.name : match.team1_source);
				this.set('team2.name', team2 ? team2.name : match.team2_source);
				this.set('stadium', data.stadiums[match.stadium]);
				let pso = ''; // Penalty Shoot Out
				if (match.team1_scorePK != null) {
					pso = '<br/>(' + match.team1_scorePK + ' - ' + match.team2_scorePK + ')';
				}
				this.set('PSO', pso);
				this.parseBlock('match');
			});
			this.parseBlock('day');
		}
		this.parseBlock('phase');
	}
};

schedule.highlight = function (team) {
	const table = document.getElementById('schedule-foot');
	if (!table) return; // no schedule on this page

	if (team) {
		page.data.matches
			.filter(m => m.team1_id == team || m.team2_id == team)
			.forEach(m => {
				const row = document.getElementById('m-' + m.id);
				if (row) {
					row.classList.add('highlighted');
				}
			});
	} else {
		table.querySelectorAll('tr.highlighted').forEach(row => {
			row.classList.remove('highlighted');
		});
	}
};
