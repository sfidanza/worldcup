module.exports = function(grunt) {
	
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: ["target"],
		copy: {
			build: { expand: true, cwd: 'src/client/', src: [ 'img/**' ], dest: 'target/static/' },
		},
		concat: {
			build: grunt.file.readJSON('build/cfg/concat.json'),
			mobile: grunt.file.readJSON('build/cfg/concat.mobile.json')
		},
		mergeTemplates: {
			build: grunt.file.readJSON('build/cfg/mergeTemplates.json'),
			mobile: grunt.file.readJSON('build/cfg/mergeTemplates.mobile.json')
		},
		cssmin: {
			minify: {
				files: {
					'target/static/app.min.css': 'target/static/app.css',
					'target/static/app.mobile.min.css': 'target/static/app.mobile.css'
				}
			}
		},
		uglify: {
			minify: {
				files: {
					'target/static/frw.min.js': 'target/static/frw.js',
					'target/static/app.min.js': 'target/static/app.js',
					'target/static/app.mobile.min.js': 'target/static/app.mobile.js'
				}
			}
		},
		jshint: {
			options: {
				jshintrc: true
			},
			mobile: ['src/mobile/**/*.js'],
			client: ['src/client/**/*.js'],
			server: ['src/server/**/*.js']
		},
		csslint: {
			options: {
				csslintrc: 'src/client/.csslintrc'
			},
			src: ['src/client/**/*.css', 'src/mobile/**/*.css']
		},
		watch: {
			all: {
				files: 'Gruntfile.js',
				tasks: 'default'
			},
			js: {
				files: [ 'src/client/**/*.js' ],
				tasks: [ 'concat:build', 'uglify' ]
			},
			css: {
				files: [ 'src/client/**/*.css' ],
				tasks: [ 'concat:build', 'cssmin' ]
			},
			jscss: {
				files: [ 'build/cfg/concat.json' ],
				tasks: [ 'concat:build', 'cssmin', 'uglify' ]
			},
			tpl: {
				files: ['src/client/**/*.html', 'build/cfg/mergeTemplates.json' ],
				tasks: [ 'mergeTemplates:build' ]
			},
			mjs: {
				files: [ 'src/mobile/**/*.js' ],
				tasks: [ 'concat:mobile', 'uglify' ]
			},
			mcss: {
				files: [ 'src/mobile/**/*.css' ],
				tasks: [ 'concat:mobile', 'cssmin' ]
			},
			mjscss: {
				files: [ 'build/cfg/concat.mobile.json' ],
				tasks: [ 'concat:mobile', 'cssmin', 'uglify' ]
			},
			mtpl: {
				files: [ 'src/mobile/**/*.html', 'build/cfg/mergeTemplates.mobile.json' ],
				tasks: [ 'mergeTemplates:mobile' ]
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
	grunt.registerTask('default', [ 'jshint', 'clean', 'copy', 'concat', 'mergeTemplates', 'cssmin', 'uglify' ]);
	grunt.registerTask('minify', [ 'cssmin', 'uglify' ]);
};
