import { Template } from '../../frw/frw.Template.js';

let page;

export const jobs = new Template();

jobs.onCreate = function (pageRef, frwRef, i18nRepository) {
	page = pageRef;
	this.i18n = i18nRepository;
};

jobs.onParse = function () {
	this.set('jobsLastCheck', page.config.i18n.formats.datetime.format(page.data.jobsLastCheck));
	page.data.jobs.forEach((job, i) => {
		this.set('row_class', 'l' + (i % 2));
		this.set('job', job);
		this.set('job.next', page.config.i18n.formats.datetime.format(new Date(job.next)));
		this.parseBlock('job');
	});
};
