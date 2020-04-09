require('./prepareContex');
var ElectronBuilder = require('./core');
var electronBuilderCase = new ElectronBuilder();



debugger
electronBuilderCase.pack(()=>{
    console.log('打包成功')
    electronBuilderCase.createInstaller(()=>{

        electronBuilderCase.publish()

    })




    //签名之后 zoom 无法使用
    // electronBuilderCase.sign({
    //     appPath: appPath
    // },()=>{
    //     console.log('签名成功')
    //
    //
    //
    //
    //
    // });

});


