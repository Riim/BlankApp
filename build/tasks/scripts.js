var path = require('path');

var glob = require('glob');
var chokidar = require('chokidar');
var notifier = require('node-notifier');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var mergeStream = require('merge-stream');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var htmlBindify = require('html-bindify');
var browserifyTrim = require('browserify-trim');
var browserifyRiftTemplate = require('browserify-rift-template');

var config = require('../config');

var server = require('../server');

var bundler = null;
var error;

function bundle() {
	if (!bundler) {
		if ($.util.env.dev) {
			bundler = watchify(browserify({
				cache: {},
				packageCache: {}
			}, config.browserify));
		} else {
			bundler = browserify(null, config.browserify);
		}

		bundler
			.transform(babelify.configure(config.babelify))
			.transform(browserifyTrim(['.rtt']))
			.transform(htmlBindify.configure(['.rtt'], {
				attrBindName: 'rt-bind',
				outputDelimiters: ['{{', '}}'],
				root: '_'
			}))
			.transform(browserifyRiftTemplate);

		[].concat(
			config.externalModules
				.map(function(module) { return module.js; }),
			glob.sync(path.join(__dirname, '../../' + config.src + '/View/modules/*/index.js'))
		).forEach(function(file) {
			bundler.add(file);
		});

		bundler.add(config.scripts.entry);

		if ($.util.env.dev) {
			bundler.on('update', function() {
				bundle().once('end', function() {
					server.restart();
				});
			});
		}
	}

	return mergeStream(
		gulp.src(config.scripts.libs)
			.pipe($.concat('libs.js')),

		bundler.bundle()
			.on('error', function(err) {
				error = {
					original: err,
					timestamp: Date.now()
				};

				$.util.log($.util.colors.red(err));

				notifier.notify({
					title: err.name,
					message: err.message
				});
			})
			.on('end', function() {
				if (error && error.timestamp + 100 < Date.now()) {
					notifier.notify({
						title: 'Ok',
						message: 'Ok'
					});

					error = null;
				}
			})
			.pipe(source('app.js'))
			.pipe(buffer())
	)
		.pipe($.order(['libs.js', 'app.js']))
		.pipe($.concat(config.scripts.outputName))
		.pipe($.util.env.release ? $.uglify() : $.util.noop())
		.pipe(gulp.dest(config.dist + '/public/js'));
}

gulp.task('scripts-bundle', ['templates', 'l10n'], bundle);

function onAddUnlink() {
	bundler.close();
	bundler = null;

	bundle().once('end', function() {
		server.restart();
	});
}

gulp.task('scripts', ['scripts-bundle'], function() {
	if ($.util.env.dev) {
		chokidar.watch(config.scripts.libs, { ignoreInitial: true })
			.on('all', function() {
				bundle().once('end', function() {
					server.restart();
				});
			});

		chokidar.watch(config.src + '/View/*/index.js', { ignoreInitial: true })
			.on('add', onAddUnlink)
			.on('unlink', onAddUnlink);
	}
});
