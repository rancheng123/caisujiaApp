/*path start*/
var path = require('path');
var current_path = path.resolve(__dirname);
var src_path = path.resolve(current_path, '../../frontEnd/qianjia/src');
var dist_path = path.resolve(current_path, '../../frontEnd/qianjia/dist');
/*path end*/

module.exports = {
    src_path,
    dist_path,
    host: getIPAdress(),
    port: 8388
}


function getIPAdress(){
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces){
        var iface = interfaces[devName];
        for(var i=0;i<iface.length;i++){
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
}