import { Template } from '../frw/frw.Template.js';

let page, frw;

export const board = new Template();

board.phaseClasses = {
	'H': 'round16',
	'Q': 'quarter',
	'S': 'semi',
	'T': 'third',
	'F': 'final'
};

board.onCreate = function (pageRef, frwRef, i18nRepository) {
	page = pageRef;
	frw = frwRef;
	this.i18n = i18nRepository;
};

board.onParse = function (data) {
	const teams = frw.data.indexBy(data.teams, 'id');
	const dateFormat = page.config.i18n.formats.date;

	const withH = data.matches.some(m => m.phase === 'H');
	const withT = data.matches.some(m => m.phase === 'T');
	this.set('size', withH ? 'sizeH' : 'sizeQ');
	if (withH) {
		this.parseBlock('linksH');
	}
	if (withT) {
		this.parseBlock('linksT');
	}

	for (const match of data.matches) {
		this.set('match', match);
		this.set('class', this.phaseClasses[match.phase]);
		this.set('category', page.config.i18n['phase' + match.phase]);
		this.set('day', dateFormat.format(new Date(match.day)));
		const team1 = teams[match.team1_id];
		const team2 = teams[match.team2_id];
		this.set('team1.name', team1 ? team1.name : match.team1_source); // use team id instead of name for size S?
		this.set('team2.name', team2 ? team2.name : match.team2_source);
		this.set('stadium', data.stadiums[match.stadium]);
		if (match.team1_scorePK != null) {
			this.parseBlock('PSO');
		}
		const source = match.team1_source.charAt(0);
		if (+source) { // For first final round, first character is '1', '2' or '3'. Otherwise 'W' or 'L'.
			this.set('group1', team1?.group || ''); // Disambiguate '3DEF' when team is set
			this.set('group2', team2?.group || '');
			this.parseBlock('tooltip');
		} else if (match.phase === 'Q' || match.phase === 'S') {
			this.parseBlock('highlight');
		}
		this.parseBlock('match');
	}
};

board.highlight = function (match) {
	const root = document.getElementById('contents');
	if (match) {
		root.querySelectorAll('.for-' + match).forEach(item => {
			item.classList.add('highlighted');
		});
	} else {
		root.querySelectorAll('div.highlighted').forEach(item => {
			item.classList.remove('highlighted');
		});
	}
};
