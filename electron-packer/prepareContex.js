var utils = require('./utils');
var config = require('./config')
function prepareContext(){
    console.log('依赖模块下载    开始')
    utils.execSync(
        'cd ' + config.mToolPath + ' && ' +
        'rm -rf node_modules && ' +
        'npm install '
    )

    console.log('依赖模块下载    成功')

    if(process.env.isBuildNative == 'true'){
        buildNative()
    }


    console.log('编译vue  开始')
    utils.execSync(
        'cd ' + config.mToolPath + ' && ' +
        'npm run build '
    )

    console.log('编译vue  成功')
}


function buildNative(){

    console.log('编译原生模块   开始')
    var version = utils.execSync(config.mToolPath + '/node_modules/.bin/electron --version')
    version.replace('v','')
    utils.execSync(
        'cd ' + config.zoomPath + '&&  ' +
        'rm -rf ./build && ' +

        //5.0.13 会报错
        '../node_modules/.bin/node-gyp rebuild --target='+ '5.0.2' + ' --dist-url=https://npm.taobao.org/mirrors/atom-shell'
    )
    console.log('编译原生模块   成功')




    console.log('复制原生模块   开始')
    utils.execSync(
        'cd ' + config.zoomPath + '/sdk/mac/  &&  ' +
        'rm -rf  zoomsdk.node                 &&' +
        'rm -rf  zoomsdk.node.dSYM            &&' +
        'rm -rf  zoomsdk_render.node          &&' +
        'rm -rf  zoomsdk_render.node.dSYM     &&' +


        'cp -Rf '+ config.zoomPath +'/build/Release/zoomsdk.node                     '+ config.zoomPath +'/sdk/mac &&' +
        'cp -Rf '+ config.zoomPath +'/build/Release/zoomsdk.node.dSYM                '+ config.zoomPath +'/sdk/mac &&' +
        'cp -Rf '+ config.zoomPath +'/build/Release/zoomsdk_render.node              '+ config.zoomPath +'/sdk/mac &&' +
        'cp -Rf '+ config.zoomPath +'/build/Release/zoomsdk_render.node.dSYM         '+ config.zoomPath +'/sdk/mac '
    )
    console.log('复制原生模块   成功')

}

prepareContext()

