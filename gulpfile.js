
var argv = require('yargs').argv;
var runSequence = require('run-sequence');
var gulp = require('gulp');

require('require-dir')('./tasks');

gulp.task('logic', function(cb) {
	runSequence('templates', 'scripts', cb);
});

gulp.task('view', function(cb) {
	runSequence(/*'images', */'styles', cb);
});

gulp.task('server', function() {
	require('./App/serverApp');
});

gulp.task('default', ['logic', 'view'], function() {
	if (argv.dev) {
		gulp.start('server');
	}
});
