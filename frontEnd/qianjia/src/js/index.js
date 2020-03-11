
// tag before tokenExprex


require('../scss/base/base.scss');
require('../scss/base/common.scss');
require('../scss/font.scss');
require('../scss/base/commonModule.scss');

require('../scss/icon/icon.scss');
require('../scss/button/button.scss');




//react
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link ,browserHistory} from 'react-router';
//组件管理器
import {} from './asset/config';
import {} from './asset/componentStore';
import {} from './asset/utils';
import {} from './asset/interface';


//首页home
const home = (location, callback)=>{
    require.ensure([],require=>{
        callback(null,require('./page/home/home').default)
    },'home')
}


const cityList = (location, callback)=>{
    require.ensure([],require=>{
        callback(null,require('./page/cityList/cityList').default)
    },'cityList')
}


renderRoute()
function renderRoute(){
    render((
        <div>
            <Router history={browserHistory}>


                {/*业务模块路由  start */}
                <Route title="钱夹" path="/" getComponent={home}></Route>
                <Route title="钱夹" path="/home" getComponent={home}></Route>
                <Route title="选择城市" path="/cityList" getComponent={cityList}></Route>
               

            </Router>
        </div>

    ), document.getElementById('app'));
}
