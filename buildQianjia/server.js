var webpack = require('webpack');
var WebpackDevServer = require("webpack-dev-server");
var config = require('./webpack.config');

var server = new WebpackDevServer( webpack(config), {
    hot: true,
	//统计
    stats: { colors: true },
	//启用h5 historyApi
	historyApiFallback: true
});
server.listen(8388, "localhost", function() {
	console.log('服务器已启动')
});


