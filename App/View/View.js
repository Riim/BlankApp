
var Rift = require('riftjs');
var RiftTemplate = require('rift-template-runtime');

var templates = require('../../build/private/templates');

var wrapTemplate = RiftTemplate.wrap;

Object.assign(RiftTemplate.defaults, Rift.template.defaults);

Object.keys(templates).forEach(function(name) {
	this[name] = wrapTemplate(templates[name]);
}, Rift.template.templates);

module.exports = require('./Main/Main');
