
var argv = require('yargs').argv;
var glob = require('flat-glob');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var helpers = require('./helpers');

gulp.task('templates-bundle', function() {
	return gulp.src(glob.sync(['./App/View/*/*.rtt']).filter(helpers.isRootFile))
		.pipe($.plumber(helpers.plumberErrorHandler))
		.pipe($.cached('scripts-bundle-templates'))
		.pipe($.trim())
		.pipe($.htmlBindify({
			attrBindName: 'rt-bind',
			skipAttributes: ['rt-options']
		}))
		.pipe($.riftTemplate({ namespace: 'exports' }))
		.pipe($.remember('scripts-bundle-templates'))
		.pipe($.concat('templates.js'))
		.pipe(gulp.dest('build/private'));
});

gulp.task('templates', ['templates-bundle'], function() {
	if (argv.dev) {
		gulp.watch(['App/View/*/*.rtt'], ['templates-bundle']);
	}
});
