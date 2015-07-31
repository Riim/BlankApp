import texts from '../../../dist/private/texts';
import localeSettings from '../../../dist/private/localeSettings';

let hasOwn = Object.prototype.hasOwnProperty;
let slice = Array.prototype.slice;

let getPluralIndex = Function('n', 'return ' + localeSettings.plural + ';');

let helpers = {
	//
};

let reInsert = /\{(?:([$_\w]+)(?::((?:[^|]*\|)+?[^}]*))?|([$_a-zA-Z][$_\w]*)\(([$_\w]+)\))\}/;

export function getText(id, plural, view, params) {
	let text;

	if (hasOwn.call(texts, id)) {
		text = plural ? texts[id][getPluralIndex(params[0])] : texts[id];
	} else {
		text = id;
	}

	let data = Object.create(view);

	params.forEach((param, index) => {
		data[index + 1] = param;
	});

	if (plural) {
		data.n = params[0];
	}

	let processed = [];

	text = text.split(reInsert);

	for (let i = 0, l = text.length; i < l;) {
		if (i % 5) {
			if (text[i]) {
				if (text[i + 1]) {
					processed.push(text[i + 1].split('|')[getPluralIndex(data[text[i]])]);
				} else {
					processed.push(data[text[i]]);
				}
			} else {
				processed.push(helpers[text[i + 2]](text[i + 3]));
			}

			i += 4;
		} else {
			processed.push(text[i]);
			i++;
		}
	}

	return processed.join('');
}

export function t(id) {
	return getText(id, false, this, slice.call(arguments, 1));
}

export function nt(id, count) {
	return getText(id, true, this, slice.call(arguments, 1));
}
