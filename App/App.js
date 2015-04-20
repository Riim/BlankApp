
var rt = require('riftjs');

var Model = require('./Model/Model');
var View = require('./View/View');
var viewState = require('./viewState');
var routes = require('./routes');

var isServer = rt.isServer;
var BaseApp = rt.BaseApp;

var App = BaseApp.extend({
	constructor: function(params) {
		BaseApp.call(this);

		this._init(
			isServer ? Model : window._rt_modelData,
			View,
			isServer ? null : params.viewBlock,
			viewState,
			isServer ? null : window._rt_viewStateData,
			routes,
			isServer ? params.path : window._rt_path
		);
	}
});

module.exports = App;
