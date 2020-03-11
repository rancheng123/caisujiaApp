// 使用实例

import React, { Component, PropTypes } from 'react';
import Dialog from '../../../widget/dialog/dialog';


class Demo extends Component{
    constructor(){
        super()
    };

    closeDialog(){

    }
    press(){

        var dialog_test = componentStore.modules['dialog-test'];
        dialog_test.state.visible = false;
        dialog_test.setState(dialog_test.state)

        var dialog_test2 = componentStore.modules['dialog-test2'];
        dialog_test2.state.visible = true;
        dialog_test2.setState(dialog_test2.state)
    }

    render(){
        var that  = this;
        return (
            <div>
                <Dialog
                    $id="dialog-test"
                    title="温情提示11"
                    footer_Text="确定"
                    footer_onPress={that.press}
                >
                    您的余额不足1112222<br />
                    请充值.<br />
                </Dialog>

                <Dialog
                    $id="dialog-test2"
                    title="温情提示2222"
                    footer_Text="确定"
                    footer_onPress={that.press}
                >
                    222222222222222<br />
                    请充值.<br />
                </Dialog>
            </div>
        )
    }
}

export default Demo;