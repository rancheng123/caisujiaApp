/*
* 参数说明
*       text:
*            按钮名称  (必)   格式 '标题'
*       click:
*            回调函数  (必)   格式 void
*       background:
*             按钮颜色 (选)    格式 '色值'
*       color:
*             字体颜色 (选)    格式同上
*       radius:
*             圆角大小 (选)    格式 '圆角大小'
*       border:
*             边框     (选)    格式 '边框大小以及颜色'
*       size:
*             字体大小  (选)   格式 '字体大小'
*/
import React, { Component, PropTypes } from 'react';
import { Router, Route, Link ,hashHistory} from 'react-router';
import _ from 'underscore';
import classNames from 'classnames'
class Button extends Component{
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
    onClick(){
        this.props.click();
    }
    render(){
        var that = this;
        return (
            <div className="button">
                <button onTouchStart={this.onClick.bind(this)}  style={{background: this.props.background,color:this.props.color,borderRadius:this.props.radius, border:this.props.border, fontSize:this.props.size}}>{this.props.text}</button>
            </div>
        )
    }
}
export default Button;