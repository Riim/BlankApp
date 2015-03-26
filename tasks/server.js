
var childProcess = require('child_process');
var spawn = childProcess.spawn;
var server = null;

function restartServer(cb) {
	kill(function() {
		server = spawn('node', ['./App/serverApp/serverApp'], { stdio: 'inherit' });

		if (cb) {
			cb();
		}
	});
}

exports.restart = restartServer;

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

exports.kill = kill;
