
var path = require('path');
var fs = require('fs');

var glob = require('flat-glob');
var express = require('express');
var rt = require('riftjs');

var App = require('../App');

var resetUIDCounter = rt.uid.resetCounter;
var toString = rt.value.toString;
var serialize = rt.dump.serialize;

glob.sync([path.join(__dirname, '../View/*/*.js')]).forEach(function(file) {
	require(file);
});

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
