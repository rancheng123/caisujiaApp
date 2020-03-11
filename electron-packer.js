
// 文档 ！！！！！！！！！！！！
//https://electron.github.io/electron-packager/master/modules/electronpackager.html

//需要看的
// https://www.jianshu.com/p/a71477ee08ae  !!!!!!!!!!!!!


/*

问题： 打包node_modules 太慢
解决： 用 npm  不用cnpm

原因：说到npm与cnpm的区别，可能大家都知道，但大家容易忽视的一点，是cnpm装的各种node_module，这种方式下所有的包都是扁平化的安装。一下子node_modules展开后有非常多的文件。导致了在打包的过程中非常慢。但是如果改用npm来安装node_modules的话，所有的包都是树状结构的，层级变深。
*/




var child_process = require('child_process');
var fs = require('fs');
var packager = require('electron-packager');

var electronInstaller = require('electron-winstaller');



packager({
    // ...
    afterCopy: ()=>{

    },

    //扩展资源没有加速
    //extraResource: '',
    asar: false,
    dir: config.dir,
    electronVersion: '5.0.6',
    out: config.out,
    name: 'test',
    platform: 'win32',  //"linux" | "win32" | "darwin" | "mas"
    arch: "ia32",  //"ia32" | "x64" | "armv7l" | "arm64" | "mips64el"
    overwrite: true,
    icon: config.icon,
    //Walks the node_modules dependency tree to remove all of the packages specified in the devDependencies section of package.json from the outputted Electron app.
    prune: true,
    ignore: (path)=>{

        if(path == ""){

        }else{
            //要的
            if(
                path.match('/build')   ||
                path.match('/config')  ||
                path.match('/dist')  ||
                path.match('/static')  ||
                path.match('/node_modules')  ||
                path.match('/electron-builder-dev.json')  ||
                path.match('/package.json')




            ){
                console.log(path)
            }
            //不要的
            else{
                return true;
            }
        }
    }
    // ...
}).then((res)=>{
    console.log('打包完毕')
    var appPath = config.out +'/'+ config.appName +'-'+ config.platform +'-'+ config.arch +'/'+ config.appName +'.app';





    if(0){
        //打包太慢
        electronInstaller.createWindowsInstaller({
            appDirectory: opts.appPath,
            outputDirectory: out,
            authors: 'My App Inc.',
            exe: installerName + '.exe'
        }).then((res)=>{
            debugger
        }).catch((err)=>{
            debugger
            console.log(err)
        })
    }else{
        const installer = require('electron-installer-windows')

        const options = {
            src: opts.appPath,
            dest: 'dist/installers/'
        }

        async function main (options) {
            console.log('Creating package (this may take a while)')
            try {
                await installer(options)
                console.log(`Successfully created package at ${options.dest}`)
            } catch (err) {
                console.error(err, err.stack)
                process.exit(1)
            }
        }
        main(options)
    }


}).catch((err)=>{
    console.log('打包失败 ' + err)
})













