var chokidar = require('chokidar');
var postcssDefineProperty = require('postcss-define-property');
var postcssMixins = require('postcss-mixins');
var postcssSimpleVars = require('postcss-simple-vars');
var postcssNested = require('postcss-nested');
var postcssCalc = require('postcss-calc');
var postcssFunctions = require('postcss-functions');
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
			postcssDefineProperty,
			postcssMixins,
			postcssSimpleVars,
			postcssNested,
			postcssCalc,
			postcssFunctions({
				functions: {
					ceil: Math.ceil
				}
			}),
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
