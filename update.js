var electronUpdater = require('electron-updater')

var autoUpdater = electronUpdater.autoUpdater
// 更新地址与package.json中的build.publish.url相对应
autoUpdater.setFeedURL('http://127.0.0.1:3000/newfile')
autoUpdater.on('error', (err) => {

})
autoUpdater.on('checking-for-update', (event, arg) => {

})

autoUpdater.on('update-available', (event, arg) => {

})

autoUpdater.on('update-not-available', (event, arg) => {

})

autoUpdater.on('download-progress', () => {

})

autoUpdater.on('update-downloaded', () => {

    setTimeout(m => {
        autoUpdater.quitAndInstall()
    }, 1000)
})

autoUpdater.checkForUpdates()