/*
*
* 参数说明：
*   title :
*       标题名称 (必填)
*   action :
*       右侧功能 (选填)
*       可选值 :
*           ellipsis (省略号)
*           question (问号)
*           home (返回到主页)
*           bottomMenu (底部下拉)
    style :
        设置样式（可选）
        可选值：
            appearance 设置边框背景等外形样式
            character 设置文字大小等文字样式

        style={{
            appearance:{
                backgroundColor:'red',
                borderBottom:'none'
            },
            character:{
                color:'#fff'
            }
        }}
    onHandle : （选填）
        在返回的时候多一步逻辑操作

        onHandle :{this.aaa.bind(this)} //在返回的时候多一步逻辑操作

    backUrl ：（选填）
        自定义返回跳转页面
*
* */

import React, { Component, PropTypes } from 'react';
import BankPassword from '../../module/bankPassword/bankPassword';
import { Icon,Modal } from 'antd-mobile';

//导入样式 start
import './backbar.scss'
//导入样式 end

//省略号
class Ellipsis extends Component{
    constructor(){
        super();
    }
    componentWillMount(){

        //在此处初始化状态
        this.state = {
            display : 'none'
        }
    }
    showHandle(){
        if(this.state.display=='none'){
            componentStore.update(this,{
                display : 'block'
            })
        }else{
            componentStore.update(this,{
                display : 'none'
            })
        }
    }
    alertHandle(ev){
        ev.stopPropagation();
    }
    render(){
        //console.log(Utils.Url.parseUrl(location.href).params.orderId);
        let params = Utils.Url.parseUrl(location.href).params;

        return(
            <div className="ellipsis-wrap"  onTouchEnd={()=>{this.showHandle()}}>
                <div className="ellipsis-box">
                    <Icon type="ellipsis" />
                </div>
                <div className="ellipsis-action" style={{
                    width:document.documentElement.clientWidth+'px',
                    height:this.props.height+'px',
                    top:document.documentElement.clientHeight - this.props.height + 'px',
                    display:this.state.display
                }}>
                    <div className="ellipsis-alert" onTouchEnd={(ev)=>{this.alertHandle(ev)}}>
                        <i className="point"></i>
                        <div className="e-list">
                            <a href="javascript:;" onClick={()=>{
                                //判断用户有没有登录
                                let that = this;
                                Utils.tokenExpireJumpToLogin(function () {

                                    if(that.props.projectType==6){
                                        window.location.href="/h5Static/viewContract.html?orderId="+Utils.Url.parseUrl(location.href).params.orderId+'&token='+Utils.Storage.get('user').token+'&type='+Utils.Url.parseUrl(location.href).params.type;
                                    }else{
                                        window.location.href="/h5Static/viewContract-1.html?orderId="+Utils.Url.parseUrl(location.href).params.orderId+'&token='+Utils.Storage.get('user').token+'&type='+Utils.Url.parseUrl(location.href).params.type;
                                    }

                                })


                                }}>
                                <div className="e-icon">
                                    <i className="zhangdan"></i>
                                </div>
                                <p>查看合同</p>
                            </a>
                            <a href="javascript:;" onClick={()=>{

                                window.location.href="/h5Static/informationDisclosure.html?projectId="+Utils.Url.parseUrl(location.href).params.projectId;

                            }}>
                                <div className="e-icon">
                                    <i className="hetong"></i>
                                </div>
                                <p>信息披露</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

//解绑银行卡
class DeleteBank extends Component{
    constructor(){
        super();
    }
    componentWillMount(){
        //在此处初始化状态
        let that = this;
        this.state = {
            display : 'none',
            bankPassword:false,
            // bankName:'',
            // bankCard:''
            memberBankCardId:Utils.Url.parseUrl(location.hash).params.bankId
        }
        // Utils.requestData({
        //     url: config.api + 'qj/front/v1/account/getMyBankCard',
        //     method: 'post',
        //     data: {},
        //     callback: function(data){
        //         if(data.resultCode == 0){
        //             // console.log('预期年化收益：',data.data.costProduct.financingAnnualYield);
        //             // console.log('融资期限：',data.data.costProduct.projectPeriodMonth);
        //             // console.log('可投金额：',data.data.costProduct.projectAmount-data.data.costProduct.financingAmount);
        //             let firstCode=data.data.bankCard.substr(data.data.bankCard.length-4);
        //             let bankName=data.data.bankName
        //             componentStore.update(that,{
        //                 bankCard: firstCode,
        //                 bankName:bankName
        //             })
        //         }
        //     }

        // });
    }
    showHandle(){
        if(this.state.display=='none'){
            componentStore.update(this,{
                display : 'block'
            })
        }else{
            componentStore.update(this,{
                display : 'none'
            })
        }
    }
    alertHandle(ev){
        ev.stopPropagation();
        return false;
    }
    //解除绑定按钮展示
    clearBankbind(){
        //this.showHandle();
        console.log('测试：',Utils.Url.parseUrl(location.hash).params.bankId)
        componentStore.update(this,{
            bankPassword:true,
            display : 'none'
        })
        
        Utils.requestData({
            url: config.api + 'qj/front/v1/lianlianInvest/ajaxUser/delMemberBankCard',
            method: 'post',
            data:{
                'memberBankCardId':Utils.Url.parseUrl(location.hash).params.bankId
            },
            callback: function(data){
                if(data.resultCode==0){
                    //Utils.switchRoute('/bankDetail')
                    Modal.alert('提示',data.data, [
                        { text: '确定', onPress: () =>Utils.switchRoute('/my') , style: { fontWeight: 'bold' } },
                    ])
                }
            },
        });
    }
    //清除输入内容
    nullVal(){
        //console.log('id:',document.getElementById('textInput'));
        let input = document.getElementById('textInput');
            input.value = '';
        let inputs = input.parentNode.lastChild.children;
        for(var i=0;i<inputs.length;i++){
            inputs[i].value = '';
        }
    }
    //银行输入框的事件
    parentChange(e){
        let that=this;
         var num = e.target.value.trim();

            //解绑
            Utils.requestData({
                url: config.api + 'qj/front/v1/account/removeBankCard',
                method: 'post',
                data:{
                    "payPassword": num
                },
                callback: function(data){
                    if(data.resultCode==0){
                        //Utils.switchRoute('/bankDetail')
                        Modal.alert('提示',data.data, [
                            { text: '确定', onPress: () =>Utils.switchRoute('/my') , style: { fontWeight: 'bold' } },
                        ])
                    }
                },
            //错误处理 特殊情况特殊处理
                // errorAlert: function(data){
                //     //console.log('支付密码之后的提示信息：',data);
                //     if(data.resultCode == 2051001){
                //         Modal.alert('提示',data.resultMsg, [
                //             { text: '确定', onPress: () => {
                //                 that.nullVal();
                //             }, style: { fontWeight: 'bold' } },
                //         ])
                        
                //     }else if(data.resultCode == 'E90145'){
                //         Modal.alert('解绑失败',data.resultMsg, [
                //             { text: '确定', onPress: () => {
                //                 that.nullVal();
                //                 that.closeBank(e);
                //             }, style: { fontWeight: 'bold' } },
                //         ])
                //     }else if(data.resultCode == '20001'){//用户登陆失败
                //          Utils.switchRoute('/login');
                //     }
                //     //传递捕捉信号  给捕捉器
                //     this.errorAlert.jail = true;
                // }
             });
            //this.closeBank();
            // Alert({
            //     type:'simple',
            //     display:  this.state.alertDisplay,
            //     desc:'您输入的密码错误',
            //     button:[
            //         {
            //             text:'忘记密码',
            //             handle:()=>{
            //                 componentStore.update(this,{alertDisplay : 'none'});
            //             }
            //         },
            //         {
            //             text:'重试'
            //         }
            //     ]
            // })
    }
    //关闭输入银行卡密码
    closeBank(e){
        let that = this;
        componentStore.update(that,{
            bankPassword:false
        })
    let ev = e || event;
        ev.stopPropagation();
        return false;
    }
    render(){

        let that=this;
        let bank = this.state.bankPassword? 'block' : 'none';
        //解绑按钮
        let closeName=this.state.bankPassword?'closeBankMotail' : 'close_btn_bank';
        //输入银行卡密码弹窗
        let closeBankName=this.state.bankPassword?'close_btn_bank' : 'closeBankMotail';
        return(
            <div className="ellipsis-wrap"  onTouchEnd={()=>{
                let that = this;
                Utils.tokenExpireJumpToLogin(function () {
                    that.showHandle()
                })
            }}>
                <div className="ellipsis-box">
                    <Icon type="ellipsis" />
                </div>
                <div className="ellipsis-action" style={{
                    width:document.documentElement.clientWidth+'px',
                    height:this.props.height+'px',
                    top:document.documentElement.clientHeight - this.props.height + 'px',
                    display:this.state.display
                }}>
                    <div className={closeName}></div>
                    <div className="ellipsis-alert-del" onTouchEnd={(ev)=>{this.alertHandle(ev)}}>
                        <i className="point"></i>
                        <div className="e-list e-list-del" style={{display:that.state.display}}>
                            <div onTouchEnd={this.clearBankbind.bind(this)}>解绑银行卡</div>
                            <div onTouchEnd={()=>{this.showHandle()}}>取消</div>
                        </div>
                    </div>
                </div>
            {/*解绑密码验证输入*/}
                {/*<div className={closeBankName}></div>
                <div className="bankPassword" style={{display:bank}} onTouchEnd={(ev)=>{
                    ev.stopPropagation();
                    return false;
                }}>
                    <ul>
                        <li>请输入存管账户支付密码</li>
                        <li>银行卡：<span>{that.state.bankName}{that.state.bankCard}</span></li>
                        <li className="bankInput">
                            <BankPassword $id="bankPassword" parentChange={that.parentChange.bind(that)}></BankPassword>
                        </li>
                        <li onTouchEnd={()=>{Utils.switchRoute('/resetPaymentPassword1?name=bankDetail')}}>忘记密码？</li>
                    </ul>
                    <div className="close" onTouchEnd={that.closeBank.bind(that)}>
                        <img src={require('../../../image/icon/icon_close.png')} alt=""/>
                    </div>
                </div>*/}
            </div>
        )
    }
}

//底部菜单
class BottomMenu extends Component{
    constructor(){
        super();
    }
    componentWillMount(){

        //在此处初始化状态
        this.state = {
            display : 'none'
        }
    }
    showHandle(){
        if(this.state.display=='none'){
            componentStore.update(this,{
                display : 'block'
            })
        }else{
            componentStore.update(this,{
                display : 'none'
            })
        }
    }
    alertHandle(ev){
        ev.stopPropagation();
    }
    render(){
        return(
            <div className="bottomMenu-wrap"  onTouchEnd={()=>{this.showHandle()}}>
                <div className="bMenu-box">
                    <Icon type="ellipsis" />
                </div>
                <div className="bMenu-action" style={{
                    width:document.documentElement.clientWidth+'px',
                    height:this.props.height+'px',
                    top:document.documentElement.clientHeight - this.props.height + 'px',
                    display:this.state.display
                }}>
                    <div className="bMenu-list-box">
                        <a href="javascript:;" className="l-item">
                            <div className="e-icon">
                                <i className="zhangdan"></i>
                            </div>
                            <p>查看合同</p>
                        </a>
                        <a href="javascript:;" className="l-item">
                            <div className="e-icon">
                                <i className="hetong"></i>
                            </div>
                            <p>信息披露</p>
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

//问号
class Question extends Component{
    constructor(){
        super();
    }
    componentWillMount(){

        //在此处初始化状态
        this.state = {

        }
    }
    render(){
        return(
            <a href="/home" className="question-box">
                <Icon type={require("../../../image/svg/question.svg")} />
            </a>
        )
    }
}
//消费详情问号
class ConsumpeQ extends Component{
    constructor(){
        super();
    }
    componentWillMount(){

        //在此处初始化状态
        this.state = {

        }
    }
    render(){
        return(
            <a href="/principal" className="consumpeQ-box">
                <i></i>
            </a>
        )
    }
}
//银行卡详情的问号
class BankDetailQuestion extends Component{
    constructor(){
        super();
    }
    componentWillMount(){

        //在此处初始化状态
        this.state = {
            toBank:''
        }
        let that=this;
        Utils.requestData({
            url: config.api +"qj/front/v1/question/questionTypeList",
            method: 'post',
            data: {
                    "position":1
            },
            callback: function(data){
                if(data.resultCode == 0){
                    console.log('问题列表：',data.data);
                    // componentStore.update(that,{
                    //    top:data.data
                    // })
                    var listProblemData;
                    var newData = data.data;
                    for(var i = 0 ; i < newData.length ; i++){
                        // that.state.top[i].title = data.data[i].questionType
                        newData[i].left_src = require('../../../image/icon/icon_problem.png');
                        newData[i].right_src = require('../../../image/icon/icon_right.png');
                        newData[i].srcHref = 'globalProblemDetail.html';
                    }
                    console.log('新数据：',newData);
                    componentStore.update(that,{
                        toBank:newData[0].questionTypeId
                    });
                }
            }
        });
    }
    goQuestion(){
        // alert('等待跳转银行问题详情');
         window.location.href="/h5Static/globalProblemDetail.html?postion=1&QtId="+this.state.toBank;
        // Utils.switchRoute("/h5Static/globalProblemDetail.html?postion=1");
    }
    render(){
        console.log('id:::: ',this.state.toBank)
        return(
            <a href="javascript:;" onTouchEnd={this.goQuestion.bind(this)} className="question-box">
                <Icon type={require("../../../image/svg/question.svg")} />
            </a>
        )
    }
}
//自动投标
class AutoBid extends Component{
    constructor(){
        super();
    }
    componentWillMount(){

        //在此处初始化状态
        this.state = {

        }
    }
    render(){
        return(
            <a href="/h5Static/autoBidRule.html" className="autoBid-icon">
                <i></i>
            </a>
        )
    }
}

//平台活动
class Home extends Component{
    constructor(){
        super();
    }
    componentWillMount(){

        //在此处初始化状态
        this.state = {

        }
    }
    render(){
        return(
            <a href={"/proclaimList?city="+Utils.Storage.get('currentCity')} className="home-box">
                <i></i>
            </a>
        )
    }
}

//优惠券 说明
class Explain extends Component{
    constructor(){
        super();
    }
    componentWillMount(){

        //在此处初始化状态
        this.state = {

        }
    }
    render(){
        return(
            <a href="/couponExplain" className="explain-box">
                说明
            </a>
        )
    }
}

//消息中心 全读readAll
class ReadAll extends Component{
    constructor(){
        super();
    }
    componentWillMount(){

        //在此处初始化状态
        this.state = {

        }


    }
    readHandle(){

        Utils.requestData2({
            requestArr:  [
                //获取商品列表
                {
                    url: config.api +"qj/front/v1/membermessage/updateMemberMessage2Read",
                    method: 'post',
                    data: {
                        "type": "ALL"
                    }
                }
            ],
            callback: function(dataArr){

                var messageData = dataArr[0];
                console.log('ALL',messageData);
                if(messageData.resultCode == 0){
                    window.location.reload();
                }
            }
        })
    }
    render(){
        return(
            <span className="readAll-box" onTouchEnd={this.readHandle}>
                全部读取
            </span>
        )
    }
}

class Backbar extends Component{
    constructor(){
        super();
    }
    componentWillMount(){

        //在此处初始化状态
        this.state = {
            bContentHeight : 0
        }
    }

    componentDidMount(){
        // 存储 start
        componentStore.set(this);
        // 存储 end

        let oParent = document.getElementById('g-backbar-wrap');
        let oChild = document.getElementById('b-content');
        let oHead = document.getElementById('b-head');

        let contentHeight = document.documentElement.clientHeight - oHead.offsetHeight;

        // if(!this.props.isScroll){
        //     // Utils.preventPull(oParent,oChild);
        //
        // }
        oChild.style.minHeight = contentHeight + 'px';

        componentStore.update(this,{
            bContentHeight : contentHeight
        });

        //如果设置了style
        let oHeadMain = document.getElementById('headMain');
        let oBackBtn = oHeadMain.getElementsByClassName('b-backbtn')[0];
        let oTitle = oHeadMain.getElementsByClassName('b-title')[0];
        let style = this.props.style;
        if(style){
            if(style.appearance){
                for(let item in style.appearance){
                    oHeadMain.style[item] = style.appearance[item];
                }
            }
            if(style.character){
                for(let item in style.character){
                    oBackBtn.style[item] = style.character[item];
                    oTitle.style[item] = style.character[item];
                }
            }
        }

    };
    componentWillUnmount(){
        // 清除 start
        componentStore.clear(this);
        // 清除 end
    };

    goBack(ev){   //返回上一页
        if(this.props.onHandle){
            this.props.onHandle();
        }

        if(this.props.backUrl&&this.props.backUrl!='/noBack'){

            Utils.switchRoute( this.props.backUrl );
        }else{

            Utils.backRoute();
        }

        ev.preventDefault();
    };
    actionElement(){
        let value=this.props.action;

        if (value=="ellipsis"){
            return <Ellipsis height={this.state.bContentHeight} projectType={this.props.projectType} />
        }else if(value=="question"){
            return <Question />
        }else if(value=="home"){
            return <Home />
        }else if(value=="bottomMenu"){
            return <BottomMenu height={this.state.bContentHeight} />
        }else if(value=="explain"){
            return <Explain />
        }else if(value=="deleteBank"){
            return <DeleteBank />
        }else if(value=="readAll"){
            return <ReadAll />
        }else if(value=="autoBid"){
            return <AutoBid />
        }else if(value=="bankDetailQuestion"){
            return <BankDetailQuestion />
        }else if(value=="consumpeQ"){
            return <ConsumpeQ />
        }
        
    }

    render(){
        return (

            <div className="g-backbar-wrap" id="g-backbar-wrap">
                <div className="b-head-wrap" id="b-head">
                    <div className="b-head-box" id="headMain">
                        <a
                            href="javascript:;"
                            className="b-backbtn"
                            onTouchEnd={(ev)=>{
                                this.goBack(ev);
                            }}
                            style={{visibility:this.props.arrowHidden?'hidden':'visible'}}
                        >
                            <Icon type="left" />
                        </a>
                        <h3 className="b-title">{this.props.title}</h3>

                        {/*右侧功能*/}
                        <div className="b-action" style={{visibility:this.props.action?'visible':'hidden'}}>

                            {this.actionElement()}

                        </div>
                    </div>

                </div>
                <div className="b-content" id="b-content">
                    {this.props.children}
                </div>
            </div>

        )
    }

}

export default Backbar;
