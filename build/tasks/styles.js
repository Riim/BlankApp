var path = require('path');

var glob = require('glob');
var chokidar = require('chokidar');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var config = require('../config');
var helpers = require('../helpers');

function bundle() {
	var outputStyleDir = path.join(process.cwd(), 'dist/public/styles');

	return gulp.src(config.styles.globals.concat(
		config.scripts.externalModules
			.filter(function(module) { return module.style; })
			.map(function(module) { return module.style; }),
		glob.sync('App/View/View.less'),
		glob.sync('App/View/*/*.less').filter(helpers.isRootFile)
	))
		.pipe($.less())
		.pipe($.autoprefixer('last 2 version', '> 1%'))
		.pipe($.reworkUrls(function(url, filePath) {
			if (url.slice(0, 2) == './') {
				return path.join(path.relative(outputStyleDir, path.dirname(filePath)), url);
			}

			return url;
		}))
		.pipe($.concat('app.css'))
		.pipe($.util.env.release ? $.csso() : $.util.noop())
		.pipe(gulp.dest('dist/public/styles'));
}

gulp.task('styles-bundle', bundle);

gulp.task('styles', ['styles-bundle'], function() {
	if ($.util.env.dev) {
		chokidar.watch(config.styles.globals.concat(
			'assets/styles/**/*.less',
			'bower_components/rift-*/**/*.less',
			'App/View/**/*.less'
		), { ignoreInitial: true })
			.on('all', function() {
				bundle();
			});
	}
});
