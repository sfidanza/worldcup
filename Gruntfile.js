module.exports = function(grunt) {
	
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			build: grunt.file.readJSON('build/cfg/concat.json')
		},
		mergeTemplates: {
			build: grunt.file.readJSON('build/cfg/mergeTemplates.json')
		},
		jshint: {
			options: {
				jshintrc: true
			},
			client: ['src/client/*/*.js'],
			server: ['src/server/**/*.js']
		}
	});
	
	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadTasks('build/tasks');
	
	// Default tasks
	grunt.registerTask('default', [ 'jshint', 'concat', 'mergeTemplates' ]);
	
};
