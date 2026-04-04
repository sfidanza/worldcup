import { Template } from '../frw/frw.Template.js';

let page, frw;

export const board32 = new Template();

board32.phaseClasses = {
	'J': 'round32',
	'H': 'round16'
};

board32.onCreate = function (pageRef, frwRef, i18nRepository) {
	page = pageRef;
	frw = frwRef;
	this.i18n = i18nRepository;
};

board32.onParse = function (data) {
	const teams = frw.data.indexBy(data.teams, 'id');
	const dateFormat = page.config.i18n.formats.date;
	
	this.set('flag', page.config.cid === 'cwc' ? 'club' : 'flag');

	this.set('size', 'sizeH');

	for (const match of data.matches) {
		if (!this.phaseClasses[match.phase]) continue;
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
		}
		this.parseBlock('match');
	}
};
