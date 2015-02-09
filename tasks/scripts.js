
var path = require('path');

var argv = require('yargs').argv;
var glob = require('flat-glob');
var es = require('event-stream');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var watchify = require('watchify');
var browserifyTrim = require('browserify-trim');
var browserifyHTMLBindify = require('browserify-html-bindify');
var browserifyRiftTemplate = require('browserify-rift-template');

var helpers = require('./helpers');

var globalScripts = [
	'bower_components/jquery/dist/jquery.js',
	'bower_components/jquery-mods/jquery.mods.js'
];

var cache = {};

gulp.task('scripts-bundle', function() {
	var bundler;

	if (argv.dev) {
		bundler = cache.bundler || watchify(browserify({ cache: {}, packageCache: {} }));
	} else {
		bundler = browserify();
	}

	if (!cache.bundler) {
		bundler
			.transform(browserifyTrim(['.rft']))
			.transform(browserifyHTMLBindify(['.rft'], {
				attrBindName: 'rt-bind',
				skipAttributes: ['rt-options']
			}))
			.transform(browserifyRiftTemplate);

		glob.sync(['./App/View/*/*.js'])
			.filter(helpers.isRootFile)
			.forEach(function(file) {
				bundler.add(path.join(__dirname, '..', file));
			});

		bundler.add(path.join(__dirname, '../App/clientApp.js'));

		if (argv.dev) {
			bundler.on('update', rebundle);
		}

		cache.bundler = bundler;
	}

	function rebundle() {
		return es.concat(
			gulp.src(globalScripts)
				.pipe($.concat('globalScripts.js')),

			bundler.bundle()
				.on('error', helpers.browserifyErrorHandler)
				.pipe(source('app.js'))
				.pipe(buffer())
		)
			.pipe($.order(['globalScripts.js', 'app.js']))
			.pipe($.concat('app.js'))
			.pipe(argv.release ? $.uglify() : $.util.noop())
			.pipe(gulp.dest('build/public/scripts'));
	}

	return rebundle();
});

gulp.task('scripts', ['scripts-bundle'], function() {
	if (argv.dev) {
		gulp.watch(globalScripts, ['scripts-bundle']);
	}
});
