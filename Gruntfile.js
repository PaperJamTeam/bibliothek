'use strict';

const request = require('request');

module.exports = function (grunt) {
	// show elapsed time at the end
	require('time-grunt')(grunt);
	// load all grunt tasks
	require('load-grunt-tasks')(grunt);

	const reloadPort = 35729;
	let files;

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		develop: {
			server: {
				file: 'bin/www'
			}
		},
		less: {
			dist: {
				files: {
					'public/css/style.css': 'public/css/style.less'
				}
			}
		},
		watch: {
			options: {
				nospawn: true,
				livereload: reloadPort
			},
			server: {
				files: [
					'bin/www',
					'bin/www.js',
					'app.js',
					'routes/*.js',
					'models/*.js'
				],
				tasks: ['exec:compile']
			},
			js: {
				files: ['public/js/*.js'],
				options: {
					livereload: reloadPort
				}
			},
			css: {
				files: [
					'public/css/*.less'
				],
				tasks: ['less'],
				options: {
					livereload: reloadPort
				}
			},
			views: {
				files: ['views/*.ejs'],
				options: {
					livereload: reloadPort
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-exec');

	grunt.config.requires('watch.server.files');
	files = grunt.config('watch.server.files');
	files = grunt.file.expand(files);

	grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
		const done = this.async();
		setTimeout(function () {
			request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','), function (err, res) {
				const reloaded = (!err && res.statusCode === 200);
				if (reloaded) {
					grunt.log.ok('Delayed live reload successful.');
				} else {
					grunt.log.error('Unable to make a delayed live reload.');
				}
				done(reloaded);
			});
		}, 500);
	}.bind(grunt));

	grunt.registerTask('default', [
		'less',
		'develop',
		'watch'
	]);
};
