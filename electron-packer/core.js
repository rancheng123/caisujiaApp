
// 文档 ！！！！！！！！！！！！
//https://electron.github.io/electron-packager/master/modules/electronpackager.html

//需要看的
// https://www.jianshu.com/p/a71477ee08ae  !!!!!!!!!!!!!


/*

问题： 打包node_modules 太慢
解决： 用 npm  不用cnpm

原因：说到npm与cnpm的区别，可能大家都知道，但大家容易忽视的一点，是cnpm装的各种node_module，这种方式下所有的包都是扁平化的安装。一下子node_modules展开后有非常多的文件。导致了在打包的过程中非常慢。但是如果改用npm来安装node_modules的话，所有的包都是树状结构的，层级变深。
*/





var packageJson = require('../package.json');
var appEnv = 'dev';
var appVersion = packageJson.version;
var appName = packageJson.name;


var child_process = require('child_process');
var fs = require('fs');
var utils = require('./utils');
var config = require('./config')
var packager = require('electron-packager');
var { serialHooks } = require('electron-packager/hooks')
var sign = require('electron-osx-sign');



var nodeUtil = require('./nodeUtil');

var queueCase = require('./queue')
var platforms = ['darwin'];

class ElectronBuilder {
    constructor(){

    }

    sign(opts,callback){

        var appPath = '/Users/mxj/zoom/caisujiaApp/dev-release/darwin/caisujiaApp-darwin-x64/caisujiaApp.app';

        if(1){
            var sign = require('electron-osx-sign')
            sign({
                app: appPath
            }, function done (err) {
                debugger
                if (err) {
                    console.log(err)
                    // Handle the error
                    return;
                }
                // Application signed

                console.log('签名 成功')

            })
        }else{



            console.log('签名开始')
            //C87E21D1492CFCCCB0780A2368CAC30E1AA0B84B
            var identityHash = 'C87E21D1492CFCCCB0780A2368CAC30E1AA0B84B'

            child_process.exec(
                'codesign ' +

                // identity
                '--sign '+ identityHash +' ' +
                '--force ' +
                //'--options runtime ' +

                //解决报错 code object is not signed at all
                '--deep ' +

                //解决报错  /Users/kri/EC_Collection_Premiere_AW20_v1_0_0.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework Reason: no suitable image found. Did find: /Users/kri/EC_Collection_Premiere_AW20_v1_0_0.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libffmpeg.dylib: code signature in (/Users/kri/EC_Collection_Premiere_AW20_v1_0_0.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libffmpeg.dylib) not valid for use in process using Library Validation: mapped file has no cdhash, completely unsigned? Code has to be at least ad-hoc signed.
                '--entitlements '+ config.mToolPath +'/electron-packer/entitlements.mac.plist ' +
                appPath,
                {
                    encoding: 'utf-8'
                },
                (error, stdout, stderr)=>{

                    debugger
                    if (error) {
                        // Handle the error
                        console.log('签名失败  ' + error)
                    }else{
                        console.log(stderr)
                        callback && callback()
                    }

                }
            )
        }





    }

