import rt from 'riftjs';

import Model from './Model';
import View from './View';

let viewStateFields = {
	//
};

let routes = [
	'/',
	'/404',
	{
		path: '/*',
		callback: function(path) {
			console.log('Not found path: "' + path + '"');
			this.router.route('/404');
		}
	}
];

export default class App extends rt.BaseApp {
	constructor(params) {
		super();

		if (rt.isServer) {
			this._init({
				modelClass: Model,
				viewClass: View,
				viewStateFields: viewStateFields,
				routes: routes,
				path: params.path
			});
		} else {
			this._init({
				modelDataDump: window.__rt_modelDataDump__,
				viewClass: View,
				viewBlock: params.viewBlock,
				viewStateFields: viewStateFields,
				viewStateDataDump: window.__rt_viewStateDataDump__,
				routes: routes,
				path: window.__rt_path__
			});
		}
	}
}
