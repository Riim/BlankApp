import rt from 'riftjs';

import Model from './Model';
import View from './View';

import nodes from './nodes';

export default class App extends rt.BaseApp {
	constructor(params) {
		super();

		if (rt.env.isServer) {
			this._init({
				modelClass: Model,
				viewClass: View,
				nodes: nodes,
				path: params.path
			});
		} else {
			this._init({
				modelClass: Model,
				viewClass: View,
				viewBlock: params.viewBlock,
				nodes: nodes,
				path: window.__rt_path__
			});
		}
	}
}
