var glob = require('glob');
var chokidar = require('chokidar');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var config = require('../config');
var helpers = require('../helpers');

function bundle() {
	return gulp.src([].concat(
		config.scripts.externalModules
			.filter(function(module) { return module.template; })
			.map(function(module) { return module.template; }),
		glob.sync('App/View/*/*.rtt').filter(helpers.isRootFile)
	))
		.pipe($.plumber(helpers.plumberErrorHandler))
		.pipe($.cached('scripts-bundle-templates'))
		.pipe($.trim())
		.pipe($.htmlBindify({
			attrBindName: 'rt-bind',
			skipAttributes: ['rt-d'],
			outputDelimiters: ['{{,\'\'+_.', '}}']
		}))
		.pipe($.riftTemplate({ namespace: 'exports' }))
		.pipe($.remember('scripts-bundle-templates'))
		.pipe($.concat('templates.js'))
		.pipe(gulp.dest('dist/private'));
}

gulp.task('templates-bundle', bundle);

gulp.task('templates', ['templates-bundle'], function() {
	if ($.util.env.dev) {
		chokidar.watch(['bower_components/rift-*/**/*.rtt', 'App/View/**/*.rtt'], { ignoreInitial: true })
			.on('all', function() {
				bundle();
			});
	}
});
