var rt = require('riftjs');
var RiftTemplate = require('rift-template-runtime');

var templates = require('../../dist/private/templates');

var viewClasses = rt.BaseView.viewClasses;
var wrapTemplate = RiftTemplate.wrap;

var hasOwn = Object.prototype.hasOwnProperty;

Object.assign(RiftTemplate.defaults, rt.template.defaults);

for (var name in templates) {
	if (name in viewClasses) {
		var proto = viewClasses[name].prototype;

		if (!hasOwn.call(proto, 'template')) {
			proto.template = wrapTemplate(templates[name]);
		}
	}
}

module.exports = require('./AppView/AppView');
