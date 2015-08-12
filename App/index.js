import rt from 'riftjs';

import Model from './Model';
import View from './View';

let nodes = [
	{
		name: 'root',
		path: '/'
	},
	{
		name: 'notFound',
		path: '/404'
	},
	{
		path: '/*',
		callback: function(path) {
			console.log('Not found path: "' + path + '"');
			this.router.route('/404', false);
		}
	}
];

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
