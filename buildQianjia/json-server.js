var url = require('url');


var jsonServer = require('json-server');

var server = jsonServer.create()



//响应数据
function responseDataByUrl(req, res){
    var relativePath = require('./config/'+ process.env.APP_ENV.trim() +'_config.js').src_path + '/js/data/';
    var filePath = req.url.replace('/api','').split('?')[0] + '.js';
    var dataJson = require( relativePath + filePath );
    res.jsonp(dataJson)
}

var router = jsonServer.router('db.json')
var middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/api/*', function (req, res) {

    //响应数据
    responseDataByUrl(req, res)
});

server.post('/api/*', function (req, res) {

    //响应数据
    responseDataByUrl(req, res)
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use(function (req, res, next) {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  // Continue to JSON Server router
  next()
})

// Use default router
server.use(router)
server.listen(3000, function () {
  console.log('JSON Server is running');
  console.log('------ 请访问localhost:3000 请求数据-------')
})

