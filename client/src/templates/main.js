import { frw } from '@sfidanza/tahr';

let page;

export const main = new frw.Template();

main.onCreate = function (i18nRepository, pageRef) {
	this.i18n = i18nRepository;
	this.autoBindEvents = ['onclick'];
	page = pageRef;
};

main.onParse = function (year) {
	this.set('year', year);
	this.set('cid', page.config.cid);
	this.set('name', page.config.name);

	if (year === '2026') { // Rule for best 3rds is specific to 2026. To be followed for future editions.
		this.parseBlock('bestThirds');
	}

	if (page.data.matches.some(m => m.phase === 'J')) {
		this.parseBlock('round32');
	}

	const edition = page.data.history[page.config.cid].find(el => el.year === year);
	if (edition && !edition.light) {
		this.parseBlock('finals');
	}

	const current = page.data.history[page.config.cid].find(el => el.year === year);
	if (current && !current.winnerId) {
		this.parseBlock('bet');
		this.parseBlock('tip');
	}

	if (page.config.ft.LIVE) {
		this.parseBlock('live');
	}
};

main.submitLogin = function (id, pwd) {
	page.login({
		id: id,
		pwd: pwd
	});
	page.loginDlg.hide();
};

main.toggleLive = function (tag) {
	if (tag.classList.contains('active')) {
		page.live.stop();
		tag.classList.remove('active');
		tag.innerHTML = 'Live: disabled';
	} else {
		tag.classList.add('active');
		tag.innerHTML = 'Live: enabled';
		page.live.start()
			.addEventListener('watcher-count', ({ data }) => {
				tag.innerHTML = `Live: ${data} watching`;
			});
	}
};
