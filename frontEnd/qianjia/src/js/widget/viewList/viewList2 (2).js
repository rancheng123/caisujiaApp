
   //使用实例
   /*<ViewList
       $id="module3-viewList"
       isListen={that.state.isListen}
       listenDistance={30}
       loading={that.state.loading}
       data={that.state.data}
       render={(ele,i)=>{
           return (
               <div
                   style={{height: '100px',lineHeight:'100px'}}
                   onClick={(ev)=>{
                       //Utils.switchRoute('/module3')
                   }}>
                   {ele.name} : {ele.age}
                   <img className="year-shouyi" src={require('../../../image/floatRate.png')} alt=""/>
               </div>
           )
       }}
       getDataFn={()=>{
           that.getData();
       }}
   >
   </ViewList>*/






import React, { Component, PropTypes } from 'react';
import './viewList.scss'


class ViewList extends Component{
    constructor(){
        super()
    }

    componentWillMount(){
        this.state={

        }
    }
    componentDidMount(){
        var that = this;
        // 存储 start
        componentStore.set(this);
        // 存储 end

        this.props.componentDidMount && this.props.componentDidMount();


        var pageNum = that.props.pageNum;
        this.frontPage = pageNum;
        this.behindPage = pageNum;
        this.oldScrollTop = 0;
    };
    componentWillUnmount(){
        // 存储 start
        componentStore.clear(this);
        // 存储 end
    };




    render(){
        var that = this;
        var dataList = that.props.data;
        var render = that.props.render;
        var getDataFn = that.props.getDataFn;
        var onScroll = that.props.onScroll;
        var totalPage = that.props.totalPage;




        //是否监听获取数据
        var isListen = that.props.isListen;
        //监听范围
        var listenDistance = that.props.listenDistance;
        //是否显示loading
        var loading = that.props.loading;




        var isListenUp = that.props.isListenUp;
        //是否显示loading
        var loadingUp = that.props.loadingUp;








        return (
            <div
                className="viewListWrap"
                style={{height: 300,borderLeft: '1px solid green',marginTop: '80px'}}
                onScroll={(ev)=>{


                    var oWrap = document.querySelector('.viewListWrap');
                    that.scrollDeriction = ((oWrap.scrollTop - that.oldScrollTop)>0)?'down':'up';


                    if( that.scrollDeriction =='down'){
                        //下监听
                        if(this.behindPage < totalPage){

                            var length = oWrap.querySelectorAll('.viewListItem').length
                            var height = oWrap.querySelector('.viewListItem').offsetHeight;
                            //总高 - scrollTop - viewHeight
                            var distance = height*length - oWrap.scrollTop - oWrap.offsetHeight;

                            if(distance <= listenDistance){
                                if(!loading){
                                    console.log('getData')
                                    that.behindPage++;
                                    getDataFn && getDataFn({
                                        scrollDeriction: that.scrollDeriction,
                                        frontPage: that.frontPage,
                                        behindPage: that.behindPage
                                    });
                                }

                            }
                        }
                    }else{
                        //上监听
                        if(this.frontPage > 0){



                            if(oWrap.scrollTop <= listenDistance){

                                if(!loading){
                                    console.log('getDataUp---------')
                                    this.frontPage--;



                                    getDataFn && getDataFn({
                                        scrollDeriction: that.scrollDeriction,
                                        frontPage: that.frontPage,
                                        behindPage: that.behindPage
                                    });
                                }

                            }
                        }
                    }



                    onScroll && onScroll(ev);

                    that.oldScrollTop = oWrap.scrollTop;
                }}
            >
                {
                    (function(){
                        return dataList.map(function(ele,i){
                            return (
                                <div
                                    key={i}
                                    className="viewListItem"
                                >
                                    {
                                        (function(){
                                            return render && render(ele,i);
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
                                    visibility: loading?'visible':'hidden',
                                    display: isListen?'block':'none'
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