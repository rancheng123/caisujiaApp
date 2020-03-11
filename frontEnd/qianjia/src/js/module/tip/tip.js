/*

*/


import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

//导入样式 start
import './tip.scss'
//导入样式 end

class Tip extends Component{

    componentWillMount(){

        //在此处初始化状态
        this.state = {
        }
    }
    componentDidMount(){

    }
    render(){
        let param = this.props;

        return(
            <div className="tipPage-wrap">
                <div className="tipPage-box">
                    <div className="t-icon">
                        <span className={param.icon} ></span>
                    </div>
                    <h3 className="t-title">{param.title}</h3>
                    <section className="t-desc">
                        <p className="desc-firstline">{param.describe}</p>

                        {(()=>{
                            if(param.phone){
                                return <p>如有疑问请致电客服电话：<a href="tel:400-831-6608" style={{color:"#0a92dd",padding:"0.1rem 0rem"}}>400-831-6608</a></p>
                            }
                        })()}
                    </section>
                    <div className="t-button" style={{display:param.button?"inline-block":"none"}} onTouchEnd={()=>{
                        if(param.url){
                            Utils.switchRoute(param.url);
                        }
                    }}>
                        {param.button?param.button:""}
                    </div>
                </div>
            </div>
        )
    }
}



export default Tip;
