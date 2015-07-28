var path = require('path');
var fs = require('fs');

var rt = require('riftjs');
var glob = require('glob');
var express = require('express');

var buildConfig = require('../../build/config');

require('babel/register')(buildConfig.babelify);

[].concat(
	buildConfig.externalModules
		.map(function(module) { return module.js; }),
	glob.sync(path.join(__dirname, '../View/modules/*/index.js'))
).forEach(function(file) {
	require(file);
});

var App = require('..');

var server = express();

server.use(express.static(path.join(__dirname, '../..', buildConfig.dist, 'public')));

var html = fs.readFileSync(path.join(__dirname, '/index.html'), 'utf8');

server.get(/^(?:\/[^\/]+)*\/$/, function(req, res) {
	var app = new App({
		path: req.path
	});

	app.view.render(function(appHTML) {
		appHTML += '<script>var __rt_modelDataDump__=' + rt.dump.serialize(app.model) +
			',__rt_viewStateDataDump__=' + app.viewState.serializeData() +
			',__rt_path__=' + JSON.stringify(app.router.currentPath) + ';</script>';

		res.send(html.replace('{{app}}', function() {
			return appHTML;
		}));

		app.dispose();
	});
});

var port = 8090;

server.listen(port, function() {
	console.log('Listening on port %d', port);
});
