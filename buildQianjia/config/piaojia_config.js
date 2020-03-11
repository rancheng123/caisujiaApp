/*path start*/
var path = require('path');
var current_path = path.resolve(__dirname);
var src_path = path.resolve(current_path, '../../frontEnd/piaojia/src');
var dist_path = path.resolve(current_path, '../../frontEnd/piaojia/dist');
/*path end*/

module.exports = {
    src_path,
    dist_path,
    port: 8488
}