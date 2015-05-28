var path = require('path');
var fs = require('fs');

var glob = require('glob');

function findExternalModules() {
	return glob.sync(path.join(__dirname, '../bower_components/rift-*/')).reduce(function(modules, dir) {
		var config = JSON.parse(fs.readFileSync(dir + 'bower.json'));
		var name = config.main ? path.basename(config.main, '.js') : 'index';
		var js = path.join(dir, name + '.js');
		var template = path.join(dir, name + '.rtt');
		var style = path.join(dir, name + '.less');

		modules.push({
			js: js,
			template: fs.existsSync(template) ? template : undefined,
			style: fs.existsSync(style) ? style : undefined
		});

		return modules;
	}, []);
}

var config = {
	scripts: {
		globals: [
			'bower_components/jquery/dist/jquery.js',
			'bower_components/jquery-mods/jquery.mods.js'
		],

		externalModules: findExternalModules()
	},

	styles: {
		globals: [
			//
		]
	},

	images: {
		//
	}
};

module.exports = config;
