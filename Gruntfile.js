module.exports = function(grunt) {
	
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: ["target"],
		copy: {
			build: { expand: true, cwd: 'src/client/', src: [ 'img/**' ], dest: 'target/static/' },
		},
		concat: {
			build: grunt.file.readJSON('build/cfg/concat.json')
		},
		mergeTemplates: {
			build: grunt.file.readJSON('build/cfg/mergeTemplates.json')
		},
		cssmin: {
			minify: { expand: true, cwd: 'target/static/', src: [ '*.css', '!*.min.css' ], dest: 'target/static/', ext: '.min.css' }
		},
		uglify: {
			minify: {
				files: {
					'target/static/frw.min.js': 'target/static/frw.js',
					'target/static/app.min.js': 'target/static/app.js',
				}
			}
		},
		jshint: {
			options: {
				jshintrc: true
			},
			client: ['src/client/**/*.js'],
			server: ['src/server/**/*.js']
		},
		csslint: {
			options: {
				csslintrc: 'src/client/.csslintrc'
			},
			src: 'src/client/**/*.css'
		},
		watch: {
			jscss: {
				files: [ 'src/client/**/*.js', 'src/client/**/*.css' ],
				tasks: [ 'concat' ]
			},
			tpl: {
				files: 'src/client/**/*.html',
				tasks: [ 'mergeTemplates' ]
			},
			img: {
				files: 'src/client/img/**',
				tasks: [ 'copy' ]
			}
		}
	});
	
	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadTasks('build/tasks');
	
	// Default tasks
	grunt.registerTask('default', [ 'jshint', 'clean', 'copy', 'concat', 'mergeTemplates' ]);
	grunt.registerTask('minify', [ 'cssmin', 'uglify' ]);
};
