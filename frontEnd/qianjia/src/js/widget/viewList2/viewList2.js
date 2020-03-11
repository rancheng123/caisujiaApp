
import React, { Component, PropTypes } from 'react';
import './viewList.scss'


class ViewList extends Component{
    constructor(){
        super()
    }

    componentWillMount(){
        this.state={
            data: [],
            isListen: true,
            loading: false,
            currentPageNum: 0,

            //计算机滚动，true 不加载数据
            cyber: false
        }
    }
    componentDidMount(){
        var that = this;
        // 存储 start
        componentStore.set(this);
        // 存储 end

        this.props.componentDidMount && this.props.componentDidMount();


        window.onscroll = function(ev){

            //是否监听获取数据
            var isListen = that.state.isListen;
            //是否显示loading
            var loading = that.state.loading;
            //是否机器执行
            var cyber = that.state.cyber;



            var oWrap = document.querySelector('.viewListWrap2');
            if(oWrap == null){
                //防止没有数据时候，报错
                return;
            }
            var viewListItems = oWrap.querySelector('.viewListItem');
            if(viewListItems === null){
                //防止没有数据时候，报错
                return;
            }

            //总高 - scrollTop - viewHeight
            var distance = document.body.scrollHeight - document.body.scrollTop - window.screen.height


            //非计算机操作
            if(!cyber){
                //启用监听
                if(isListen){
                    if(distance <= that.props.listenDistance){
                        if(!loading){
                            console.log('getData')
                            that.getData();
                        }

                    }
                }
            }
            that.props.onScroll && that.props.onScroll(ev);
        }

    };
    componentWillUnmount(){
        // 存储 start
        componentStore.clear(this);
        // 存储 end
    };

    getData(opts){
        var that = this;

        componentStore.update(that,{
            loading: true
        })

        //请求对象
        var requestObj = that.props.requestConfig.requestObj;
        //当前页字段
        var currentPageNum    = that.props.requestConfig.requestProxy.currentPageNum

        //获取多页
        if(opts){

            //加载完数据的回调
            var callback = opts.callback;
            //获取连续几页数据
            var pages = opts.pages;

            var pages = Number(pages);


            componentStore.update(that,{
                currentPageNum: pages
            })

            var requestArr = [];
            for(var i=0;i<pages;i++){
                var requestObjCopy = Utils.deepCopy(requestObj);
                //设置当前页字段
                requestObjCopy.data[currentPageNum] = i+1;
                requestArr.push(requestObjCopy)
            }
        }else{
            componentStore.update(that,{
                currentPageNum: that.state.currentPageNum++
            })


            var requestObjCopy = Utils.deepCopy(requestObj);
            //设置当前页字段
            requestObjCopy.data[currentPageNum] = that.state.currentPageNum;
            var requestArr = [requestObjCopy]
        }



        Utils.requestData2({
            requestArr:  requestArr,
            callback: function(dataArr){

                //总页数
                that.totalPage = that.props.computeTotalPage(dataArr);
                //收集返回的数据
                var productList = that.props.collectData(dataArr);

                if(productList && productList.length){
                    componentStore.update(that,{
                        data: that.state.data.concat(productList),
                        isListen: that.state.currentPageNum >= that.totalPage?false:true,
                        loading: false,
                        currentPageNum: that.state.currentPageNum+1
                    })


                    if(opts && opts.scrollToSlot){
                        setTimeout(function () {

                            if(Utils.momery.from.params && Utils.momery.from.params.slot){
                                 componentStore.update(that,{
                                     cyber: true
                                 })

                                 document.body.scrollTop = Utils.momery.from.params.slot;

                                 setTimeout(function () {
                                     componentStore.update(that,{
                                         cyber: false
                                     })
                                 },200)
                            }
                        },30)

                    }

                }

            }
        })
    }




    render(){
        var that = this;

        return (
            <div
                className="viewListWrap2"
            >

                {
                    that.props.children
                }

                {
                    (function(){
                        return that.state.data.map(function(ele,i){
                            return (
                                <div
                                    key={i}
                                    className="viewListItem"
                                >
                                    {
                                        (function(){
                                            return that.props.render && that.props.render(ele,i);
                                        })()
                                    }
                                </div>
                            )
                        })
                    }())
                }

                {
                    (function(){
                       // if(loading){
                            return (
                                <div style={{
                                    visibility: that.state.loading?'visible':'hidden',
                                    display: that.state.isListen?'block':'none'
                                }} className="viewList-viewMore">
                                    正在加载...
                                </div>
                            )

                      //  }
                    }())
                }
            </div>
        )
    }
};

export default ViewList;
