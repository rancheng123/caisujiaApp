import React, { Component, PropTypes } from 'react';
import { Router, Route, Link ,hashHistory} from 'react-router';
import _ from 'underscore';
import classNames from 'classnames'

//导入样式 start
import './titleBar.scss'
//导入样式 end


class TitleBar extends Component{
    constructor(){
        super();
    }
    componentWillMount(){

        //在此处初始化状态
        this.state={
            display: false,
            active: '0'
        }
    }

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

    render(){
        var that = this;

        return (
            <div className="TitleBar">
                <div className="flex-father titleWrap">
                    {this.props.children}
                </div>
            </div>
        )
    }

}

export default TitleBar;
