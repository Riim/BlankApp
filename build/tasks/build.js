var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var server = require('../server');

gulp.task('build', ['scripts', 'styles', 'fonts'], function() {
	if ($.util.env.dev) {
		server.start();
	}
});

process.on('exit', function() {
	server.kill();
});
