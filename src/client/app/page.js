/**********************************************************
 * Page
 **********************************************************/
 
var page = {};
page.templates = {};
page.data = {};

page.config = {
	url: {
		templates: "static/app.xml",
		login: "api/user/login",
		logout: "api/user/logout",
		register: "api/user/register",
		data: "api/data",
		auth: "api/auth/url",
		authProfile: "api/auth/profile"
	},
	i18n: {
		pageTitle: "2014 Worldcup - {stateTitle}",
		group: "Group {group}",
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

page.initialize = function() {
	// retrieve templates
	page.notify("Loading templates...", true);
	frw.ssa.loadTemplates(page.config.url.templates, page.templates);
	
	// retrieve data
	page.notify("Loading data...");
	page.getData();
	
	// Initialize history
	frw.history.initialize(page.select.bind(page));
	
	// display
	page.notify(null);
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
};

page.destroy = function() {
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

page.notify = function(message, init) {
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

page.getData = function() {
	frw.ssa.sendRequest({
		async: true,
		url: page.config.url.data,
		type: 'json',
		callback: page.setData,
		override: page
	});
};

page.setData = function(data) {
	data.stadiums = frw.data.reIndex(data.stadiums, 'id');
	page.data = data;
};

page.register = function(data, cb) {
	frw.ssa.sendRequest({
		url: frw.ssa.buildGETUrl(page.config.url.register, data),
		type: 'json',
		callback: page.refreshUser,
		override: page,
		params: cb
	});
};

page.login = function(data, cb) {
	frw.ssa.sendRequest({
		url: frw.ssa.buildGETUrl(page.config.url.login, data),
		type: 'json',
		callback: page.refreshUser,
		override: page,
		params: cb
	});
};

page.logout = function() {
	frw.ssa.sendRequest({
		url: page.config.url.logout,
		type: 'json',
		callback: page.refreshUser,
		override: page
	});
};

page.refreshUser = function(data, cb) {
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

page.getPageTitle = function(stateTitle) {
	return page.config.i18n.pageTitle.supplant({ stateTitle: stateTitle });
};

page.getMenuItem = function(hash) {
	var menu = document.getElementById('menu');
	var items = menu.getElementsByTagName('a');
	for (var i=0; i<items.length; i++) {
		if (items[i].hash == hash) return items[i];
	}
	return null;
};

page.highlight = function(link) {
	var menu = document.getElementById('menu');
	var items = getElementsByClassName(menu, 'selected');
	for (var i=0; i<items.length; i++) {
		items[i].className = '';
	}
	link.className = 'selected';
	link.blur();
};

page.select = function(link, event) {
	if (event) frw.stopEvent(event);
	
	var target;
	if (typeof link === "string") {
		target = link;
		link = page.getMenuItem('#'+target);
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

page.redrawView = function() {
	page.view(this.current);
};

page.view = function(viewName) {
	page.scoreEditor.unplug();
	var args = viewName.split(",", 2);
	page.show(args[0], args[1]);
};

page.show = function(viewName, option) {
	switch (viewName) {
		case 'schedule': page.showSchedule(option); break;
		case 'ranking': page.showRanking(option); break;
		case 'group': page.showGroup(option); break;
		case 'board': page.showBoard(); break;
		case 'history': page.showPage('history'); break;
		case 'notes': page.showPage('notes'); break;
		case 'login': page.showLogin(option); break;
		case 'register': page.showRegister(option); break;
		case 'bet': page.showBet(option); break;
	}
	document.getElementById(page.config.area.contents).className = "page-"+viewName;
};

page.showSchedule = function(phase) {
	var matches = (phase == 1) ? frw.data.filter(page.data.matches, "phase", "G") :
		((phase == 2) ? frw.data.filter(page.data.matches, "group", null) : page.data.matches);
	
	var data = {
		teams: page.data.teams,
		matches: matches,
		stadiums: page.data.stadiums
	};
	
	page.templates.schedule.parse(data);
	page.templates.schedule.load(page.config.area.contents);
	page.scoreEditor.plug();
};

page.showRanking = function(group) {
	if (!group) {
		var teamsByGroup = frw.data.groupBy(page.data.teams, 'group', true);
		for (var g in teamsByGroup) {
			page.templates.ranking.parse(teamsByGroup[g], g);
		}
	} else {
		var data = {
			teams: frw.data.filter(page.data.teams, "group", group)
		};
		page.templates.ranking.parse(data.teams, group);
	}
	page.templates.ranking.load(page.config.area.contents);
};

page.showGroup = function(group) {
	var data = {
		teams: frw.data.filter(page.data.teams, "group", group),
		matches: frw.data.filter(page.data.matches, "group", group),
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

page.showBoard = function() {
	var data = {
		teams: page.data.teams,
		matches: frw.data.filter(page.data.matches, "group", null),
		stadiums: page.data.stadiums
	};
	
	page.templates.board.parse(data);
	page.templates.board.load(page.config.area.contents);
};

page.showNotes = function() {
	page.templates.notes.parse();
	page.templates.notes.load(page.genericDlg.getBody());
	page.genericDlg.setTitle("Notes");
	page.genericDlg.show();
};

page.parseGroupRanking = function(group) {
	var g = group.charAt(1);
	var teams = frw.data.filter(page.data.teams, "group", g);
	page.templates.quickRanking.parse(teams, g, group.charAt(0));
};

page.getRankingPopup = function(group1, group2) {
	this.parseGroupRanking(group1);
	this.parseGroupRanking(group2);
	return page.templates.quickRanking.retrieve();
};

page.showLogin = function(backTo) {
	page.templates.login.parse(backTo);
	page.templates.login.load(page.config.area.contents);
};

page.showRegister = function(backTo) {
	page.templates.register.parse(backTo);
	page.templates.register.load(page.config.area.contents);
};

page.showBet = function() {
	page.templates.bet.parse();
	page.templates.bet.load(page.config.area.contents);
};

page.showPage = function(tplId, options) {
	var tpl = page.templates[tplId];
	tpl.parse(options);
	tpl.load(page.config.area.contents);
};

/**********************************************************/

frw.addListener(window, "load", function() {
	page.initialize();
});
frw.addListener(window, "unload", function() {
	page.destroy();
});

