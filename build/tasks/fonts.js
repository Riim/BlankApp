var chokidar = require('chokidar');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var config = require('../config');

function prepare() {
	return gulp.src(config.fonts.files)
		.pipe(gulp.dest(config.dist + '/public/font'));
}

gulp.task('fonts-prepare', prepare);

gulp.task('fonts', ['fonts-prepare'], function() {
	if ($.util.env.dev) {
		chokidar.watch(config.fonts.files, { ignoreInitial: true })
			.on('all', prepare);
	}
});
