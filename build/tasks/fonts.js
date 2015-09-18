var chokidar = require('chokidar');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var config = require('../config');

function copy() {
	return gulp.src(config.fonts.files)
		.pipe(gulp.dest(config.dist + '/public/font'));
}

gulp.task('fonts-copy', copy);

gulp.task('fonts', ['fonts-copy'], function() {
	if ($.util.env.dev) {
		chokidar.watch(config.fonts.files, { ignoreInitial: true })
			.on('all', copy);
	}
});
