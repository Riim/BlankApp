var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('lint-js', function() {
	return gulp.src(['App/**/*.js'])
		.pipe($.jscs())
		.pipe($.eslint())
		.pipe($.eslint.format());
});

gulp.task('lint', ['lint-js']);
