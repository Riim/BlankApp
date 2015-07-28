var chokidar = require('chokidar');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var config = require('../config');

function bundle() {
	return gulp.src([].concat(
		config.styles.libs,
		config.externalModules
			.filter(function(module) { return module.style; })
			.map(function(module) { return module.style; }),
		config.src + '/View/index.less',
		config.src + '/View/modules/*/index.less'
	))
		.pipe($.concat(config.styles.outputName))
		.pipe($.less())
		.pipe($.autoprefixer('last 2 version', '> 1%'))
		.pipe($.util.env.release ? $.csso() : $.util.noop())
		.pipe(gulp.dest(config.dist + '/public/css'));
}

gulp.task('styles-bundle', bundle);

gulp.task('styles', ['styles-bundle'], function() {
	if ($.util.env.dev) {
		chokidar.watch([].concat(
			config.styles.libs,
			'bower_components/rift-*/**/*.less',
			config.src + '/View/**/*.less'
		), { ignoreInitial: true })
			.on('all', bundle);
	}
});
