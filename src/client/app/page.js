/**********************************************************
 * Page
 **********************************************************/
 
var page = {};
page.templates = {};
page.data = {};

page.config = {
	url: {
		templates: "static/app.tpl",
		login: "api/user/login?",
		logout: "api/user/logout?",
		data: "api/data"
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
	page.data = data;
};

page.login = function(data) {
	frw.ssa.sendRequest({
		url: frw.ssa.buildGETUrl(page.config.url.login, data),
		type: 'json',
		callback: page.refreshUser,
		override: page
	});
};

page.logout = function(data) {
	frw.ssa.sendRequest({
		url: page.config.url.logout,
		type: 'json',
		callback: page.refreshUser,
		override: page
	});
};

page.refreshUser = function(data) {
	page.data.user = data.user;
	
	page.templates.main.parse();
	page.templates.main.load(page.config.area.main);
	
	page.templates.user.parse(data);
	page.templates.user.load(page.config.area.user);
	
	page.redrawView();
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
		var data = page.data;
		var teamsByGroup = frw.data.groupBy(data.teams, 'group', true);
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

page.getRankingPopup = function(group1, group2) {
	var group = group1.charAt(1);
	var teams = frw.data.filter(page.data.teams, "group", group);
	page.templates.quickRanking.parse(teams, group, group1.charAt(0));
	
	var group = group2.charAt(1);
	var teams = frw.data.filter(page.data.teams, "group", group);
	page.templates.quickRanking.parse(teams, group, group2.charAt(0));
	
	return page.templates.quickRanking.retrieve();
};

page.showBet = function(subpage) {
	if (subpage === 'user') {
		page.templates.bet.parse();
		page.templates.bet.load(page.config.area.contents);
	} else if (subpage === 'all') {
		page.templates.allBets.parse();
		page.templates.allBets.load(page.config.area.contents);
	}
};

/**********************************************************/

frw.addListener(window, "load", function() {
	page.initialize();
});
frw.addListener(window, "unload", function() {
	page.destroy();
});

