import React, { Component, PropTypes } from 'react';
import { Router, Route, Link ,hashHistory} from 'react-router';

/*
*   参数 :
*     items={arrImg}    图片地址
*     speed={1.5}       轮播切换图片的速度
*     delay={3}         自动轮播时候停留的时间
*     pause={true}      鼠标放上图片是否停止自动轮播
*     autoplay={true}   是否自动轮播
*     dots={true}       是否需要下面的轮播点点位
*     arrows={true}     是否需要左右点击箭头
*
* */

require('./slider.scss');

import SliderItem from './sliderItem/sliderItem';
import SliderDots from './sliderDots/sliderDots';
import SliderArrows from './sliderArrows/sliderArrows';

class Slider extends Component{
  constructor(props) {
    super(props);
    this.state = {
      nowLocal: 0,
      isSpeed : true,
      isPlay : true,
    };
  }


  checkTransitionEnd(ele,fn){

    function whichTransitionEvent(){

        var t,
            el = document.createElement('surface'),
            transitions = {
                'transition':'transitionend',
                'OTransition':'oTransitionEnd',
                'MozTransition':'transitionend',
                'WebkitTransition':'webkitTransitionEnd'
            }

        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
    }

    var transitionEvent = whichTransitionEvent(fn);
    transitionEvent && ele.addEventListener(transitionEvent, function() {
        fn();
        ele. removeEventListener(transitionEvent,fn,false);//销毁事件

    });
  }

  // 向前向后多少
  turn(n) {
    let len = this.props.items.length;
    let oUl = this.refs.lunbo;
    let firstLi = oUl.getElementsByTagName('li')[0];

    if (this.props.isSeamLess){

        var _n = this.state.nowLocal + n;

        if(_n < 0) {
            _n = _n + len;
        }

        if (_n==len){
            this.setState({
                isPlay:false
            });
            firstLi.style.WebkitTransform = "translate("+ 100*(len) +"%,0)";

            this.checkTransitionEnd(oUl,function () {
              if (_n>=len){
                firstLi.style.WebkitTransform = "translate(0,0)";
                oUl.style.left = '0px';
                _n = 0;
                this.setState({
                    nowLocal: _n,
                    isSpeed:false,
                    isPlay:true
                });

              }
            }.bind(this));
        }

        if(_n >= len+1) {

            _n = _n - len;
        }


        this.setState({nowLocal: _n,isSpeed:true});

    }else{
        var _n = len + n;
        if(_n < 0) {
            _n = _n + len;
        }
        if(_n >= len) {
            _n = _n - len;
        }
        this.setState({nowLocal: _n});
    }

  }

  // 开始自动轮播
  goPlay() {
    if(this.props.autoplay) {
      this.autoPlayFlag = setInterval(() => {
        this.turn(1);
      }, this.props.delay * 1000);
    }
  }

  // 暂停自动轮播
  pausePlay() {
    clearInterval(this.autoPlayFlag);
  }

  componentDidMount() {
    this.goPlay();
  }

  setLeft(){

    return -100 * this.state.nowLocal + "%";
  }

  render() {
    let count = this.props.items.length;

    let itemNodes = this.props.items.map((item, idx) => {
      return <SliderItem item={item} count={count} key={'item' + idx} />;
    });

    let arrowsNode = <SliderArrows turn={this.turn.bind(this)} isPlay={this.state.isPlay} />;

    let dotsNode = <SliderDots turn={this.turn.bind(this)} count={count} nowLocal={this.state.nowLocal} />;
    return (
      <div
        className="slider"
        onMouseOver={this.props.pause?this.pausePlay.bind(this):null} onMouseOut={this.props.pause?this.goPlay.bind(this):null}>
          <ul className="play" ref="lunbo" style={{
              left: this.setLeft(),
              transitionDuration: this.state.isSpeed ? this.props.speed + "s" : "0s",
              width: this.props.items.length * 100 + "%"
            }}>
              {itemNodes}
          </ul>
          {this.props.arrows?arrowsNode:null}
          {this.props.dots?dotsNode:null}
        </div>
      );
  }
}

Slider.defaultProps = {
  speed: 1,
  delay: 2,
  pause: true,
  autoplay: true,
  dots: true,
  arrows: true,
  items: [],
  isSeamLess:false
};
Slider.autoPlayFlag = null;

export default Slider;
