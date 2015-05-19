var path = require('path');
var fs = require('fs');

var glob = require('glob');
var express = require('express');
var rt = require('riftjs');

var gulpConfig = require('../../gulp/config');
var gulpHelpers = require('../../gulp/helpers');

[].concat(
	gulpConfig.scripts.externalModules
		.map(function(module) { return module.js; }),
	glob.sync(path.join(__dirname, '../View/*/*.js'))
		.filter(gulpHelpers.isRootFile)
).forEach(function(file) {
	require(file);
});

var App = require('../App');

var stringify = rt.value.stringify;
var serialize = rt.dump.serialize;

var server = express();

server.use(express.static(path.join(__dirname, '../../build/public')));

var html = fs.readFileSync(__dirname + '/index.html', 'utf8');

server.get(/^(?:\/[^\/]+)*\/[^.]*$/, function(req, res) {
	var app = new App({
		path: req.path
	});

	app.view.render(function(appHTML) {
		appHTML += '<script>var _rt_modelData=' + serialize(app.model) + ',_rt_viewStateData=' +
			stringify(app.viewState.serializeData()) + ',_rt_path=' + stringify(app.router.currentPath) + ';</script>';

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
