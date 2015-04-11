
var argv = require('yargs').argv;
var glob = require('glob');
var chokidar = require('chokidar');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var helpers = require('./helpers');
var build = require('./build');

var libs = [
	//
];

function bundle() {
	return gulp.src(libs.concat(
		build.riftModules
			.filter(function(module) { return module.style; })
			.map(function(module) { return module.style; }),
		glob.sync('./App/View/View.less'),
		glob.sync('./App/View/*/*.less').filter(helpers.isRootFile)
	))
		.pipe($.concat('app.less'))
		.pipe($.less())
		.pipe($.autoprefixer('last 2 version', '> 1%'))
		.pipe(argv.release ? $.base64({
			baseDir: './build/public/styles',
			extensions: ['svg', 'png'],
			maxImageSize: 32 * 1024
		}) : $.util.noop())
		.pipe(argv.release ? $.csso() : $.util.noop())
		.pipe(gulp.dest('./build/public/styles'));
}

gulp.task('styles-bundle', bundle);

gulp.task('styles', ['styles-bundle'], function() {
	if (argv.dev) {
		chokidar.watch(libs.concat(
			'./assets/styles/**/*.less',
			'./bower_components/rift-*/**/*.less',
			'./App/View/**/*.less'
		), { ignoreInitial: true })
			.on('all', function() {
				bundle();
			});
	}
});
