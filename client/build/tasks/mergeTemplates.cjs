const path = require('path');

module.exports = function (grunt) {
	grunt.registerMultiTask('mergeTemplates', 'Merge templates.', function () {
		// Merge task-specific and/or target-specific options with these defaults.
		const options = this.options({
			prefix: ''
		});

		const tpl = {};

		// Iterate over all src-dest file pairs.
		this.files.forEach(file => {
			file.src.forEach(src => {
				const id = path.basename(src, path.extname(src));
				tpl[id] = grunt.file.read(options.prefix + src);
			});

			// Write the destination file.
			grunt.file.write(file.dest, JSON.stringify({ templates: tpl }));

			// Print a success message.
			grunt.log.writeln('File ' + file.dest + ' created.');
		});
	});
};
