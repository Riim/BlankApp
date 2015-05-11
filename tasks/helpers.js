
var path = require('path');

var notifier = require('node-notifier');
var gutil = require('gulp-util');

function plumberErrorHandler(err) {
	gutil.log(err.toString(), '\n' + gutil.colors.red('--------'));
	notifier.notify({ title: err.name, message: err.message });
}

exports.plumberErrorHandler = plumberErrorHandler;

function browserifyErrorHandler(err) {
	gutil.log(
		gutil.colors.red(err.name + ':'),
		'\n' + err.toString(),
		'\n' + gutil.colors.red('--------')
	);

	notifier.notify({ title: err.name, message: err.message });
}

exports.browserifyErrorHandler = browserifyErrorHandler;

/**
 * Возвращает true, если имя директории в которой лежит файл совпадает с базовым именем файла.
 *
 * @param {string} filePath
 * @returns {boolean}
 */
function isRootFile(filePath) {
    return path.basename(path.dirname(filePath)) == path.basename(filePath, path.extname(filePath));
}

exports.isRootFile = isRootFile;
