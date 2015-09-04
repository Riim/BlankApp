import { defaults as templateRuntimeDefaults, wrap as wrapTemplate } from 'rift-template-runtime';
import { rt } from 'riftjs';

import templates from '../../dist/private/templates';
import { t, nt } from './l10n/getText';

import App from './modules/App';

let hasOwn = Object.prototype.hasOwnProperty;

rt.object.assign(templateRuntimeDefaults, rt.templateRuntime.defaults);

templateRuntimeDefaults.helpers.t = t;
templateRuntimeDefaults.helpers.nt = nt;

let viewClasses = rt.viewClasses;

for (let name in templates) {
	if (name in viewClasses) {
		let proto = viewClasses[name].prototype;

		if (!hasOwn.call(proto, 'template')) {
			proto.template = wrapTemplate(templates[name]);
		}
	}
}

rt.BaseView.prototype.t = t;
rt.BaseView.prototype.nt = nt;

if (rt.env.isClient) {
	$.fn.mods.setPattern('_{m}_{mv}');
}

export default App;
