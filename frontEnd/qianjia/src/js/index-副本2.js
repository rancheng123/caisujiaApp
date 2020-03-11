
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




/* 业务模块  start */

const App = (location, callback)=>{
    require.ensure([],require=>{
        callback(null,require('./page/app').default)
    },'app')
}
const login = (location, callback)=>{
    require.ensure([],require=>{
        callback(null,require('./page/login/login').default)
    },'login')
}

const regist = (location, callback)=>{
    require.ensure([],require=>{
        callback(null,require('./page/regist/regist').default)
    },'regist')
}



const routes = {
    //path: '/',
    //getComponent: App,
    indexRoute: { getComponent: login },
    childRoutes: [
        {
            path: '/login',
            title: '登录',
            getComponent: login
        },
        {
            path: '/regist',
            title: '注册',
            getComponent: regist,
        }
    ]
}



render((
    <div>
        <Router history={browserHistory} routes={routes} ></Router>
    </div>

), document.getElementById('app'));
