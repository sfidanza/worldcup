/* global frw, uic */
/**********************************************************
 * Page
 **********************************************************/

var page = {};
page.templates = {};
page.data = {};

page.config = {
	url: {
		templates: "static/app.xml",
		data: "api/all",
		logout: "api/user/logout",
		login: (login) => `api/user/login?id=${login.id}&pwd=${login.pwd}`,
		register: (login) => `api/user/register?id=${login.id}&pwd=${login.pwd}&name=${login.name}`,
		auth: (provider) => `api/auth/url?provider=${provider}`,
		authProfile: (code) => `api/auth/profile?code=${code}`
	},
	i18n: {
		pageTitle: (state) => `2014 Worldcup - ${state}`,
		group: (group) => `Group ${group}`,
		phaseG: "Group Matches",
		phaseH: "Round of 16",
		phaseQ: "Quarter-Finals",
		phaseS: "Semi-Finals",
		phaseT: "Third place",
		phaseF: "Final"
	},
	area: {
		main: "global-container",
		pwl: "app-pwl",
		contents: "contents",
		user: "user-area",
		genericDlg: "generic-dlg",
		loginDlg: "login-dlg"
	},
	defaultPage: 'schedule',
	lang: "en-GB"
};

page.initialize = function () {
	// retrieve templates and data
	page.notify("Loading data...", true);
	Promise.all([
		frw.ssa.loadTemplates(page.config.url.templates, page.templates),
		page.getData()
	]).then(() => {
		// Initialize history
		frw.history.initialize(page.select.bind(page));

		// display
		page.templates.main.parse();
		page.templates.main.load(page.config.area.main);

		page.templates.user.parse(page.data);
		page.templates.user.load(page.config.area.user);
		page.scoreEditor.initialize();

		this.loginDlg = new uic.Dialog({
			id: page.config.area.loginDlg,
			centered: true
		});
		this.genericDlg = new uic.Dialog({
			id: page.config.area.genericDlg,
			centered: true
		});
		this.tooltip = new uic.Tooltip(0);

		page.select(frw.history.getCurrentState() || page.config.defaultPage);
		page.notify(null);
	});
};

page.destroy = function () {
	this.genericDlg.destroy();
	this.loginDlg.destroy();
	this.tooltip.destroy();
	this.pwl = null;
	for (var id in page.templates) {
		var tpl = page.templates[id];
		if (tpl.destroy) tpl.destroy();
	}

	page.scoreEditor.destroy();
};

page.notify = function (message, init) {
	if (!this.pwl) this.pwl = document.getElementById(page.config.area.pwl);
	if (message) {
		this.pwl.innerHTML = message;
	} else {
		this.pwl.innerHTML = "";
		this.pwl.style.visibility = "hidden";
	}
	if (init) {
		frw.dom.center(this.pwl);
		this.pwl.style.visibility = "visible";
	}
};

page.getData = async function () {
	return fetch(page.config.url.data)
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
	let items = document.querySelectorAll('#menu a');
	Array.from(items).find(item => {
		return item.hash === hash;
	});
};

page.highlight = function (link) {
	document.querySelectorAll('#menu a.selected').forEach(item => {
		item.className = '';
	});
	link.className = 'selected';
	link.blur();
};

page.select = function (link, event) {
	if (event) frw.stopEvent(event);

	let target;
	if (typeof link === "string") {
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
	page.show(...viewName.split(","));
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
	document.getElementById(page.config.area.contents).className = "page-" + viewName;
};

page.showSchedule = function (phase) {
	let matches = (phase == 1) ? page.data.matches.filter(m => m.phase == 'G') :
		((phase == 2) ? page.data.matches.filter(m => m.group == null) : page.data.matches);

	let data = {
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
		let teamsByGroup = frw.data.groupBy(page.data.teams, 'group', true);
		for (let g in teamsByGroup) {
			page.templates.ranking.parse(teamsByGroup[g], g);
		}
	} else {
		let data = {
			teams: page.data.teams.filter(item => item.group === group)
		};
		page.templates.ranking.parse(data.teams, group);
	}
	page.templates.ranking.load(page.config.area.contents);
};

page.showGroup = function (group) {
	var data = {
		teams: page.data.teams.filter(item => item.group === group),
		matches: page.data.matches.filter(item => item.group === group),
		stadiums: page.data.stadiums
	};

	page.templates.ranking.parse(data.teams, group);
	page.templates.schedule.parse(data);
	var content = [
		page.templates.ranking.retrieve(),
		page.templates.schedule.retrieve()
	].join("\n");
	frw.dom.updateContainer(content, document.getElementById(page.config.area.contents));
	page.templates.ranking.onLoad();
	page.templates.schedule.onLoad();
	page.scoreEditor.plug();
};

page.showBoard = function () {
	var data = {
		teams: page.data.teams,
		matches: page.data.matches.filter(m => m.group == null),
		stadiums: page.data.stadiums
	};

	page.templates.board.parse(data);
	page.templates.board.load(page.config.area.contents);
};

page.showNotes = function () {
	page.templates.notes.parse();
	page.templates.notes.load(page.genericDlg.getBody());
	page.genericDlg.setTitle("Notes");
	page.genericDlg.show();
};

page.parseGroupRanking = function (group) {
	var g = group.charAt(1);
	var teams = page.data.teams.filter(t => t.group == g);
	page.templates.quickRanking.parse(teams, g, group.charAt(0));
};

page.getRankingPopup = function (group1, group2) {
	this.parseGroupRanking(group1);
	this.parseGroupRanking(group2);
	return page.templates.quickRanking.retrieve();
};

page.showPage = function (tplId, options) {
	var tpl = page.templates[tplId];
	tpl.parse(options);
	tpl.load(page.config.area.contents);
};

/**********************************************************/

window.addEventListener("load", function () {
	page.initialize();
});
window.addEventListener("unload", function () {
	page.destroy();
});
