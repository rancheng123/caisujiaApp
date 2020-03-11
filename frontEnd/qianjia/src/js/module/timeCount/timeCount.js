import React, { Component, PropTypes } from 'react';
import { Router, Route, Link ,hashHistory} from 'react-router';

//导入样式 start
import './timeCount.scss'
//导入样式 end


class TimeCount extends Component{
    constructor(){
        super();
    }
    componentWillMount(){
        this.state={
            visible: true,
            count: 60
        }
    }

    componentDidMount(){
        var that = this;
        // 存储 start
        componentStore.set(this);
        // 存储 end


        var count = this.state.count;
        that.timer =  null;
        that.timer = setInterval(function () {
            count--;
            if (count<=0){
                clearInterval(that.timer);

                that.props.onEnd && that.props.onEnd();
            }

            componentStore.update(that,{
                count: count
            })

        },1000)
    };
    componentWillUnmount(){
        var that = this;
        // 清除 start
        componentStore.clear(this);
        // 清除 end

        if(that.timer){
            clearInterval(that.timer)
        }
    };

    render(){
        var that = this;

        return (
            <div className="timeCount" style={{display: that.state.visible==true?'block': 'none' }}>
                {that.state.count}秒
            </div>
        )
    }

}

export default TimeCount;
