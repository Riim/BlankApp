
var path = require('path');
var fs = require('fs');

var glob = require('glob');

function findRiftModules() {
	return glob.sync(path.join(__dirname, '../bower_components/rift-*/')).reduce(function(modules, dir) {
		var config = JSON.parse(fs.readFileSync(dir + 'bower.json'));
		var name = config.main ? path.basename(config.main, '.js') : 'index';
		var js = path.join(dir, name + '.js');
		var template = path.join(dir, name + '.rtt');
		var style = path.join(dir, name + '.less');

		if (!fs.existsSync(template)) {
			template = undefined;
		}

		if (!fs.existsSync(style)) {
			style = path.join(dir, name + '.css');

			if (!fs.existsSync(style)) {
				style = undefined;
			}
		}

		modules.push({
			js: js,
			template: template,
			style: style
		});

		return modules;
	}, []);
}

var riftModules = findRiftModules();

module.exports = {
	riftModules: riftModules
};
