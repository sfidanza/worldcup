module.exports = function (grunt) {

	const countries = grunt.file.readJSON('build/sprite/countries.json');

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sprite: {
			all: {
				src: 'src/img/flags/*.png',
				dest: 'src/img/flags-spritesheet.png',
				destCss: 'src/css/flags.css',
				cssTemplate: 'src/flags/flags.css.handlebars',
				cssHandlebarsHelpers: {
					adjustY: (y) => y + 2,
					fifa: (name) => countries[name] ?? name,
				},
				algorithm: 'top-down',
				padding: 3
			}
		}
	});

	// Load plugins
	grunt.loadNpmTasks('grunt-spritesmith');
};
