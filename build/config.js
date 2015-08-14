var path = require('path');
var fs = require('fs');

var glob = require('glob');

var src = 'App';
var dist = 'dist';

var config = {
	src: src,
	dist: dist,

	externalModules: glob.sync(path.join(__dirname, 'bower_components/rift-*/')).reduce(function(modules, dir) {
		var config = JSON.parse(fs.readFileSync(dir + 'bower.json'));

		var name = config.main ? path.basename(config.main, '.js') : 'index';

		var template = dir + name + '.rtt';
		var style = dir + name + '.less';

		modules.push({
			js: dir + name + '.js',
			template: fs.existsSync(template) ? template : undefined,
			style: fs.existsSync(style) ? style : undefined
		});

		return modules;
	}, []),

	scripts: {
		libs: [
			'bower_components/jquery/dist/jquery.js',
			'bower_components/jquery-mods/jquery.mods.js'
		],

		entry: src + '/clientApp',

		outputName: 'app.js'
	},

	styles: {
		libs: [
			//
		],

		modules: src + '/View/modules/*/index.less',

		outputName: 'app.css'
	},

	fonts: {
		libs: [
			//
		]
	},

	browserify: {
		detectGlobals: false
	},

	babelify: {
		ignore: /RiftJS/
	}
};

module.exports = config;
