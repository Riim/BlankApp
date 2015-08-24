var path = require('path');
var fs = require('fs');

var sha1 = require('sha1');
var mustache = require('mustache');
var cheerio = require('cheerio');
var SVGO = require('svgo');
var glob = require('glob');
var mkdirp = require('mkdirp');
var gulp = require('gulp');

var config = require('../config');

gulp.task('images-svg-sprite', function(done) {
	var cwd = process.cwd();

	Promise.all(glob.sync(config.images.svg.join(',')).map(function(file, index) {
		return new Promise(function(resolve) {
			fs.readFile(path.join(cwd, file), function(err, data) {
				var svgo = new SVGO();

				svgo.optimize(data.toString(), function(res) {
					var svg = cheerio.load(res.data, { xmlMode: true })('svg');
					var viewBox = svg.attr('viewBox').split(' ');

					resolve({
						file: file,
						name: path.basename(file, '.svg'),
						svg: svg,
						position: {},
						width: +(svg.attr('width') || viewBox[2]),
						height: +(svg.attr('height') || viewBox[3])
					});
				});
			});
		});
	})).then(function(shapes) {
		var sprite = cheerio.load([
			'<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
			'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
			'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" />'
		].join(''), { xmlMode: true });
		var spriteSVG = sprite('svg');

		var width = 0;
		var height = 0;

		shapes.forEach(function(shape) {
			var posX = width;
			var posY = height;

			width += Math.ceil(shape.width);
			height += Math.ceil(shape.height);

			var svg = sprite('<svg />')
				.attr({
					id: shape.name,
					x: posX,
					y: posY,
					width: shape.width,
					height: shape.height,
					viewBox: '0 0 ' + shape.width + ' ' + shape.height
				})
				.append(shape.svg.contents());

			spriteSVG.append(svg);

			shape.position.absolute = {
				x: posX,
				y: posY,
				xy: posX + '% ' + posY + '%'
			};
		});

		spriteSVG.attr({
			width: width,
			height: height,
			viewBox: '0 0 ' + width + ' ' + height
		});

		shapes.forEach(function(shape) {
			var posX = Math.round(shape.position.absolute.x / (width - shape.width) * 100 * 1000) / 1000;
			var posY = Math.round(shape.position.absolute.y / (height - shape.height) * 100 * 1000) / 1000;

			shape.position.relative = {
				x: posX,
				y: posY,
				xy: posX + '% ' + posY + '%'
			};
		});

		var svgo = new SVGO();

		svgo.optimize(sprite.xml(), function(res) {
			var salt = sha1(res.data).slice(-5);

			mkdirp.sync(config.dist + '/public/css');

			fs.writeFileSync(
				config.dist + '/public/css/svgSprite.css-' + salt + '.svg',
				res.data,
				{ encoding: 'utf8' }
			);

			var tmpl = fs.readFileSync('build/svgSprite.css.mustache', { encoding: 'utf8' });
			var css = mustache.render(tmpl, {
				spriteFile: 'svgSprite.css-' + salt + '.svg',
				spriteWidth: width,
				spriteHeight: height,
				shapes: shapes
			});

			fs.writeFileSync(config.dist + '/public/css/svgSprite.css', css, { encoding: 'utf8' });

			done();
		});
	});
});

gulp.task('images', ['images-svg-sprite']);
