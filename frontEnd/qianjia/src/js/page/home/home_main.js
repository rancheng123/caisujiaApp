const { app, BrowserWindow ,ipcMain} = require('electron')
//调试工具的开关
ipcMain.on('test-sign', (event, status) => {
    debugger

    console.log(123456)

})

var b = 2;
global.b = b;
global.ipcMain = ipcMain;

//ipcMain.send('error-msg','111')

function aa(){
    console.log(1 + b)
}
aa();


module.exports = {
    bb: ()=>{
        console.log('bbbb')
    }
}