var path = require('path');

var glob = require('glob');
var chokidar = require('chokidar');
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

var config = require('../config');
var helpers = require('../helpers');
var server = require('../server');

var bundler = null;

function bundle() {
	var bndlr;

	if ($.util.env.dev) {
		bndlr = bundler || watchify(browserify({ cache: {}, packageCache: {} }));
	} else {
		bndlr = browserify();
	}

	if (!bundler) {
		bndlr
			.transform(browserifyTrim(['.rtt']))
			.transform(browserifyHTMLBindify(['.rtt'], {
				attrBindName: 'rt-bind',
				skipAttributes: ['rt-d'],
				outputDelimiters: ['{{,\'\'+_.', '}}']
			}))
			.transform(browserifyRiftTemplate);

		[].concat(
			config.scripts.externalModules
				.map(function(module) { return module.js; }),
			glob.sync(path.join(__dirname, '../../App/View/*/*.js'))
				.filter(helpers.isRootFile)
		).forEach(function(file) {
			bndlr.add(file);
		});

		bndlr.add(path.join(__dirname, '../../App/clientApp/clientApp.js'));

		if ($.util.env.dev) {
			bndlr.on('update', function() {
				rebundle().once('end', function() {
					server.restart();
				});
			});
		}

		bundler = bndlr;
	}

	return rebundle();
}

function rebundle() {
	return es.concat(
		gulp.src(config.scripts.globals)
			.pipe($.concat('globals.js')),

		bundler.bundle()
			.on('error', helpers.browserifyErrorHandler)
			.pipe(source('app.js'))
			.pipe(buffer())
	)
		.pipe($.order(['globals.js', 'app.js']))
		.pipe($.concat('app.js'))
		.pipe($.util.env.release ? $.uglify() : $.util.noop())
		.pipe(gulp.dest('dist/public/scripts'));
}

gulp.task('scripts-bundle', ['templates'], bundle);

gulp.task('scripts', ['scripts-bundle'], function() {
	if ($.util.env.dev) {
		chokidar.watch(config.scripts.globals, { ignoreInitial: true })
			.on('all', function() {
				rebundle().once('end', function() {
					server.restart();
				});
			});

		function onAddOrUnlink() {
			bundler.close();
			bundler = null;

			bundle().once('end', function() {
				server.restart();
			});
		}

		chokidar.watch('./App/View/*/*.js', { ignoreInitial: true })
			.on('add', onAddOrUnlink)
			.on('unlink', onAddOrUnlink);
	}
});
