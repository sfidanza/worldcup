import { Template } from '../../frw/frw.Template.js';

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
	const teams = frw.data.reIndex(data.teams, 'id');

	for (const match of data.matches) {
		this.set('match', match);
		this.set('class', this.phaseClasses[match.phase]);
		this.set('category', page.config.i18n['phase' + match.phase]);
		const team1 = teams[match.team1_id];
		const team2 = teams[match.team2_id];
		this.set('team1.name', team1 ? team1.id : match.team1_source);
		this.set('team2.name', team2 ? team2.id : match.team2_source);
		if (match.team1_scorePK != null) {
			this.parseBlock('PSO');
		}
		if (match.phase === 'H') {
			this.parseBlock('tooltip');
		}
		this.parseBlock('match');
	}
};
