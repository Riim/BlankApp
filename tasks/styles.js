
var argv = require('yargs').argv;
var glob = require('flat-glob');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var helpers = require('./helpers');

var globalStyles = [
	//
];

gulp.task('styles-bundle', function() {
	return gulp.src(glob.sync([
		globalStyles,
		glob.sync(['./App/View/View.less', './App/View/*/*.less']).filter(helpers.isRootFile)
    ]))
		.pipe($.concat('app.less'))
		.pipe($.less())
		.pipe($.autoprefixer('last 2 version', '> 1%'))
		.pipe(argv.release ? $.base64({
			baseDir: 'build/public/styles',
			extensions: ['svg', 'png'],
			maxImageSize: 32 * 1024
		}) : $.util.noop())
		.pipe(argv.release ? $.csso() : $.util.noop())
		.pipe(gulp.dest('build/public/styles'));
});

gulp.task('styles', ['styles-bundle'], function() {
	if (argv.dev) {
		gulp.watch(['assets/styles/**.less', 'App/View/**.less'], ['styles-bundle']);
	}
});
