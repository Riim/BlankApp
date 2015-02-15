
var Rift = require('riftjs');

var Model = require('./Model/Model');
var View = require('./View/View');

var isServer = Rift.isServer;
var baseViewProto = Rift.BaseView.prototype;

var App = module.exports = Rift.createClass(Rift.BaseApp, {
	constructor: function(opts) {
		App.$super.constructor.call(this, opts);

		var model = isServer ? new Model() : Rift.dump.deserialize(window._modelData);

		baseViewProto.model = model;
		baseViewProto.app = this;

		this.model = model;
		this.view = new View({ block: this.viewBlock });
	}
});
