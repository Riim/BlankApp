var path = require('path');
var fs = require('fs');

var glob = require('glob');
var chokidar = require('chokidar');
var gettextParser = require('gettext-parser');
var gettext = require('rift-gettext');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var config = require('../config');
var localeSettings = require('../localeSettings');

function mkdir(dir) {
	if (!fs.existsSync(dir)) {
		mkdir(path.resolve(dir, '..'));
		fs.mkdirSync(dir);
	}
}

function generateTexts() {
	var cwd = process.cwd();
	var dir = path.join(cwd, config.dist + '/private/texts');

	mkdir(dir);

	if (!$.util.env.lang) {
		fs.writeFileSync(path.join(dir, 'index.json'), '{}');
		return;
	}

	var sources = {};

	[].concat(
		config.externalModules
			.map(function(module) { return module.js; }),

		config.externalModules
			.filter(function(module) { return module.template; })
			.map(function(module) { return module.template; }),

		glob.sync(path.join(__dirname, '../../' + config.src + '/View/modules/*/index.js')),

		glob.sync(path.join(__dirname, '../../' + config.src + '/View/modules/*/index.rtt'))
	).forEach(function(file) {
		sources[path.relative(cwd, file)] = fs.readFileSync(file, 'utf-8');
	});

	var poFile = path.join(dir, $.util.env.lang + '.po');
	var po = gettext.generate(sources, {
		language: $.util.env.lang,
		existingPO: fs.existsSync(poFile) ? fs.readFileSync(poFile, 'utf-8') : undefined,
		fnNames: ['t', 'nt']
	});

	fs.writeFileSync(poFile, po);

	var poJSON = gettextParser.po.parse(po);
	var translations = poJSON.translations[''];

	var texts = Object.keys(translations).reduce(function(texts, id) {
		if (id) {
			var trnsl = translations[id];
			var value = trnsl.msgid_plural ? trnsl.msgstr : trnsl.msgstr[0];

			if (value) {
				texts[id] = value;
			}
		}

		return texts;
	}, {});

	fs.writeFileSync(path.join(dir, 'index.json'), JSON.stringify(texts));
}

gulp.task('l10n-texts', function(done) {
	generateTexts();
	done();
});

gulp.task('l10n-localeSettings', function(done) {
	var json = JSON.stringify(localeSettings[$.util.env.lang || 'ru']);
	fs.writeFileSync(path.join(process.cwd(), config.dist + '/private/localeSettings.json'), json);

	done();
});

gulp.task('l10n', ['l10n-texts', 'l10n-localeSettings'], function() {
	if ($.util.env.dev && $.util.env.lang) {
		chokidar.watch([].concat(
			config.src + '/View/**/*.js',
			config.src + '/View/**/*.rtt'
		), { ignoreInitial: true })
			.on('all', generateTexts);
	}
});
