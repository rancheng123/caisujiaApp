var path = require('path');
var current_path = path.resolve(__dirname);
var src_path = path.resolve(current_path, '../frontEnd/src');


var express = require('express');
var webpack = require('webpack');
var WebpackHotMiddleware = require('webpack-hot-middleware');
var WebpackDevMiddleware = require('webpack-dev-middleware');
var config = require('./webpack.config.js');
var compiler = webpack(config);
var app = express();

// 引入webpack组件
app.use(WebpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: { colors: true }
}));
app.use(WebpackHotMiddleware(compiler));

var router = express.Router();


router.get('/*', function(req, res){
    //这里必须写绝对路径
    res.sendfile( path.resolve(current_path, '../frontEnd/dist/index.html')  );
});
app.use(router);

app.listen(8388, function () {
    console.log('Listening on 8388');
});