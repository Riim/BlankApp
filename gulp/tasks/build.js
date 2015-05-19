var gulp = require('gulp');
var gutil = require('gulp-util');

var server = require('../server');

gulp.task('build', ['scripts', 'styles'], function() {
	if (gutil.env.dev) {
		server.start();
	}
});

process.on('exit', function() {
	server.kill();
});
