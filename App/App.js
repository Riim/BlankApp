
var Rift = require('riftjs');

var Model = require('./Model/Model');
var View = require('./View/View');
var viewState = require('./viewState');
var routes = require('./routes');

var isServer = Rift.isServer;
var BaseApp = Rift.BaseApp;

var App = BaseApp.extend({
	constructor: function(opts) {
		BaseApp.call(this);

		this._init(
			isServer ? Model : window._modelData,
			View,
			isServer ? null : opts.viewBlock,
			viewState,
			routes,
			opts.path
		);
	}
});

module.exports = App;
