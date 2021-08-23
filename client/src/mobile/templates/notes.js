import { Template } from '../../frw/frw.Template.js';

export const notes = new Template();

notes.onCreate = function (pageRef, frwRef, i18nRepository) {
	this.i18n = i18nRepository;
};

notes.onParse = function () {
};