/*
*
* 参数说明：
*  parentChange(e)
*                 回掉函数：回调父级组件事件
*
*   在调用的父级添加下面事件即可 可以直接粘贴做测试
*   parentChange(e){
        var num = e.target.value.trim();
            console.log(num);

    }
*
*
*/
import React, { Component, PropTypes } from 'react';
import { Router, Route, Link ,hashHistory} from 'react-router';
import _ from 'underscore';
import classNames from 'classnames'

//导入样式 start
import './bankPassword.scss'
class BankPassword extends Component{
    constructor(){
        super();
    }
    componentWillMount(){
        // this.state={
        //     passwordLength:false
        // }
    }

    componentDidMount(){
        // 存储 start
        let that=this;
        componentStore.set(this);
        // 存储 end
        //that.textInput.focus();
    };
    componentWillUnmount(){
        // 清除 start
        componentStore.clear(this);
        // 清除 end
    };
    //回调
    bankChange(e){
        var that = this;
        var num = e.target.value.trim();
        //var inputs = this.refs.inputs.children;
        let inputs = e.target.parentNode.lastChild.children;
        //console.log(num.length);
        var numlength = num.length-1;
        for(var i=numlength;i<num.length;i++){
            if(num.length>0){
                 inputs[i].value = num[i];
            }
             if(numlength<5 && numlength >-2){
                inputs[i+1].value = '';
             }
            if(num.length>6){
                break;
            }
        }

        if(num.length == 6){
            // Utils.switchRoute('/setPaymentPassword');
           // console.log(num);
            //console.log('你输入完成！');
            //num = this.props.inputValue;
            // componentStore.update(that,{
            //     passwordLength:true
            // })

            this.props.parentChange(e,function(){ //此函数处理密码输入错误之后，自动清空密码
                let textInput = document.getElementById('textInput');
                let aInput = document.getElementById('fake-box').getElementsByTagName('input');
                textInput.blur();
                textInput.value = "";
                textInput.style.left = "0px";
                for(var i=0;i<aInput.length;i++){
                    aInput[i].value = "";
                    aInput[i].blur();
                }
            });

        }

    }
    //所有输入格制空
    nullVal(){
        //取到所有节点
        //console.log('id:',document.getElementById('textInput'));

        if(this.props.nullVal){
            this.props.nullVal();
        }
        // let input = document.getElementById('textInput');
        //     input.value = '';
        // let inputs = input.parentNode.lastChild.children;
        // for(var i=0;i<inputs.length;i++){
        //     inputs[i].value = '';
        // }
    }
    render(){
        //this.props.focusRef? this.textInput.focus() : '';
        //console.log('银行输入密码：',this.refs['bankPasswordRef']);
        var that = this;
        var passwordLength = this.props.passwordLength == 'undefined'? false : this.props.passwordLength;
        //var passwordMatil =this.props.passwordMatil ? 'block' : 'none';
        return (
            <div className="pwd-box" onClick={this.nullVal.bind(this)}>
                <div className="bankMotail" style={{display:passwordLength?'block':'none'}} onClick ={function(event){ event.stopPropagation(); }} ></div>
                <div className="loading" style={{display:passwordLength?'block':'none'}} ><img src={require('../../../image/icon/loading.gif')} alt=""/></div>
                <input 
                    type="tel" 
                    maxLength="6" 
                    id="textInput" 
                    style={{display:passwordLength?'none':'block'}} 
                    autoFocus={true} 
                    className="pwd-input" 
                    ref="first_input" 
                    onChange={this.bankChange.bind(this)} 
                    onFocus={()=>{
                        console.log('获取到了光标-0',this);
                        console.log(11, this.refs["first_input"] );
                        this.refs["first_input"].style.left="-99999em";
                    }}
                    onBlur={()=>{
                        console.log('失去 光标-0',this);
                        console.log(11, this.refs["first_input"] );
                        this.refs["first_input"].style.left="0px";
                    }}
                />
                <div className="fake-box" id="fake-box" style={{display:passwordLength?'none':'block'}}>
                    <input style={{borderLeft: 0}}  type="password" readOnly="readOnly"  />
                    <input type="password" readOnly="readOnly" />
                    <input type="password" readOnly="readOnly" />
                    <input type="password" readOnly="readOnly" />
                    <input type="password" readOnly="readOnly" />
                    <input type="password" readOnly="readOnly"/>
                </div>
                
            </div>
        )
    }
}
export default BankPassword;
