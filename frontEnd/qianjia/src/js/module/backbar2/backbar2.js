import React, { Component, PropTypes } from 'react';

//导入样式 start
import './backbar2.scss'
//导入样式 end
import { Icon } from 'antd-mobile';


class BackBar2 extends Component{
    constructor(){
        super();
    }
    componentWillMount(){

        //在此处初始化状态
        this.state={

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
        //判断邀请首页不显示左侧按钮
        let left = that.props.inviteIndex ?  '' : 'left';
        // 同上 把事件制空
        let inviteIndex = that.props.inviteIndex?console.log('无返回') : (ev)=>{if(that.props.backUrl){Utils.switchRoute(that.props.backUrl)}else{Utils.backRoute();ev.preventDefault();}} ;
        return (
            <div className="backBar2">
                <div className="realBar">
                    <a href="javascript:;" className="b-backbtn" onTouchEnd={inviteIndex}>
                        <Icon type={left} />
                    </a>
                    {that.props.children}
                </div>

                <div className="hiddenBar">

                </div>

            </div>
        )
    }

}

export default BackBar2;
