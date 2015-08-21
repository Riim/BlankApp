var chokidar = require('chokidar');
var postcssNested = require('postcss-nested');
var postcssSimpleVars = require('postcss-simple-vars');
var postcssMixins = require('postcss-mixins');
var autoprefixer = require('autoprefixer');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var config = require('../config');

function bundle() {
	return gulp.src([].concat(
		config.styles.libs,
		config.externalModules
			.filter(function(module) { return module.style; })
			.map(function(module) { return module.style; }),
		config.dist + '/public/css/svgSprite.css',
		config.src + '/View/index.css',
		config.src + '/View/modules/*/index.css'
	))
		.pipe($.concat(config.styles.outputName))
		.pipe($.postcss([
			postcssNested,
			postcssSimpleVars,
			postcssMixins,
			autoprefixer({ browsers: ['last 2 version', '> 1%'] })
		]))
		.pipe($.util.env.release ? $.csso() : $.util.noop())
		.pipe(gulp.dest(config.dist + '/public/css'));
}

gulp.task('styles-bundle', ['images'], bundle);

gulp.task('styles', ['styles-bundle'], function() {
	if ($.util.env.dev) {
		chokidar.watch([].concat(
			config.styles.libs,
			'bower_components/rift-*/**/*.css',
			config.src + '/View/**/*.css'
		), { ignoreInitial: true })
			.on('all', bundle);
	}
});
