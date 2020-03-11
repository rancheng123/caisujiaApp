注意点：
  1. 需要在webpack配置中加入   
        target: 'electron-renderer'

  2. 需要在Electron的内置浏览器中才能使用, 在普通浏览器中报错   require is not defined



研究成果
    远程调试Electron

    1. 用vscode

        进入
            /Users/deo/WebstormProjects/workPlace/electronStudy3/Qianjia

        执行
            ./node_modules/.bin/electron  ./main.js  --inspect=10.28.12.142:1222

    2. 用webStorm
        添加调试项目
            1. 选择 Attach to Node.js/Chrome
            2. 填写host  10.28.12.65   port 1222
            3. 打好断点

    3. 在界面中点击  调试工具，触发断点。



/*

/Users/deo/WebstormProjects/workPlace/electronStudy3/Qianjia/qa-release/mac/caisujiaApp.app/Contents/MacOS/caisujiaApp   --inspect=10.28.12.65:1222


*/