
var path = require('path');
var fs = require('fs');

var glob = require('glob');
var express = require('express');
var rt = require('riftjs');

var gulpBuild = require('../../tasks/build');
var gulpHelpers = require('../../tasks/helpers');

// не ставить после `require('../App')`
[].concat(
	gulpBuild.riftModules
		.map(function(module) { return module.js; }),
	glob.sync(path.join(__dirname, '../View/*/*.js'))
		.filter(gulpHelpers.isRootFile)
)
	.forEach(function(file) {
		require(file);
	});

var App = require('../App');

var resetUIDCounter = rt.uid.resetCounter;
var toString = rt.value.toString;
var serialize = rt.dump.serialize;

var server = express();

server.use(express.static(path.join(__dirname, '../../build/public')));

var html = fs.readFileSync(__dirname + '/index.html', 'utf8');

server.get(/^(?:\/[^\/]+)*\/[^.]*$/, function(req, res) {
	resetUIDCounter();

	var app = new App({
		path: req.path
	});

	app.view.render(function(appHTML) {
		appHTML += '<script>var _modelData=' + serialize(app.model) + ',_viewStateData=' +
			toString(app.viewState.serializeData()) + ';</script>';

		res.send(html.replace('{{app}}', function() {
			return appHTML;
		}));
	});
});

var port = 8090;

server.listen(port, function() {
	console.log('Listening on port %d', port);
});
