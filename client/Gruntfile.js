module.exports = function (grunt) {

	const countries = grunt.file.readJSON('build/cfg/countries.json');

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: ['target/*'],
		copy: {
			build: {
				files: [
					{ expand: true, cwd: 'src/', src: ['img/**'], dest: 'target/static/' },
					{ expand: true, cwd: 'src/', src: ['**/*.js'], dest: 'target/static/' },
					{ expand: true, cwd: 'src/', src: ['*.html'], dest: 'target/static/' }
				]
			}
		},
		concat: {
			target: grunt.file.readJSON('build/cfg/concat.json')
		},
		mergeTemplates: {
			target: grunt.file.readJSON('build/cfg/mergeTemplates.json')
		},
		cssmin: {
			minify: {
				files: {
					'target/static/app.css': 'target/static/app.css'
				}
			}
		},
		uglify: {
			minify: {
				files: {
					'target/static/frw.js': 'target/static/frw.js',
					'target/static/app.js': 'target/static/app.js'
				}
			}
		},
		eslint: {
			// options: { fix: true },
			target: ['src/**/*.js']
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			src: ['src/**/*.css']
		},
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
		},
		watch: {
			all: {
				files: 'Gruntfile.js',
				tasks: 'default'
			},
			css: {
				files: ['src/**/*.css', 'build/cfg/concat.json'],
				tasks: ['concat']
			},
			eslint: {
				files: ['.eslintrc', 'src/**/*.js'],
				tasks: ['eslint']
			},
			tpl: {
				files: ['src/templates/**/*.html', 'build/cfg/mergeTemplates.json'],
				tasks: ['mergeTemplates']
			},
			copy: {
				files: ['src/img/**', 'src/**/*.js', 'src/*.html'],
				tasks: ['copy']
			}
		}
	});

	// Load plugins
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-spritesmith');
	grunt.loadTasks('build/tasks');

	// Default tasks
	grunt.registerTask('default', ['eslint', 'csslint', 'clean', 'copy', 'concat', 'mergeTemplates']);
	grunt.registerTask('minify', ['cssmin', 'uglify']);
	grunt.registerTask('prod', ['default'/*, 'minify'*/]);
};
