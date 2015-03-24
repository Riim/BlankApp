
var Rift = require('riftjs');

var App = require('../App');

window._app = new App({
	path: location.pathname,
	viewBlock: document.querySelector('[rt-v]')
});
