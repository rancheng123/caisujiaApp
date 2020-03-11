import React, { Component, PropTypes } from 'react';
import IScroll from 'iscroll/build/iscroll-probe';
import './react-isScroll.scss'

class ReactIscroll extends Component{
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

        that.init();
    };
    componentWillUnmount(){
        // 存储 start
        componentStore.clear(this);
        // 存储 end
    };

    componentDidUpdate(prevProps, prevState){
        var that = this;

        //此组件 更新数据 必须refresh 才有效
        var timer = setTimeout(function(){
            that.refresh();
            clearTimeout(timer);
        },100)
    };

    init(){
        var that = this;

        //isScroll插件实例
        that.isScrollCase = null;
        that.getDataJson = {

            // 'stop'         请求终止信号
            //'getOldData'    请求老数据信号
            //'getNewData'    请求老数据信号
            status: 'stop'
        };

        that.getDataFn = that.props.customOpts.getDataFn;

        //当前页
        that.currentPage = that.props.customOpts.currentPage || 1;

        //记录老的当前页
        that.oldCurrentPage = that.currentPage;

        //数据条数
        that.dataNum = that.props.customOpts.dataNum;
        //一页几条
        that.pageSize = that.props.customOpts.pageSize;
        //页数 = 总条数/每页条数
        that.pageNum = Math.ceil( (that.dataNum/that.pageSize) );



        var wrapperId = '#'+ that.refs['react-isScroll-wrapper'].getAttribute('id');
        var isScrollCase = that.isScrollCase = new IScroll(wrapperId, that.props.isScrollOpts);

        isScrollCase.on('scroll', function(){
            //查看新的 toDown
            if(isScrollCase.directionY > -1){
                if(isScrollCase.y <=isScrollCase.maxScrollY - 30){
                    that.getDataJson.status = 'getNewData';
                }
            }
            //查看旧的 toUp
            else{
                if(isScrollCase.y >= 30){
                    that.getDataJson.status = 'getOldData';
                }
            }
        });
        isScrollCase.on('scrollEnd', function(){
            if( that.getDataJson.status == 'getNewData' || that.getDataJson.status == 'getOldData' ){
                if( that.getDataJson.status == 'getNewData'){
                    that.currentPage++;
                    if(that.currentPage>=that.pageNum){
                        that.currentPage=that.pageNum
                    };


                    that.getDataFn && that.getDataFn.call(that,{
                        currentPage: that.currentPage,
                        isUpdate: that.currentPage != that.oldCurrentPage,
                        directionY: isScrollCase.directionY == -1? 'toUp': 'toDown'

                    });
                    //已发请求，状态改为请求停止
                    that.getDataJson.status = 'stop';
                    //记录老的当前页
                    that.oldCurrentPage = that.currentPage;


                }else if(that.getDataJson.status == 'getOldData'){
                    /*that.currentPage--;
                    if(that.currentPage<=1){
                        that.currentPage=1
                    }*/
                };



            };
        });
    };

    refresh(){
        this.isScrollCase.refresh();
    }

    render(){

        var that = this;
        return (
            <div id={"wrapper"+ Date.now() } ref="react-isScroll-wrapper" className="react-isScroll-wrapper" style={{height: that.props.customOpts.height}} >
                <div id="scroller" className="react-isScroll-scroller">
                    {this.props.children}
                </div>
            </div>
        )
    }
};

export default ReactIscroll;