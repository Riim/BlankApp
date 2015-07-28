var EventEmitter = require('events').EventEmitter;
var spawn = require('child_process').spawn;

var server;
var restarting;

function start(cb) {
	if (!server) {
		server = spawn('node', ['App/serverApp'], { stdio: 'inherit' });
	}

	if (cb) {
		cb();
	}
}

function kill(cb) {
	function closed() {
		server = null;

		if (cb) {
			cb();
		}
	}

	if (server) {
		server.once('close', closed);
		server.kill();
	} else {
		closed();
	}
}

function restart(cb) {
	if (restarting) {
		if (cb) {
			restarting.on('done', cb);
		}

		return;
	}

	restarting = new EventEmitter();

	kill(function() {
		start(function() {
			restarting.emit('done');
			restarting = null;

			if (cb) {
				cb();
			}
		});
	});
}

exports.start = start;
exports.kill = kill;
exports.restart = restart;
