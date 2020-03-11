
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
        var height = that.props.height || 300;



        //是否监听获取数据
        var isListen = that.props.isListen;
        //监听范围
        var listenDistance = that.props.listenDistance;
        //是否显示loading
        var loading = that.props.loading;

        return (
            <div
                className="viewListWrap"

                style={{height: height}}

                onScroll={(ev)=>{

                   // console.log(ev.target.scrollTop + ': scrollTop')
                    //console.log('scrollHeight: '+ev.target.scrollHeight +  '  scrollTop: '+ev.target.scrollTop +'  offsetHeight:'+ev.target.scrollTop)
                   // console.log(ev.target.offsetHeight + ': offsetHeight')



                    var oWrap = document.querySelector('.viewListWrap');

                    var viewListItems = oWrap.querySelector('.viewListItem');

                    if(viewListItems === null){
                        //防止没有数据时候，报错
                        return;
                    }


                    var length = oWrap.querySelectorAll('.viewListItem').length;
                    var height = oWrap.querySelector('.viewListItem').offsetHeight;
                    //总高 - scrollTop - viewHeight
                    var distance = height*length - oWrap.scrollTop - oWrap.offsetHeight;

                    //启用监听
                    if(isListen){
                        if(distance <= listenDistance){
                            if(!loading){
                                console.log('getData')
                                getDataFn && getDataFn();
                            }

                        }
                    }

                    onScroll && onScroll(ev);


                }}
            >

                {
                    that.props.children
                }

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
