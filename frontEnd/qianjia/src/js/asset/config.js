
var onlineConfig = {
    origin: 'https://a.qianjialicai.com',

    api: 'https://a.qianjialicai.com/',
    img: 'https://a.qianjialicai.com',
    kaifa_bghongbao : 'http://img.bigfanxian.com/'
};
var devConfig = {
    api: 'http://192.168.0.44:8084/',
    img: 'http://192.168.0.44:8084',
    kaifa_bghongbao : 'http://192.168.0.44:8080/'

    /*//外网访问
    api: 'http://103.38.224.178:45389/',
    img: 'http://103.38.224.178:45389',
    kaifa_bghongbao : 'http://103.38.224.178:45391/'*/
}


var config = {
    debug: {
        event: /event=true/,
        trace: /trace=true/,
        mobile: /mobile=true/,
        interface: /interface=true/
    },

    //接口地址
    api:  location.origin == onlineConfig.origin ? onlineConfig.api: devConfig.api ,
    //图片地址
    img : location.origin == onlineConfig.origin ? onlineConfig.img: devConfig.img,
    //哔咯红包图片
    kaifa_bghongbao : location.origin == onlineConfig.origin ? onlineConfig.kaifa_bghongbao: devConfig.kaifa_bghongbao

};
window.config = config;
window.isInterface = location.href.match(config.debug.interface);


/*
    jinkens svn 配置

    主干
        https://192.168.0.70/svn/前端设计/Qianjia@HEAD

    连连分支
        https://192.168.0.70/svn/前端设计/Qianjia_branch_lianlian_20171030@HEAD

*/