    pack(callback){



        var that = this;

        //删除 打包的目录
        nodeUtil.rmDir(config.out)
        console.log(' 删除   ' + config.out)

        //utils.execSync('rm -rf ' + config.out)

        return queueCase.init({
            data: platforms,
            key: (item)=>{
                return item
            },
            taskFn: (key,resolve, reject)=>{
                global.platform = key;
                var plactformOut = config.out +'/' + global.platform
                nodeUtil.rmDir(plactformOut)


                packager({
                    asar: config[global.platform].asar,
                    dir: config.dir,
                    electronVersion: '5.0.6',
                    out: plactformOut,
                    name: appName,
                    appVersion: appVersion,
                    platform: global.platform,
                    arch: config[global.platform].arch,
                    overwrite: true,
                    icon: config.icon,
                    //Walks the node_modules dependency tree to remove all of the packages specified in the devDependencies section of package.json from the outputted Electron app.
                    prune: true,
                    ignore: (path)=>{

                        if(path == ""){

                        }else{
                            //要的
                            if(
                                path.match('/frontEnd')   ||
                                path.match('/node_modules')  ||
                                path.match('/package.json') ||
                                path.match('/main.js') ||
                                path.match('/update.js')
                            ){
                                console.log(path)
                            }
                            //不要的
                            else{
                                return true;
                            }
                        }
                    },





                    "deref-symlinks":true,
                    "derefSymlinks":true,
                    "download":{
                        "rejectUnauthorized":true,
                        "reject-unauthorized":true
                    },
                    "junk":true,
                    "protocols":[],
                    afterCopy: [serialHooks([
                        // (buildPath, electronVersion, platform, arch) => {
                        //
                        //     return new Promise((resolve, reject) => {
                        //         setTimeout(() => {
                        //             console.log('first function')
                        //             resolve()
                        //         }, 1000)
                        //     })
                        // },
                        (buildPath, electronVersion, platform, arch) => {
                            //debugger;
                            console.log('copy function')
                        }
                    ])],
                    afterExtract: [serialHooks([
                        (buildPath, electronVersion, platform, arch) => {
                            //debugger;
                            console.log('afterExtract')
                        }
                    ])],
                    afterPrune:[serialHooks([
                        (buildPath, electronVersion, platform, arch) => {

                            console.log('afterPrune')


                            // that.copyZoom({
                            //     innerAppPath: buildPath
                            // },()=>{
                            //     console.log('拷贝zoom  成功')
                            // })



                        }
                    ])],





                    // ...
                }).then((res)=>{
                    console.log('打包完毕')

                    resolve()
                }).catch((err)=>{
                    console.log('打包失败 ' + err)


                    // Error: Could not find "wine" on your system


                    /*
                    wine
                        参考链接： https://newsn.net/say/mac-wine.html
                        作用 :
                            使mac系统 能够运行exe

                        安装：
                            //https://wiki.winehq.org/MacOS
                            1. 安装依赖

                                brew cask install xquartz
                                brew cask install wine-stable



                    */
                })
            }
        })



    }


    createZip(){
        return queueCase.init({
            data: platforms,
            key: (item)=>{
                return item
            },
            taskFn: (key,resolve, reject)=>{
                global.platform = key;

                var zip = require('electron-installer-zip');
                var appPath = config.out + '/' + global.platform + '/' + config.appName +'-'+ global.platform +'-'+ config[global.platform].arch +'/'+ config.appName +'.app'


                zip({
                    dir: appPath,
                    // out can either be a directory or a path for a ZIP file
                    out: config.out + '/' + global.platform + '/' + appName +'-'+ appVersion +'.zip',
                    // out: 'dist/App.zip',
                }, function(err, res) {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    console.log('Zip file written to: ', res);
                    resolve()
                });

            }
        })




    }

    createInstaller(callback){


        return queueCase.init({
            data: platforms,
            key: (item)=>{
                return item
            },
            taskFn: (key,resolve, reject)=>{
                global.platform = key;
                console.log('创建 installer 开始')
                // utils.execSync('rm -rf ' + fullInstallerPath)


                if(global.platform == 'darwin'){

                    var appPath = config.out + '/' + global.platform + '/' + config.appName +'-'+ global.platform +'-'+ config[global.platform].arch +'/'+ config.appName +'.app'


                    var out     = appPath.replace(/[\w\-\d]{0,20}\.app/,'')
                    var installerName = appPath.match(/\/[\w\-\d]{1,20}\.app/)[0].replace('.app','').replace('/','')



                    createDMG({
                        appPath: appPath,
                        name: appName + '-' + appVersion ,
                        title: 'myDreamPlus',
                        background: '',
                        icon: '',
                        overwrite: true,
                        //debug: true,
                        out: config.out + '/' + global.platform + '/',
                        contents: function (opts) {
                            return [

                                { x: 448, y: 344, type: 'link',
                                    //链接放在 目录下
                                    path: '/Applications'
                                },
                                { x: 192, y: 344, type: 'file', path: appPath}
                            ];
                        }
                    }).then((optsInfo)=>{

                        console.log('创建 installer 完成')


                        resolve()

                    })
                }else{
                    debugger



                    const installer = require('electron-installer-windows')
                    console.log('Creating package (this may take a while)')


                    var startTime = Date.now()

                    var installerDest = config.out + '/' +global.platform + '/'

                    // 生成installer 时间过长， 解决办法 electron-packager  asar 设为false
                    installer({
                        src: config.out+ '/'+ global.platform + '/' + config.appName +'-'+ global.platform +'-'+ config[global.platform].arch +'/',
                        dest: installerDest,
                        name: appName,
                        version: appVersion,
                        arch: config[global.platform].arch,
                        "icon": config.icon,
                        "tags": [
                            "Utility"
                        ],
                    }).then((res)=>{
                        debugger



                        console.log(`Successfully created package at ${res.exe}`)
                        var endTime = Date.now()
                        console.log('花费时间： ' + (endTime - startTime))


                        resolve()

                    })



                }
            }
        })






    }

