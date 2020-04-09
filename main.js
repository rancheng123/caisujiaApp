var { app, BrowserWindow ,ipcMain , restart} = require('electron')
var electron = require('electron')


global.electron = electron;

//重新加载 electron-reload  start
// const path = require('path')
// require('electron-reload')(__dirname, {
//     electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
// });
//重新加载 electron-reload  end


var process = require('process');

console.log('----start')
console.log(process.cwd())
console.log(process)
console.log('----end')



console.log('electron-reload2233355')


require('./update')







// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win

function createWindow () {
    // 创建浏览器窗口。
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            //是否集成Node
            nodeIntegration: true,

            //是否在Web工作器中启用了Node集成
            //nodeIntegrationInWorker:false,

            devTools: true,

            //当设置为 false, 它将禁用同源策略
            webSecurity: false
        }
    })

    win.loadURL('http://192.168.1.6:8388/')

    // 这个有问题
    //win.loadURL('/Users/deo/WebstormProjects/workPlace/workDeliver/mxj-desktop-app-dir/mxj-desktop-appUpdate/dist/main.html')



    win.webContents.openDevTools()
    // 加载index.html文件
    //win.loadFile('/Users/deo/WebstormProjects/workPlace/electronStudy3/Qianjia/frontEnd/qianjia/dist/index.html')

    //调试工具的开关
    ipcMain.on('switchDevToolsStatus', (event, status) => {

        console.log(1234)


        if(status){
            // 打开开发者工具
            win.webContents.openDevTools()
        }else{
            win.webContents.closeDevTools()
        }
    })

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        win = null
    })










}



app.commandLine.appendSwitch('remote-debugging-port', '8390')
//app.commandLine.appendSwitch('host-rules', 'MAP * 127.0.0.1')



// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (win === null) {
        createWindow()
    }
})

// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。

console.log(123)