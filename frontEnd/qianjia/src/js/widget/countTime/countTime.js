/**
 * Created by 唐丹 on 2017/3/22.
 *
 *  CountTime (倒计时) 组件
 *
 *      参数(3个) :
 *          time : (必写)
 *              h : 小时
 *              m : 分钟
 *              s : 秒
 *              eg: <CountTime time="1m" />
 *                  <CountTime time="30s" />
 *
 *          callback : (可选)
 *              (返回值->时间的真实DOM )
 *              eg: <CountTime callback="fn" />
 *
 *          initTime : (可选)
 *              记录初始化这个组件的当前时间戳
 *              单位为毫秒 (时间戳)
 *              eg: <CountTime initTime="1490347748133" />
 *
 *      属性 ：
 *          targetTime : 目标时间
 *
 *      说明 :
 *          此组件都是先把时间换算成毫秒进行计算
 *          目前只支持整点 小时 分钟 秒 倒计时
 *
 *
 *
 *
 */
import React, { Component, PropTypes } from 'react';
import { Router, Route, Link ,hashHistory} from 'react-router';

//导入样式 start
import './countTime.scss'
//导入样式 end

class CountTime extends Component{
    constructor(){
        super();
        this.timer = null;  //定时器
        this.unit = null;   //记录单位 s m h

        //时间戳换算成 s m h
        this.timeS = '00';
        this.timeM = '00';
        this.timeH = '00';

    }

    conversionTime(isAddNum){  //处理时间换算

        //isAddNum 为了解决二次调用的时候一秒误差
        this.timeDiff = 0;  //目标时间 与 当前时间 的 时间差
        if (isAddNum){
            this.timeDiff = this.targetTime - new Date().getTime() + 1000;
        }else{
            this.timeDiff = this.targetTime - new Date().getTime();
        }


        if (this.unit=="s"){
            this.timeS = Math.floor(this.timeDiff/1000%60);
            this.second = this.timeS<10 ? '0'+this.timeS : this.timeS;
            if(this.timeS<=0)this.second = "00";

            this.minute = this.timeM;
            this.hour = this.timeH;
        }

        if (this.unit=="m"){

            this.timeS = Math.floor(this.timeDiff/1000%60);
            this.second = this.timeS<10 ? '0'+this.timeS : this.timeS;
            if(this.timeS<=0)this.second = "00";

            this.timeM = Math.floor(this.timeDiff/1000/60%60);
            this.minute = this.timeM<10 ? '0'+this.timeM : this.timeM;
            if(this.timeM<=0)this.minute = "00";

            this.hour = this.timeH;
        }

        if (this.unit=="h"){

            this.timeS = Math.floor(this.timeDiff/1000%60);
            this.second = this.timeS<10 ? '0'+this.timeS : this.timeS;
            if(this.timeS<=0)this.second = "00";

            this.timeM = Math.floor(this.timeDiff/1000/60%60);
            this.minute = this.timeM<10 ? '0'+this.timeM : this.timeM;
            if(this.timeM<=0)this.minute = "00";

            this.timeH = Math.floor(this.timeDiff/1000/60/60%24);
            this.hour = this.timeH<10 ? '0'+this.timeH : this.timeH;
            if(this.timeH<=0)this.hour = "00";

        }


    }

    cyclingTime(){ //开始计算 倒计时

        this.timer = setInterval(function () {

            this.conversionTime(true);

            //清除定时器
            let clearTime = function () {
                clearInterval( this.timer );
                this.second = '00';
                this.minute = '00';
                this.hour = '00';
                if(this.props.callback){
                    this.props.callback(this.refs.timeId);
                }
            };

            if (this.unit=="s" && Math.floor(this.timeS)<0){
                clearTime.bind(this)();
            }

            if (this.unit=="m" && Math.floor(this.timeM)<0){
                clearTime.bind(this)();
            }

            if (this.unit=="h" && Math.floor(this.timeH)<0){
                clearTime.bind(this)();
            }


            this.setState({
                err : false,
                second : this.second,
                minute : this.minute,
                hour : this.hour
            })

        }.bind(this),1000)
    }

    componentWillMount(){
        //在此处初始化状态

        //设置目标时间

        let getTime = this.props.time;

        if(!getTime) {  //判断是否设置了时间
            console.error("No set time");
            this.state = {
                err : true
            };
            return false;
        }

            //判断时间格式是否正确 兼容大小写
        this.unit = getTime.charAt(getTime.length-1).toLocaleLowerCase();
        let time = Number(getTime.substring(0,getTime.length-1));

        if ( !isNaN(this.unit) || isNaN(time) ){
            console.error("Time format is wrong");
            this.state = {
                err : true
            };
            return false;
        }

            //处理二次进入时 时间从原始点开始计算
        let initTime = this.props.initTime;
        let nTime = Number(initTime);
        let cTime = new Date().getTime();

        if (initTime){
            if(nTime < cTime){
                console.error("initTime is wrong");
            }else{
                this.initTime = nTime;
            }
        }else{
            this.initTime = cTime;
        }


            //计算目标时间 结果都是毫秒
        if(this.unit=='s'){   //分钟

            this.targetTime = this.initTime + (time)*1000;

        }else if(this.unit=='m'){ //秒

            this.targetTime = this.initTime + (time)*60*1000;

        }else if(this.unit=='h'){   //小时

            this.targetTime = this.initTime + (time)*60*60*1000;

        }

        this.conversionTime();

        this.state={
            err : false,
            second : this.second,
            minute : this.minute,
            hour : this.hour
        }

    }

    componentDidMount(){
        // 存储 start
        componentStore.set(this);
        // 存储 end

        if (this.state.err)return false;
        this.cyclingTime(); //组件渲染成功之后开启计时器

    };
    componentWillUnmount(){
        // 清除 start
        componentStore.clear(this);
        // 清除 end

        clearInterval(this.timer)
    };

    result(){
        if (this.state.err)return false;
        return this.state.hour +':'+  this.state.minute +':'+ this.state.second;
    }

    render(){

        return (
            <span ref="timeId" className="countTime">
                {this.result()}
            </span>
        )
    }

}

export default CountTime;