    copyZoom(opts,callback){



        var shell = true;
        if(shell){
            utils.execSync('rm -rf '+ opts.innerAppPath +'/zoom-sdk-electron')
            utils.execSync(
                'mkdir '+ opts.innerAppPath +'/zoom-sdk-electron &&' +
                'mkdir '+ opts.innerAppPath +'/../sdk'
            )

            if(global.platform == 'darwin'){
                var sdk = 'mac'
            }else{
                var sdk = 'win32'
            }


            var cmd =
                'yes|cp -R  -H '+ config.zoomPath +'/demo                 '+ opts.innerAppPath +'/zoom-sdk-electron/ &&' +
                'yes|cp -R  -H '+ config.zoomPath +'/lib                  '+ opts.innerAppPath +'/../' +
                '&&yes|cp -R  -H '+ config.zoomPath +'/sdk/'+ sdk +'              '+ opts.innerAppPath +'/../sdk/'

        }else{
            nodeUtil.rmDir(opts.innerAppPath +'/zoom-sdk-electron');
            fs.mkdirSync(opts.innerAppPath +'/zoom-sdk-electron')
            fs.mkdirSync(opts.innerAppPath +'/zoom-sdk-electron/sdk')

            nodeUtil.copyDir(
                config.zoomPath +'/demo',
                opts.innerAppPath +'/zoom-sdk-electron/demo'
            )
            nodeUtil.copyDir(
                config.zoomPath +'/lib',
                opts.innerAppPath +'/zoom-sdk-electron/lib'
            )
        }










        if(global.platform == 'darwin'){
            var appPath = opts.innerAppPath.replace('/Contents/Resources/app','')

            if(shell){
                cmd = cmd +


                '&& yes|cp -R  -H '+ config.zoomPath +'/sdk/mac/Plugins      '+ appPath +'/Contents/ &&' +
                'yes|cp -R  -H '+ config.zoomPath +'/sdk/mac/Resources    '+ appPath +'/Contents/&&' +
                'yes|cp -R  -H '+ config.zoomPath +'/sdk/mac/ZoomSDK/*    '+ appPath +'/Contents/Frameworks'

            }else{
                nodeUtil.copyDir(
                    config.zoomPath +'/sdk/mac',
                    opts.innerAppPath +'/zoom-sdk-electron/sdk/mac'
                )
                nodeUtil.copyDir(
                    config.zoomPath +'/sdk/mac/Plugins',
                    appPath +'/Contents/Plugins'
                )

                nodeUtil.copyDir(
                    config.zoomPath +'/sdk/mac/Resources/',
                    appPath +'/Contents/Resources'
                )

                nodeUtil.copyDir(
                    config.zoomPath +'/sdk/mac/ZoomSDK/',
                    appPath +'/Contents/Frameworks'
                )
            }




        }else{



            // cmd = cmd +
            //
            //     '&&yes|cp -R  -H '+ config.zoomPath +'/sdk/win32              '+ opts.innerAppPath +'/../sdk/'

            //     //测试 start
            //     '&& mkdir ' + opts.innerAppPath +'/zoom-sdk-electron/sdk/win64' +
            //     '&& yes|cp -R  -H  ' + opts.innerAppPath +'/zoom-sdk-electron/sdk/win32/ ' + opts.innerAppPath +'/zoom-sdk-electron/sdk/win64'
            //
            // //测试 end



            // cmd = cmd +
            //
            //     'yes|cp -R  -H '+ config.zoomPath +'/            '+ opts.innerAppPath +'/zoom-sdk-electron/'


            //测试 end
        }


        if(shell){
            utils.execSync( cmd )
        }



        // utils.execSync(
        //     'yes|cp -R  -H '+ config.zoomPath +'/lib                  '+ appPath +'/Contents/Resources/ &&' +
        //
        //     'rm -rf '+ config.zoomPath +'/sdk/win32 &&' +
        //     'rm -rf '+ config.zoomPath +'/sdk/win64 &&' +
        //
        //     'yes|cp -R  -H '+ config.zoomPath +'/sdk                  '+ appPath +'/Contents/Resources/ &&' +
        //     'yes|cp -R  -H '+ config.zoomPath +'/sdk/mac/Plugins      '+ appPath +'/Contents/ &&' +
        //     'yes|cp -R  -H '+ config.zoomPath +'/sdk/mac/Resources    '+ appPath +'/Contents/&&' +
        //     'yes|cp -R  -H '+ config.zoomPath +'/sdk/mac/ZoomSDK/*    '+ appPath +'/Contents/Frameworks'
        // )

        console.log('  拷贝zoom  成功  ')

        callback && callback()
    }



