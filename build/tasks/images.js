var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var config = require('../config');

gulp.task('images-svg-sprite', function() {
	return gulp.src(config.images.svg)
		.pipe($.svgSprite({
			mode: {
				css: {
					dest: '',
					sprite: 'svgSprite.css.svg',

					render: {
						css: {
							template: 'build/svgSprite.css.mustache',
							dest: 'svgSprite.css'
						}
					}
				}
			}
		}))
		.pipe(gulp.dest(config.dist + '/public/css'));
});

gulp.task('images', ['images-svg-sprite']);
