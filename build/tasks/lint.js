var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var config = require('../config');

gulp.task('lint-js', function() {
	return gulp.src([config.src + '/**/*.js', 'build/**/*.js'])
		.pipe($.jscs())
		.pipe($.eslint())
		.pipe($.eslint.format());
});

gulp.task('lint', ['lint-js']);
