var chokidar = require('chokidar');
var notifier = require('node-notifier');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var config = require('../config');

function bundle() {
	return gulp.src([].concat(
		config.externalModules
			.filter(function(module) { return module.template; })
			.map(function(module) { return module.template; }),
		config.src + '/View/modules/*/index.rtt'
	))
		.pipe($.plumber(function(err) {
			$.util.log(err.toString(), '\n' + $.util.colors.red('--------'));

			notifier.notify({
				title: err.name,
				message: err.message
			});
		}))
		.pipe($.cached('scripts-bundle-templates'))
		.pipe($.trim())
		.pipe($.htmlBindingTransform({
			attrBindName: 'rt-bind',
			outputDelimiters: ['{{,\'\'+_.', '}}'],
			root: '_'
		}))
		.pipe($.riftTemplate({
			computeKey: function(file) {
				return file.match(/\/(\w+)\/\w+\.rtt$/)[1];
			}
		}))
		.pipe($.remember('scripts-bundle-templates'))
		.pipe($.concat('templates.js'))
		.pipe(gulp.dest(config.dist + '/private'));
}

gulp.task('templates-bundle', bundle);

gulp.task('templates', ['templates-bundle'], function() {
	if ($.util.env.dev) {
		chokidar.watch(['bower_components/rift-*/**/*.rtt', config.src + '/View/**/*.rtt'], { ignoreInitial: true })
			.on('all', bundle);
	}
});
