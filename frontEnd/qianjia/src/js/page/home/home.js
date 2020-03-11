import React, { Component, PropTypes } from 'react';
//导入样式 start
import './home.scss'
//导入样式 end
import TitleBar from '../../module/titleBar/titleBar';

//渲染进程 载入主进程代码  start
import electron, { ipcRenderer ,remote } from 'electron';
window.remote = remote;

var home_main = remote.require('/Users/deo/WebstormProjects/知识/JS/第三方工具/nodeJS学习/electron/electronStudy3/Qianjia/frontEnd/qianjia/src/js/page/home/home_main.js')



//  如果bb方法执行失败， 报错Could not call remote function 'bb'
home_main.bb()
//渲染进程 载入主进程代码  end






var ipc = electron.ipcRenderer

ipc.on('error-msg', (event, msg) => {
    debugger
    let elem = document.querySelector('#app-msg')
    elem.innerText = msg
    elem.setAttribute('style', '')
    elem.setAttribute('class', 'app-error-msg')

    setTimeout(() => {
        elem.setAttribute('style', 'display:none')
    }, 3000)

    // window.alert(msg)
})


class Home extends Component{
    constructor(){
        super();
    }
    componentWillMount(){
        //在此处初始化状态
        this.state={
            devToolsStatus: false
        }
    }

    componentDidMount(){
        var that = this;
        // 存储 start
        componentStore.set(this);
        // 存储 end
    };
    componentWillUnmount(){
        // 清除 start
        componentStore.clear(this);
        // 清除 end
    };
    render(){
        var that = this;

        return (
            <div className="homeModule">
                <TitleBar $id="titleBar">


                   
                    <div className="flex-child1 title">冉成的店铺</div>


                    <div onClick={()=>{
                        componentStore.update(that,{
                            devToolsStatus: !that.state.devToolsStatus
                        })




                        ipcRenderer.send('switchDevToolsStatus', that.state.devToolsStatus)
                    }}
                        style={{color:that.state.devToolsStatus?'green':'red'}}
                    >
                        调试工具{that.state.devToolsStatus}
                    </div>


                    <div onClick={()=>{
                        ipcRenderer.send('test-sign', 1)
                    }}>
                        测试 按钮
                    </div>

                </TitleBar>


                <div>
                    渲染进程 可以使用nodeJS 的任何api
                </div>

                <div id={'wrap'} style={{marginTop: 100}}>
                    <div>
                        node 版本：   {process.versions.node}
                    </div>
                    <div>
                        electron 版本：   {process.versions.electron}
                    </div>
                    <div>
                        NODE_MODULE_VERSION 版本：   {process.versions.modules}
                    </div>
                    <div>
                        chrome 版本：   {process.versions.chrome}
                    </div>
                </div>



                <br/><br/>

                <div>
                    获取package.json:
                    {(()=>{
                        //获取package.json
                        var packageJson = remote.require("./package.json");
                        return packageJson.name
                    })()}
                </div>


                <div>
                    获取process:
                    {(()=>{

                        return process.cwd()
                    })()}
                </div>


                <div>
                    可以使用nodeJS 中的任何模块
                    {(()=>{

                        var cluster = require('cluster');
                        console.log(cluster)

                    })()}
                </div>






                

            </div>
        )
    }

}

export default Home;
