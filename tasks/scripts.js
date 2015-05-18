
var path = require('path');

var argv = require('yargs').argv;
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

var helpers = require('./helpers');
var build = require('./build');
var server = require('./server');

var libs = [
	'./bower_components/jquery/dist/jquery.js',
	'./bower_components/jquery-mods/jquery.mods.js'
];

var bundler = null;

function bundle() {
	var bndlr;

	if (argv.dev) {
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
			build.riftModules
				.map(function(module) { return module.js; }),
			glob.sync(path.join(__dirname, '../App/View/*/*.js'))
				.filter(helpers.isRootFile)
		).forEach(function(file) {
			bndlr.add(file);
		});

		bndlr.add(path.join(__dirname, '../App/clientApp/clientApp.js'));

		if (argv.dev) {
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
		gulp.src(libs)
			.pipe($.concat('scripts.js')),

		bundler.bundle()
			.on('error', helpers.browserifyErrorHandler)
			.pipe(source('app.js'))
			.pipe(buffer())
	)
		.pipe($.order(['scripts.js', 'app.js']))
		.pipe($.concat('app.js'))
		.pipe(argv.release ? $.uglify() : $.util.noop())
		.pipe(gulp.dest('./build/public/scripts'));
}

gulp.task('scripts-bundle', bundle);

gulp.task('scripts', ['scripts-bundle'], function() {
	if (argv.dev) {
		chokidar.watch(libs, { ignoreInitial: true })
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
