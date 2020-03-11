/*
*
* 参数说明：
*   left_src :
*       左侧图标 (必) 格式 require('地址')
*   title :
*       标题 (必) 格式 '标题'
*   right_src :
*       右侧图标 (必) 格式 同左侧图标
*   src : 
*       跳转地址 (必) 格式 '地址'
*   border_b :
*       是否有下边框 (选) 格式 false/true
*   setTetx :
*       是否设置右侧文字 (选) 格式 false/true
*   isLeftIcon :
*        右侧图标是否取消 (选)  格式 true/false
*        
*/
import React, { Component, PropTypes } from 'react';
import { Router, Route, Link ,hashHistory} from 'react-router';
import _ from 'underscore';
import classNames from 'classnames'

//导入样式 start
import './listBar.scss'
class ListBar extends Component{
    constructor(){
        super();
    }
    componentWillMount(){}

    componentDidMount(){
        // 存储 start
        componentStore.set(this);
        // 存储 end
    };
    componentWillUnmount(){
        // 清除 start
        componentStore.clear(this);
        // 清除 end
    };
    click(){
        if(this.props.listBarFn){
            this.props.fn();
        }
    }
    render(){
        var that = this;
        //console.log(this.props.border_b);
        let isLeft = this.props.isLeftIcon == undefined || this.props.isLeftIcon == true? true : false;
        let border = this.props.border_b == undefined || this.props.border_b == true ? true :false;
        //console.log(this.props.border_b); 
        let setText = this.props.setText == true ? true : false;
        let addSrc = this.props.addSrc == undefined || this.props.addSrc == '' ? 'javascript:void(0)' : this.props.addSrc;
        let tel = this.props.tel ? 'tel:' : 'javascript:0';
        let isSrc = that.props.src;
        return (
            <div className={'set'}>
                <div className={border?"set_border" : ''}>
                    <div className="set_list" onClick={function(){ (isSrc == '')? '' : Utils.switchRoute(isSrc)}} >
                        <span href={addSrc} onClick={()=>{this.click()}}>
                            <div className="list_left">
                                <span className="left_img" style={{display:isLeft?'inlin-block' : "none" }}><img src={this.props.left_src} alt="图标"/></span>
                                <span className={this.props.setText? "left_text_true" :"left_text"}>{this.props.title}</span>
                                <a href={tel} style={{display:setText?'inline-block' : 'none',float:'right'}}>{this.props.rightText}</a> 
                            </div>
                            <div className="list_right">
                                <div className="right_img">
                                    <img src={this.props.right_src} alt="箭头"/>
                                </div>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}
export default ListBar;