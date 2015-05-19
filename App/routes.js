var routes = [
	'/todos',
	'/todo/{todoId}(?todoEdit /edit)',
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

module.exports = routes;
