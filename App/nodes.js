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

export default nodes;
