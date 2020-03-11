import React, { Component, PropTypes } from 'react';
import { Modal, Button, WhiteSpace, WingBlank } from 'antd-mobile';

import './dialog.scss'

class Dialog extends Component{
    constructor(){
        super();
        //设置初始状态，防止this.state为null报错
        this.state = {
            //控制组件的显示隐藏
            visible: true
        };
    };
    componentDidMount(){
        // 存储 start
        componentStore.set(this);
        // 存储 end
    };
    componentWillUnmount(){
        // 存储 start
        componentStore.clear(this);
        // 存储 end
    };

    render(){

        var that = this;
        var props = that.props;

        //标题
        var title = props.title;
        //显示隐藏（状态控制）
        var visible = that.state.visible;
        //确定按钮
        var footer_onPress = props.footer_onPress;




        return (
            <div className="dialog_self">
                <Modal
                    title={title}
                    transparent
                    maskClosable={false}
                    visible={visible}
                    onClose={props.onClose}
                    footer={[{ text: props.footer_Text, onPress: function(){
                        footer_onPress();
                    } }]}
                >
                    <div className="dialog_self_body">
                        {that.props.children}
                    </div>
                </Modal>
            </div>
        )
    }
};

export default Dialog;
