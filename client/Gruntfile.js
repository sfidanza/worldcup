module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: ['target/*'],
		copy: {
			build: {
				files: [
					{ expand: true, cwd: 'src/desktop/', src: ['img/**'], dest: 'target/static/' },
					{ expand: true, cwd: 'src/desktop/', src: ['**/*.js'], dest: 'target/static/' },
					{ expand: true, cwd: 'src/mobile/', src: ['**/*.js'], dest: 'target/static/mobile/' }
				]
			}
		},
		concat: {
			desktop: grunt.file.readJSON('build/cfg/concat.json'),
			mobile: grunt.file.readJSON('build/cfg/concat.mobile.json')
		},
		mergeTemplates: {
			desktop: grunt.file.readJSON('build/cfg/mergeTemplates.json'),
			mobile: grunt.file.readJSON('build/cfg/mergeTemplates.mobile.json')
		},
		cssmin: {
			minify: {
				files: {
					'target/static/app.css': 'target/static/app.css',
					'target/static/app.mobile.css': 'target/static/app.mobile.css'
				}
			}
		},
		uglify: {
			minify: {
				files: {
					'target/static/frw.js': 'target/static/frw.js',
					'target/static/app.js': 'target/static/app.js',
					'target/static/app.mobile.js': 'target/static/app.mobile.js'
				}
			}
		},
		eslint: {
			// options: { fix: true },
			desktop: ['src/desktop/**/*.js'],
			mobile: ['src/mobile/**/*.js']
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			src: ['src/desktop/**/*.css', 'src/mobile/**/*.css']
		},
		watch: {
			all: {
				files: 'Gruntfile.js',
				tasks: 'default'
			},
			css: {
				files: ['src/desktop/**/*.css', 'build/cfg/concat.json'],
				tasks: ['concat:desktop']
			},
			mcss: {
				files: ['src/mobile/**/*.css', 'build/cfg/concat.mobile.json'],
				tasks: ['concat:mobile']
			},
			eslintDesktop: {
				files: ['src/desktop/**/*.js'],
				tasks: ['eslint:desktop']
			},
			eslintMobile: {
				files: ['src/mobile/**/*.js'],
				tasks: ['eslint:mobile']
			},
			eslint: {
				files: ['.eslintrc'],
				tasks: ['eslint']
			},
			tpl: {
				files: ['src/desktop/**/*.html', 'build/cfg/mergeTemplates.json'],
				tasks: ['mergeTemplates:desktop']
			},
			mtpl: {
				files: ['src/mobile/**/*.html', 'build/cfg/mergeTemplates.mobile.json'],
				tasks: ['mergeTemplates:mobile']
			},
			copy: {
				files: ['src/desktop/img/**', 'src/desktop/**/*.js', 'src/mobile/**/*.js'],
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
	grunt.loadTasks('build/tasks');

	// Default tasks
	grunt.registerTask('default', ['eslint', 'clean', 'copy', 'concat', 'mergeTemplates']);
	grunt.registerTask('minify', ['cssmin', 'uglify']);
	grunt.registerTask('prod', ['default'/*, 'minify'*/]);
};
