
var argv = require('yargs').argv;
var runSequence = require('run-sequence');
var gulp = require('gulp');

var server = require('./tasks/server');

require('require-dir')('./tasks');

gulp.task('js', function(done) {
	runSequence('templates', 'scripts', done);
});

gulp.task('view', function(done) {
	runSequence(/*'images', */'styles', done);
});

gulp.task('build', ['js', 'view'], function() {
	if (argv.dev) {
		server.restart();
	}
});

gulp.task('default', ['build']);

process.on('exit', function() {
	server.kill();
});
