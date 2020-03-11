
var gulp = require('gulp');
var qianjia_config = require('./config/qianjia_config');
var staticSource = qianjia_config.src_path+'/h5Static/**/*.*';



if(process.argv[2] == "--watch"){
    gulp.watch(staticSource, function(){
        compileStaticSource();
    });
}

compileStaticSource();
//编译静态资源
function compileStaticSource(){
    console.log("compile staticSource  start")
    gulp.src(staticSource)
        .pipe(gulp.dest(qianjia_config.dist_path+'/h5Static/'));
    console.log("compile staticSource  end")


    var weixin = qianjia_config.src_path+'/MP_verify_3r048Gsj7qpqa85z.txt';
    gulp.src(weixin)
        .pipe(gulp.dest(qianjia_config.dist_path+'/'));
}





