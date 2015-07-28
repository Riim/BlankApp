import rt from 'riftjs';
import RiftTemplateRuntime from 'rift-template-runtime';

import templates from '../../dist/private/templates';

import App from './modules/App';

let viewClasses = rt.viewClasses;
let wrapTemplate = RiftTemplateRuntime.wrap;

let hasOwn = Object.prototype.hasOwnProperty;

rt.object.assign(RiftTemplateRuntime.defaults, rt.template.defaults);

for (let name in templates) {
	if (name in viewClasses) {
		let proto = viewClasses[name].prototype;

		if (!hasOwn.call(proto, 'template')) {
			proto.template = wrapTemplate(templates[name]);
		}
	}
}

if (rt.isClient) {
	$.fn.mods.setPattern('_{m}_{mv}');
}

export default App;
