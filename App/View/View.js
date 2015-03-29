
var rt = require('riftjs');
var RiftTemplate = require('rift-template-runtime');

var templates = require('../../build/private/templates');

var wrapTemplate = RiftTemplate.wrap;

Object.assign(RiftTemplate.defaults, rt.template.defaults);

Object.keys(templates).forEach(function(name) {
	this[name] = wrapTemplate(templates[name]);
}, rt.template.templates);

module.exports = require('./Main/Main');
