var chokidar = require('chokidar');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var config = require('../config');

function bundle() {
	return gulp.src(config.fonts.libs)
		.pipe(gulp.dest(config.dist + '/public/font'));
}

gulp.task('fonts-bundle', bundle);

gulp.task('fonts', ['fonts-bundle'], function() {
	if ($.util.env.dev) {
		chokidar.watch(config.fonts.libs, { ignoreInitial: true })
			.on('all', bundle);
	}
});
