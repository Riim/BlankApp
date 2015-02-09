
var Rift = require('riftjs');

var App = require('./App');

window._app = new App({
	viewBlock: document.querySelector('[' + Rift.BaseView.attrNames.viewClass + ']')
});
