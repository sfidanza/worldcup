/**********************************************************
 * Page
 **********************************************************/
import * as frw from '../frw/frw.js';
import { config } from './config.js';

export const page = {
	data: {},
	config: config
};
window.page = page; // make page callable from global scope so it can be used from html

page.initialize = function () {
	// retrieve templates and data
	page.notify('Loading data...', true);
	Promise.all([
		frw.ssa.loadTemplates(page.config.url.templates, page.templates, page, frw),
		page.getData()
	]).then(() => {
		// Set pageTitle function
		page.config.i18n.pageTitle = page.config.i18n.title.bind(null, page.config.name);

		// display
		page.templates.main.parse(page.config.year);
		page.templates.main.load(page.config.area.main);

		// page.templates.user.parse(page.data);
		// page.templates.user.load(page.config.area.user);

		page.show('list');

		page.notify(null);
	});
};

page.destroy = function () {
	this.pwl = null;
	for (const id in page.templates) {
		const tpl = page.templates[id];
		if (tpl.destroy) tpl.destroy();
	}
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
	return fetch(page.config.url.history)
		.then(response => response.json())
		.then(data => {
			for (const cid in data) {
				data[cid].forEach(el => el.cid	= cid);
			}
			page.data.history = [].concat(...Object.values(data))
				.filter(el => el.available)
				.sort((a, b) => b.year - a.year);
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

	if (cb) cb();
};

page.view = function (viewName) {
	page.show(...viewName.split(','));
};

page.show = function (viewName, ...option) {
	switch (viewName) {
		case 'list': page.showList(); break;
		case 'login': page.showPage('login', ...option); break;
	}
	document.getElementById(page.config.area.contents).className = 'page-' + viewName;
};

page.showPage = function (tplId, options) {
	const tpl = page.templates[tplId];
	tpl.parse(options);
	tpl.load(page.config.area.contents);
};

page.showList = function () {
	page.templates.list.parse();
	page.templates.list.load(page.config.area.contents);

	const active = page.data.history.find(el => !el.winnerId);
	if (active) {
		page.getJobs(active.year);
	}
};

page.reset = function () {
	fetch(page.config.url.reset)
		.then(response => response.json())
		.then(data => {
			console.log('reset', data);
		});
};

page.preview = function (year, event) {
	if (event) event.preventDefault();
	fetch(page.config.url.preview(year))
		.then(response => response.json())
		.then(data => {
			console.log('preview', data);
		});
};

page.import = function (year, event) {
	if (event) event.preventDefault();
	fetch(page.config.url.import(year))
		.then(response => response.json())
		.then(data => {
			console.log('import', data);
		});
};

page.getJobs = function (year) {
	fetch(page.config.url.jobs(year))
		.then(response => response.json())
		.then(jobs => {
			page.data.jobs = jobs;
			page.data.jobsLastCheck = new Date();
			page.templates.jobs.parse();
			page.templates.jobs.load(page.config.area.jobs);
		});
};

page.schedule = function (year) {
	fetch(page.config.url.schedule(year))
		.then(response => response.json())
		.then(data => {
			console.log('schedule', data);
			page.getJobs(year);
		});
};

page.unschedule = function (year) {
	fetch(page.config.url.unschedule(year))
		.then(response => response.json())
		.then(data => {
			console.log('unschedule', data);
			page.getJobs(year);
		});
};

/**********************************************************/

window.addEventListener('load', function () {
	page.initialize();
});
window.addEventListener('unload', function () {
	page.destroy();
});
