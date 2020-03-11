import React, { Component, PropTypes } from 'react';
import { Router, Route, Link ,hashHistory} from 'react-router';
import _ from 'underscore';
import classNames from 'classnames'

//导入样式 start
import './navBar.scss'
//导入样式 end


class Home extends Component{
    constructor(){
        super();
    }
    componentWillMount(){

        //在此处初始化状态



        if(location.pathname == '/home'){
            var active = '0'
        }else if(location.pathname == '/investment'){
            var active = '1'
        }else if(location.pathname == '/my'){
            var active = '2'
        }

        this.state={
            display: false,
            active: active
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
            <div className="navBar">
                <div className="btn_slide" onClick={()=>{
                    that.state.display = !that.state.display;
                    componentStore.update(that,that.state);
                }}></div>

                <div className="flex-father controllCover" style={{display: that.state.display?'-webkit-box':'none'}}>
                    <div className={classNames({
                        "flex-child1":true,
                        "controllItem":true,
                        "active": that.state.active =="0"?true:false
                    })} onClick={()=>{
                        that.state.active = '0';
                        componentStore.update(that,that.state);

                        Utils.switchRoute('/home')

                    }}>
                        <span className="iconQianjia"></span>
                        <br />
                        <span className="iconText">首页</span>
                    </div>
                    <div  className={classNames({
                        "flex-child1":true,
                        "controllItem":true,
                        "active": that.state.active =="1"?true:false
                    })} onClick={()=>{
                        that.state.active = '1';
                        componentStore.update(that,that.state);

                        Utils.switchRoute('/investment')
                    }}>
                        <span className="iconTouzi"></span>
                        <br />
                        <span className="iconText">投资</span>
                    </div>
                    <div  className={classNames({
                        "flex-child1":true,
                        "controllItem":true,
                        "active": that.state.active =="2"?true:false
                    })} onClick={()=>{
                        that.state.active = '2';
                        componentStore.update(that,that.state);
                        Utils.switchRoute('/my')
                    }}>
                        <span className="iconMy"></span>
                        <br />
                        <span className="iconText">我的</span>
                    </div>
                </div>
            </div>
        )
    }

}

export default Home;
