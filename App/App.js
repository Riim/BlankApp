
var Rift = require('riftjs');

var Model = require('./Model/Model');
var View = require('./View/View');

var isServer = Rift.isServer;
var baseViewProto = Rift.BaseView.prototype;

Object.assign(Rift.BaseView.attrNames, {
	viewClass: 'rt-c',
	viewId: 'rt-v',
	viewParentId: 'rt-p',
	viewOptions: 'rt-o'
});

var App = module.exports = Rift.createClass(Rift.BaseApp, {
	constructor: function(opts) {
		App.$super.constructor.call(this, opts);

		var model = isServer ? new Model() : Rift.dump.deserialize(window.model);

		baseViewProto.model = model;
		baseViewProto.app = this;

		this.model = model;
		this.view = new View({ block: this.viewBlock });
	}
});
