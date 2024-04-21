const path = require('path');
//const chalk = require('chalk');
const Template = require('./frw/Template.cjs');

module.exports = function (grunt) {
	grunt.registerMultiTask('mergeTemplates', 'Merge templates.', function () {
		// Merge task-specific and/or target-specific options with these defaults.
		const options = this.options({
			prefix: ''
		});

		const tpl = new Template();
		tpl.create(grunt.file.read('build/tasks/templates.tpl'));

		// Iterate over all src-dest file pairs.
		this.files.forEach(file => {
			file.orig.src.forEach(src => {
				const id = path.basename(src, path.extname(src));
				// grunt.log.writeln('File: ' + id + ', ' + src);
				tpl.set('id', id);
				tpl.set('content', grunt.file.read(options.prefix + src));
				tpl.parseBlock('template');
			});
			tpl.parse();

			// Write the destination file.
			grunt.file.write(file.dest, tpl.retrieve());

			// Print a success message.
//			grunt.log.writeln('File ' + chalk.cyan(file.dest) + ' created.'); // need to migrate to webpack
			grunt.log.writeln('File ' + file.dest + ' created.');
		});
	});
};
