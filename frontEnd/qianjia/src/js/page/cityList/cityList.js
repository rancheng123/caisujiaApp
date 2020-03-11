

//获取数据
/*

var cityList = {};
$('.mui-indexed-list-group').each(function (i, ele) {

    if (i != 0) {
//debugger
        var letter = $(ele).data('group');
        cityList[letter] = {
            data: [],
            isShow: true
        };

        $(ele).nextUntil('.mui-indexed-list-group').each(function (j, item) {


            cityList[letter].data.push({
                 chinese: $(item).text(),
                 english: $(item).data('tags'),
                 shortening: $(item).data('value'),
                 isShow: true
            })
        })
    }
});

console.log(JSON.stringify(cityList))


*/






import React, { Component, PropTypes } from 'react';
import { Router, Route, Link ,hashHistory} from 'react-router';
import _ from 'underscore';
import classNames from 'classnames'

import cityListData from './data';

//导入样式 start
import './cityList.scss'
//导入样式 end
import Backbar from '../../module/backbar/backbar';
import {SearchBar} from 'antd-mobile';


class CityList extends Component{
    constructor(){
        super();
    }
    componentWillMount(){

        //在此处初始化状态
        this.state={
            data: cityListData,
            litterHeight: 0
        }
    }

    componentDidMount(){
        // 存储 start
        componentStore.set(this);


        componentStore.update(this,{
            litterHeight: (
                screen.height -
                parseInt(getComputedStyle(document.getElementsByClassName('b-head-wrap')[0],false).height) -
                parseInt(getComputedStyle(document.getElementsByClassName('am-search-value')[0],false).height) -
                120
            )/22
        })
    };
    componentWillUnmount(){
        // 清除 start
        componentStore.clear(this);
        // 清除 end
    };

    switchRoute(){
        var that = this;

        if(Utils.Url.parseUrl(location.href).params.backroute){
            Utils.switchRoute(Utils.Url.parseUrl(location.href).params.backroute);
        }else{
            Utils.backRoute();
        }
    }


    render(){
        var that = this;


        //"keyup", "change", "input", "focus", "cut", "paste"

        /*
         keyword = (keyword || '').toLowerCase();


         if (keyword && text.indexOf(keyword) < 0 &&
         value.indexOf(keyword) < 0 &&
         tags.indexOf(keyword) < 0) {
         selectorBuffer.push(classSelector('indexed-list-inner li') + ':nth-child(' + (currentIndex + 1) + ')');
         itemCount++;
         }


         http://uat.piaojiazi.com:8087/static/wap/js/mui.city.js   139行

         */

        return (
            <div className="cityList">
                <Backbar $id="cityList" title="选择城市" >


                    <SearchBar placeholder="搜索城市"
                               onChange={(value)=>{
                                   var keyword = (value || '').toLowerCase();

                                   _.map(that.state.data, function(cityListObj, letter){
                                       cityListObj.data.map(function (city,i) {



                                           if (keyword && city.chinese.indexOf(keyword) < 0 &&
                                               city.shortening.toLowerCase().indexOf(keyword) < 0 &&
                                               city.english.indexOf(keyword) < 0) {
                                               city.isShow = false;
                                           }else{
                                               city.isShow = true;
                                           }
                                       });


                                       //某一组都隐藏
                                       var isHideAll = _.every(cityListObj.data, function(city){
                                           return city.isShow == false;
                                       });
                                       if(isHideAll){
                                           cityListObj.isShow = false;
                                       }else{
                                           cityListObj.isShow = true;
                                       }



                                   });
                                   componentStore.update(that,{
                                       data: that.state.data
                                   })



                                   console.log('change')
                               }}
                               onClear={()=>{
                                   console.log('onClear')
                               }}
                               showCancelButton={false}
                    />
                    <div className="zhanweiBlock"></div>
                    <div className="litterList">
                        {(function () {
                            return _.map(that.state.data, function(cityListObj, letter){
                                if(letter == 'hotCity'){
                                    return false
                                }
                                return (
                                    <div className="litterItem" style={{height: that.state.litterHeight}} key={letter}
                                         onClick={()=>{
                                             location.hash=letter;
                                         }}
                                    >
                                        {letter}
                                    </div>
                                )
                            })
                        })()}
                    </div>

                    <section className="bigBox">
                        <div className="hotCitys">
                            <div className="title">热门城市</div>
                            <div className="hotCityBox">
                                {(function () {
                                    return that.state.data.hotCity.data.map(function (ele,i) {
                                        return(
                                            <div className="hotCity" key={i}
                                                 onClick={(ev)=>{
                                                     Utils.Storage.set('currentCity',ele.chinese)
                                                     that.switchRoute()
                                                 }}
                                            >
                                                {ele.chinese.replace('市','')}
                                            </div>
                                        )
                                    })
                                })()}
                                <div className="hotCity"
                                     onClick={(ev)=>{
                                         Utils.Storage.set('currentCity','全国')
                                         that.switchRoute()
                                     }}
                                >
                                    全国
                                </div>
                            </div>

                        </div>


                        {(function () {
                            return _.map(that.state.data, function(cityListObj, letter){
                                if(letter == 'hotCity'){
                                    return false
                                }

                                if(cityListObj.isShow){
                                    return (
                                        <div className="letterGroup" key={letter} id={letter}>
                                            <div className="letter">{letter}</div>
                                            <ul>
                                                {(function () {
                                                    return cityListObj.data.map(function (city,i) {
                                                        return (
                                                            <li key={i}
                                                                className={classNames({
                                                                    hide: !city.isShow
                                                                })}
                                                                onClick={(ev)=>{
                                                                    Utils.Storage.set('currentCity',ev.target.innerHTML)
                                                                    that.switchRoute()
                                                                }}
                                                            >{city.chinese}</li>
                                                        )
                                                    })
                                                })()}
                                            </ul>
                                        </div>
                                    )
                                }

                            });
                        })()}
                    </section>

                </Backbar>









            </div>
        )
    }

}

export default CityList;
