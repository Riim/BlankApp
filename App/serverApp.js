
var path = require('path');
var fs = require('fs');

var glob = require('flat-glob');
var express = require('express');

var App = require('./App');

glob.sync([__dirname + '/View/*/*.js']).forEach(function(file) {
	require(file);
});

var server = express();

server.use(express.static(path.join(__dirname, '../build/public')));

var html = fs.readFileSync(__dirname + '/index.html', 'utf8');

server.get('/', function(req, res) {
	var app = new App();

	app.view.render().then(function(appHTML) {
		appHTML += '<script>var model=' + app.model.serialize() + ';</script>';

		res.send(html.replace('{{app}}', function() {
			return appHTML;
		}));
	});
});

var port = 8090;

server.listen(port, function() {
	console.log('Listening on port %d', port);
});
