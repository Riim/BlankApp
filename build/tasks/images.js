var path = require('path');
var fs = require('fs');

var svgSpriter = require('svg-spriter');
var gulp = require('gulp');

var config = require('../config');

gulp.task('images-svg-sprite', function(done) {
	svgSpriter({
		input: {
			svg: config.images.svg,
			template: 'build/svgSprite.css.mustache'
		},

		output: {
			sprite: config.dist + '/public/css/svgSprite.css-{salt}.svg',
			css: config.dist + '/public/css/svgSprite.css'
		}
	}, done);
});

gulp.task('images', ['images-svg-sprite']);