    publish(){
        /*

         亚马逊账号
            Aws 只读账号
            url：http://console.amazonaws.cn
            账户：889511930858
            用户名：mxjreadonly
            密码：5WouEchvta



                //mTool 存放的地方
                https://console.amazonaws.cn/s3/buckets/mtool/?region=cn-northwest-1&tab=overview

        */

        return queueCase.init({
            data: platforms,
            key: (item)=>{
                return item
            },
            taskFn: (key,resolve, reject)=>{
                global.platform = key;


                if(global.platform == 'darwin'){

                    if(0){
                        var installerPath = config.out + '/'+ global.platform +'/'+ appName +'-'+ appVersion +'.dmg'
                        var Key = appEnv + '-releases/mac/' + installerPath.match(/\/[\w\-\d\.]{0,100}.dmg/)[0].replace('/','')

                    }



                    //测试 start
                    if(0){
                        var installerPath = '/Users/mxj/zoom/mxj-desktop-app/dev-release/darwin/mTool-alpha-5.8.15.zip'
                        var Key = 'dev-releases/mac/mTool-alpha-5.8.15.zip'
                    }
                    //测试 end

                    //测试 start
                    if(1){
                        var installerPath = '/Users/mxj/zoom/mxj-desktop-app/electron-packer/latest-mac.yml'
                        var Key = 'dev' + '-releases/mac/' + 'latest-mac.yml'
                    }
                    //测试 end

                }else{
                    var installerPath = config.out + '/'+ global.platform +'/'+ appName.replace('-','_') +'-'+ appVersion +'-setup.exe'



                    var exeName = installerPath.match(/\/[\w\-\d\.]{0,100}.exe/)[0].replace('/','')

                    var Key = appEnv + '-releases/win/' + exeName;



                }


                var stream = fs.createReadStream(installerPath)
                var s3 = new AWS.S3({
                    apiVersion: '2006-03-01',
                    accessKeyId: "AKIAO7GIAC3NCSDPPKLA",
                    secretAccessKey: "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",
                    region: "cn-north-1",
                    endpoint: "https://s3.cn-north-1.amazonaws.com.cn",
                });


                var uploader = s3.upload({
                    Bucket: 'mtool',
                    Key: Key,
                    Body: stream,

                    //不设置 不允许下载
                    ACL: 'public-read'
                }, function(err, data) {


                    if(!err){
                        console.log('上传S3 成功  ', data);



                        resolve()
                    }else{
                        console.log('上传S3 失败  ', err);

                        console.log('上传的文件：  ', installerPath);


                    }
                });
                uploader.progress = (info)=>{
                    console.log('已加载： ' + info.loaded,   '总共： ' + info.total)
                }

            }
        })
    }

    preContext(callback){

        if(process.env.skipPrepare != 'true'){
            console.log('准备环境    开始')












            console.log('准备环境    完成')
        }else{
            console.log('skip  准备环境   ')
        }




        callback && callback()

    }


    startCommand(commands){
        var that = this;
        return queueCase.init({
            data: commands,
            key: (item)=>{
                return item
            },
            taskFn: (command,resolve, reject)=>{

                debugger


                var promise = that[command]();
                promise.then(()=>{
                    resolve();
                })
//     console.log('打包成功1')

            }
        })
    }



}



module.exports = ElectronBuilder;


