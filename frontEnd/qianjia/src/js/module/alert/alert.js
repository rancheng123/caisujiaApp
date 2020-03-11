/*
    目前只做了标准弹窗，并且功能还未添加全
    调用方式如下：
    Alert({
        //标准弹窗
        type:'', //参数：standard(标准) simple(简单)

        //控制显示隐藏
        display:  '', //参数："block" "none"

        //标题
        title:'', //参数：字符串

         //描述
        desc:'',  //参数(可选)：字符串

        //设置id
       id:'',  //参数(可选)：字符串 (用于操作弹窗窗口)

        //底部按钮；
        button:[  //参数(可选)：json
            {
                text:'下次再说',
                handle:()=>{
                    componentStore.update(this,{alertDisplay : 'none'});
                }
            },
            {text:'立即绑定'}
        ]

    });
*/


import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

//导入样式 start
import './alert.scss'
//导入样式 end
var id = 'alert';   //给弹窗设置id
class Standard extends Component{

    componentWillMount(){

        //在此处初始化状态

    }
    componentDidMount(){

    }
    render(){
        let param = this.props;
        return(
            <div className="g-alert">
                <div className={param.type=="standard"?"g-standard":"g-simple"}>
                    <div className="g-b-top">
                        <div className="g-circle">
                            <span className="g-c-icon g-kaihu"></span>
                        </div>
                    </div>
                    <div className="g-content">
                        <h3 className="g-title" style={{display:param.title?'block':'none'}}>{param.title}</h3>
                        <p className="g-desc" style={{display:param.desc?'block':'none'}}>{param.desc}</p>
                    </div>
                    <div className="g-btn-box" style={{display:param.button?"block":"none"}}>
                        <div className="g-btn-mian">
                            <span
                                className={param.button.length==1?'g-btn g-btn-last':'g-btn g-btn-first'}
                                style={{display:param.button.length!=0?'block':'none'}}
                                onTouchEnd={(ev)=>{

                                    param.button[0].handle();

                                    var oAlert = document.getElementById(id);
                                    document.body.removeChild(oAlert);

                                    ev.preventDefault();

                                }}
                            >
                                {param.button&&param.button[0].text?param.button[0].text:''}
                            </span>
                            <span
                                className="g-btn g-btn-last"
                                style={{display:param.button.length==2?'block':'none'}}
                                onTouchEnd={(ev)=>{

                                    param.button[1].handle();

                                    var oAlert = document.getElementById(id);
                                    document.body.removeChild(oAlert);

                                    ev.preventDefault();
                                }}
                            >
                                {param.button&&param.button.length==2&&param.button[1].text?param.button[1].text:''}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

// class Simple extends Component{
//
//     componentWillMount(){
//         console.log('componentWillMount',this.props);
//         //在此处初始化状态
//         this.state = {
//         }
//     }
//     componentDidMount(){
//         console.log('componentDidMount',this.props);
//     }
//     render(){
//         let param = this.props;
//         return(
//             <div className="g-alert" style={{display:this.props.display}}>
//                 <div className="g-simple">
//                     <div className="g-content">
//                         <h3 className="g-title">{param.title}</h3>
//                         <p className="g-desc">{param.desc}</p>
//                     </div>
//                     <div className="g-btn-box">
//                         <span className="g-btn">{param.button[0].text}</span>
//                         <span className="g-btn">{param.button[1].text}</span>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }

let  Alert = (json)=>{
    let wrap = document.createElement('div');
    if(json.id){
        id = json.id;
    }
    wrap.setAttribute("id",id);
    ReactDOM.render(<Standard {...json} />, wrap);

    document.body.appendChild(wrap);
}

export default Alert;
