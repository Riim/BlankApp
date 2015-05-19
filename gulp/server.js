var spawn = require('child_process').spawn;

var server = null;

function startServer(cb) {
	if (server) {
		throw new TypeError('Server is alreasy started');
	}

	server = spawn('node', ['App/serverApp/serverApp'], { stdio: 'inherit' });

	if (cb) {
		cb();
	}
}

function restartServer(cb) {
	kill(function() {
		startServer(cb);
	});
}

function kill(cb) {
	if (server) {
		server.once('close', function() {
			server = null;

			if (cb) {
				cb();
			}
		});

		server.kill();
	} else {
		if (cb) {
			cb();
		}
	}
}

exports.start = startServer;
exports.restart = restartServer;
exports.kill = kill;
