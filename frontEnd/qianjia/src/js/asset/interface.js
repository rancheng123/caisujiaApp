import Alert from '../module/alert/alert';
import { Modal } from 'antd-mobile';

let tempClickTimer = null;
class Interface{
    constructor(){
    };

    //获取公告列表和 banner列表（轮播图）
    getAd(){
        var that = this;
        Utils.requestData({
            url: config.api +"qj/front/v1/ad/getHeadList",
            method: 'post',
            data: {
                //?????????????
                "adId": 43,
                //?????????????
                "adCity": 0
            },
            callback: function(data){

                if(data.resultCode == 0){

                    if(data.data.imageList && data.data.imageList.length){
                        componentStore.update(that,{
                            imageList: data.data.imageList
                        })
                    }
                    if(data.data.adList && data.data.adList.length){
                        componentStore.update(that,{
                            adList: data.data.adList
                        })
                    }

                }
            }
        });
    }

    // isPayAndWithdrawStatus(opt){ //判断是否开户和绑定银行卡\
    //     let bindBankStr = opt.bindBankStr || "";
    //     let callback = opt.callback || "";
    //     let onlyOneClickCallback = opt.onlyOneClickCallback || ""
    //     let that = this;

    //     console.log("isPayAndWithdrawStatus");

    //     Utils.requestData({ //请求用户信息
    //         url: config.api + 'qj/front/v1/user/getUserInfo',
    //         method: 'post',
    //         data:{

    //         },
    //         callback: function(data){
                
    //             if(data.resultCode==0){
    //                 var data = data.data;

    //                 if(data.isHfAccount==0){ //未开户
    //                     if(data.isTrueMan==0){  //不是连连老用户
    //                         Alert({
    //                             type:'standard',
    //                             title:'开通银行存管账户',
    //                             desc:'钱夹平台资金由陕坝农商银行全程存管，保护您的财产安全',
    //                             button:[
    //                                 {
    //                                     text:'下次再说',
    //                                     handle:()=>{

    //                                     }
    //                                 },
    //                                 {
    //                                     text:'立即开通',
    //                                     handle:()=>{
    //                                         Utils.switchRoute('/openBank');
    //                                     }
    //                                 }
    //                             ]

    //                         });
    //                     }else if(data.isTrueMan==1){ //是连连老用户
    //                         Alert({
    //                             type:'standard',
    //                             title:'开通银行存管账户',
    //                             desc:'钱夹平台现升级由陕坝农商银行全程存管，你需要重新确认账户信息',
    //                             button:[
    //                                 {
    //                                     text:'下次再说',
    //                                     handle:()=>{

    //                                     }
    //                                 },
    //                                 {
    //                                     text:'立即开通',
    //                                     handle:()=>{
    //                                         Utils.switchRoute('/openBank?isTrueMan=1');
    //                                     }
    //                                 }
    //                             ]

    //                         });
    //                     }
    //                 }else if(data.isHfAccount==1){ //已开户
    //                     if(data.isTrueMan==0){  //不是连连老用户
    //                         if(data.isBindCard==0){ //未绑定银行卡
    //                             Alert({
    //                                 type:'standard',
    //                                 title:'绑定银行卡',
    //                                 desc:bindBankStr+'请先绑定银行卡',
    //                                 button:[
    //                                     {
    //                                         text:'下次再说',
    //                                         handle:()=>{

    //                                         }
    //                                     },
    //                                     {
    //                                         text:'立即绑定',
    //                                         handle:()=>{
    //                                             Utils.switchRoute('/bankBingding');
    //                                         }
    //                                     }
    //                                 ]

    //                             });
    //                         }else if(data.isBindCard==1){ //已绑定银行卡
    //                             callback && callback();
    //                         }
    //                     }else if(data.isTrueMan==1){ //是连连老用户
    //                         if(data.isBindCard==0){ //未绑定银行卡
    //                             Alert({
    //                                 type:'standard',
    //                                 title:'绑定银行卡',
    //                                 desc:'全面保障资金安全，钱夹已接入银行存管系统，请重新绑定您的银行卡信息',
    //                                 button:[
    //                                     {
    //                                         text:'下次再说',
    //                                         handle:()=>{

    //                                         }
    //                                     },
    //                                     {
    //                                         text:'立即绑定',
    //                                         handle:()=>{
    //                                             Utils.switchRoute('/bankBingding?isTrueMan=1');
    //                                         }
    //                                     }
    //                                 ]

    //                             });
    //                         }else if(data.isBindCard==1){ //已绑定银行卡
    //                             callback && callback();
    //                         }
    //                     }
    //                 }

    //             }

    //             clearTimeout(tempClickTimer);
    //             tempClickTimer = setTimeout(function(){
    //                 onlyOneClickCallback && onlyOneClickCallback()
    //             },300)

    //         },
    //         errorAlert : function(data){

    //             if(data.resultCode!=0){
    //                 if(data.resultCode==20001){   //用户没有登录
    //                     Utils.switchRoute("/login");
    //                 }else{
    //                     Modal.alert('提示',data.resultMsg, [
    //                         { text: '确定',onPress:()=>{console.log('其它错误码！！');;}}
    //                     ])
    //                 }
    //             }

    //             clearTimeout(tempClickTimer);
    //             tempClickTimer = setTimeout(function(){
    //                 onlyOneClickCallback && onlyOneClickCallback()
    //             },300)

    //             this.errorAlert.jail = true;
    //         }
    //     });
    // }

    isPayAndWithdrawStatus(opt){
        let bindBankStr = opt.bindBankStr || "";
        let callback = opt.callback || "";
        let onlyOneClickCallback = opt.onlyOneClickCallback || ""
        let that = this;

        console.log("isPayAndWithdrawStatus");

        Utils.requestData({
            url: config.api + 'qj/front/v1/user/getUserInfo',   //此处到时候要换接口，判断是否认证
            method: 'post',
            data:{

            },
            callback: function(data){
                
                if(data.resultCode==0){
                    var data = data.data;
                    if(data.isTrueMan==0){      //不是连连老用户

                        Alert({
                            type:'standard',
                            title:'绑定银行卡',
                            desc:'全面保障资金安全，请绑定您的银行卡信息',
                            button:[
                                {
                                    text:'下次再说',
                                    handle:()=>{

                                    }
                                },
                                {
                                    text:'立即绑定',
                                    handle:()=>{
                                        Utils.switchRoute('/receivables');
                                    }
                                }
                            ]

                        });


                    }else if(data.isTrueMan==1){    //是连连老用户

                        callback && callback();

                    }
                    

                }

                clearTimeout(tempClickTimer);
                tempClickTimer = setTimeout(function(){
                    onlyOneClickCallback && onlyOneClickCallback()
                },300)

            },
            errorAlert : function(data){

                if(data.resultCode!=0){
                    if(data.resultCode==20001){   //用户没有登录
                        Utils.switchRoute("/login");
                    }else{
                        Modal.alert('提示',data.resultMsg, [
                            { text: '确定',onPress:()=>{console.log('其它错误码！！');;}}
                        ])
                    }
                }

                clearTimeout(tempClickTimer);
                tempClickTimer = setTimeout(function(){
                    onlyOneClickCallback && onlyOneClickCallback()
                },300)

                this.errorAlert.jail = true;
            }
        });
    }
};

window.Utils.Interface = new Interface();
