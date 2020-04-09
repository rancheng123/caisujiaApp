
var path = require('path');
var mToolPath = path.resolve(__dirname,'..');
var packageJson = require( mToolPath +'/package.json');




module.exports = {
    mToolPath: mToolPath,
    dir: mToolPath + '/',
    out: mToolPath + '/'+ 'dev' +'-release',
    zoomPath: mToolPath + '/zoom-sdk-electron',
    appName: packageJson.name,
    icon: mToolPath + "/icon.ico",
    electronPath: mToolPath + '/node_modules/electron/dist/Electron.app',
    //"linux" | "win32" | "darwin" | "mas"
    win32: {
        asar: true,
        arch: 'ia32'
    },
    darwin: {
        asar: false,
        arch: 'x64'  //"ia32" | "x64" | "armv7l" | "arm64" | "mips64el"
    }
}
