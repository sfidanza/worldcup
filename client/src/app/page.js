/**********************************************************
 * Page
 **********************************************************/
import * as frw from '../frw/frw.js';
import * as uic from '../frw/uic.js';
import { scoreEditor } from './scoreEditor.js';
import { bet } from './bet.js';
import { config } from './config.js';

export const page = {
	data: {},
	config: config,
	scoreEditor: scoreEditor,
	bet: bet
};
window.page = page; // make page callable from global scope so it can be used from html

page.initialize = function () {
	// compute which competition to retrieve
	page.config.year = page.getYear();

	// retrieve templates and data
	page.notify('Loading data...', true);
	Promise.all([
		frw.ssa.loadTemplates(page.config.url.templates, page.templates, page, frw),
		page.getData()
	]).then(() => {
		// Initialize history
		frw.history.initialize(page.select.bind(page));

		// Set pageTitle function
		page.config.i18n.pageTitle = page.config.i18n.title.bind(null, page.config.year);

		// display
		page.templates.main.parse(page.config.year);
		page.templates.main.load(page.config.area.main);

		page.templates.user.parse(page.data);
		page.templates.user.load(page.config.area.user);
		page.scoreEditor.initialize(page, frw);
		page.bet.initialize(page);

		this.loginDlg = new uic.Dialog({
			id: page.config.area.loginDlg,
			centered: true
		});
		this.tooltip = new uic.Tooltip(0);

		page.select(frw.history.getCurrentState() || page.config.defaultPage);
		page.notify(null);
	});
};

page.destroy = function () {
	this.loginDlg.destroy();
	this.tooltip.destroy();
	this.pwl = null;
	for (const id in page.templates) {
		const tpl = page.templates[id];
		if (tpl.destroy) tpl.destroy();
	}

	page.scoreEditor.destroy();
	page.bet.destroy();
};

page.getYear = function () {
	let year = location.pathname.slice(1);
	if (!/^\d{4}$/.test(year)) {
		year = page.config.defaultYear;
	}
	return year;
};

page.notify = function (message, init) {
	if (!this.pwl) this.pwl = document.getElementById(page.config.area.pwl);
	if (message) {
		this.pwl.innerHTML = message;
	} else {
		this.pwl.innerHTML = '';
		this.pwl.style.display = 'none';
	}
	if (init) {
		this.pwl.style.display = 'block';
		frw.dom.center(this.pwl);
	}
};

page.getData = async function () {
	return fetch(page.config.url.data(page.config.year))
		.then(response => response.json())
		.then(data => {
			data.stadiums = frw.data.reIndex(data.stadiums, 'id');
			page.data = data;
		});
};

page.register = function (login, cb) {
	fetch(page.config.url.register(login))
		.then(response => response.json())
		.then(data => {
			page.refreshUser(data, cb);
		});
};

page.login = function (login, cb) {
	fetch(page.config.url.login(login))
		.then(response => response.json())
		.then(data => {
			page.refreshUser(data, cb);
		});
};

page.logout = function () {
	fetch(page.config.url.logout)
		.then(response => response.json())
		.then(data => {
			page.refreshUser(data);
		});
};

page.refreshUser = function (data, cb) {
	page.data.user = data && data.user;

	//	page.templates.main.parse(); // BREAKS!! Only bets depend on user - review solution!
	//	page.templates.main.load(page.config.area.main);

	page.templates.user.parse(data || {});
	page.templates.user.load(page.config.area.user);

	if (this.current === 'bet') {
		page.redrawView();
	}
	if (cb) cb();
};

page.getPageTitle = function (stateTitle) {
	return page.config.i18n.pageTitle(stateTitle);
};

page.getMenuItem = function (hash) {
	return document.querySelector(`a[href='${hash}']`);
};

page.highlight = function (link) {
	document.querySelectorAll('a.selected').forEach(item => {
		item.className = '';
	});
	link.className = 'selected';
	link.blur();
};

page.select = function (link, event) {
	if (event) event.preventDefault();

	let target;
	if (typeof link === 'string') {
		target = link;
		link = page.getMenuItem('#' + target);
	} else {
		target = link.href.split('#')[1];
	}
	if (target) {
		if (link) {
			page.highlight(link);
			frw.history.pushState(target, page.getPageTitle(link.title || link.innerHTML));
		}
		page.view(target);
		this.current = target;
	}
};

page.redrawView = function () {
	page.view(this.current);
};

page.view = function (viewName) {
	page.scoreEditor.unplug();
	page.show(...viewName.split(','));
};

page.show = function (viewName, ...option) {
	switch (viewName) {
		case 'schedule': page.showSchedule(...option); break;
		case 'ranking': page.showRanking(...option); break;
		case 'group': page.showGroup(...option); break;
		case 'board': page.showBoard(); break;
		case 'history': page.showPage('history'); break;
		case 'notes': page.showPage('notes'); break;
		case 'login': page.showPage('login', ...option); break;
		case 'register': page.showPage('register', ...option); break;
		case 'bet': page.showPage('bet', ...option); break;
	}
	document.getElementById(page.config.area.contents).className = 'page-' + viewName;
};

page.showSchedule = function (phase) {
	const matches = (phase == 1) ? page.data.matches.filter(m => m.phase == 'G') :
		((phase == 2) ? page.data.matches.filter(m => m.group == null) : page.data.matches);

	const data = {
		teams: page.data.teams,
		matches: matches,
		stadiums: page.data.stadiums
	};

	page.templates.schedule.parse(data);
	page.templates.schedule.load(page.config.area.contents);
	page.scoreEditor.plug();
};

page.showRanking = function (group) {
	if (!group) {
		const teamsByGroup = frw.data.groupBy(page.data.teams, 'group', true);
		for (const g in teamsByGroup) {
			page.templates.ranking.parse(teamsByGroup[g], g);
		}
	} else {
		const data = {
			teams: page.data.teams.filter(item => item.group === group)
		};
		page.templates.ranking.parse(data.teams, group);
	}
	page.templates.ranking.load(page.config.area.contents);
};

page.showGroup = function (group) {
	const data = {
		teams: page.data.teams.filter(item => item.group === group),
		matches: page.data.matches.filter(item => item.group === group),
		stadiums: page.data.stadiums
	};

	page.templates.ranking.parse(data.teams, group);
	page.templates.schedule.parse(data);
	const content = [
		page.templates.ranking.retrieve(),
		page.templates.schedule.retrieve()
	].join('\n');
	frw.dom.updateContainer(content, document.getElementById(page.config.area.contents));
	page.templates.ranking.onLoad();
	page.templates.schedule.onLoad();
	page.scoreEditor.plug();
};

page.showBoard = function () {
	const data = {
		teams: page.data.teams,
		matches: page.data.matches.filter(m => m.group == null),
		stadiums: page.data.stadiums
	};

	page.templates.board.parse(data);
	page.templates.board.load(page.config.area.contents);
};

page.parseGroupRanking = function (group) {
	const g = group.charAt(1);
	const teams = page.data.teams.filter(t => t.group == g);
	page.templates.quickRanking.parse(teams, g, group.charAt(0));
};

page.getRankingPopup = function (group1, group2) {
	this.parseGroupRanking(group1);
	this.parseGroupRanking(group2);
	return page.templates.quickRanking.retrieve();
};

page.showPage = function (tplId, options) {
	const tpl = page.templates[tplId];
	tpl.parse(options);
	tpl.load(page.config.area.contents);
};

/**********************************************************/

window.addEventListener('load', function () {
	page.initialize();
});
window.addEventListener('unload', function () {
	page.destroy();
});
