var fs = require('fs');
class nodeUtil {
    constructor() {
    }

    //删除目录
    rmDir(path){
        var that = this;
        var files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function (file, index) {
                var curPath = path + "/" + file;

                // lstatSync  符号链接 不被识别成目录
                //  statSync  符号链接   被识别成目录
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    that.rmDir(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }




    copyDir(src,dist){

        var that = this;
        // 没有目标目录，创建目标目录
        if(!fs.existsSync(dist)){
            fs.mkdirSync(dist)
        }

        var paths = fs.readdirSync(src)
        paths.forEach(function(p) {
            var _src = src + '/' +p;
            var _dist = dist + '/' +p;
            var stat = fs.statSync(_src)
            if(stat.isFile()) {// 判断是文件还是目录
                fs.writeFileSync(_dist, fs.readFileSync(_src));
            } else if(stat.isDirectory()) {
                that.copyDir(_src, _dist)// 当是目录是，递归复制
            }
        })
    }

    exceTasksByQueue(opts){
        var that = this;

        debugger
        var res = opts.arr.pop()
        if(res){
            var promise =  new Promise(function(resolve, reject) {
                opts.taskFunction(res)
            })




            that.exceTasksByQueue(opts)
        }else{
            opts.callback()
        }
    }


};

function _copy(src, dist) {

}



var nodeUtilCase = new nodeUtil()

module.exports =  nodeUtilCase;
