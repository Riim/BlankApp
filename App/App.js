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

		if (isServer) {
			this._init(Model, View, null, viewState, null, routes, params.path);
		} else {
			this._init(
				window._rt_modelData,
				View,
				params.viewBlock,
				viewState,
				window._rt_viewStateData,
				routes,
				window._rt_path
			);
		}
	}
});

module.exports = App;
