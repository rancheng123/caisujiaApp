/* eslint no-console:0, react/no-multi-comp:0 */


import React, { Component, PropTypes } from 'react';
import 'rmc-picker/assets/index.css';
import 'rmc-cascader/assets/index.css';
import 'rmc-picker/assets/popup.css';
import './picker.scss'

import PopupCascader from 'rmc-cascader/lib/Popup';
import Cascader      from 'rmc-cascader';
import arrayTreeFilter from 'array-tree-filter';



class Dome extends Component{
    constructor(){
        super()
    }

    componentWillMount(){

        this.state={
            defaultValue: this.props.defaultValue,
            globalData: this.props.title.data,
            title: this.props.title,
            data: this.props.data
         }
    }
    componentDidMount(){
        var that = this;
        // 存储 start
        componentStore.set(this);
        // 存储 end
    };
    componentWillUnmount(){
        // 存储 start
        componentStore.clear(this);
        // 存储 end
    };

    compileData(idArr){
        var globalData = this.props.data;
        if (!idArr) {
            var response = null;
        }else{
            const treeChildren = arrayTreeFilter(globalData, (c, level) => {
                return c.value === idArr[level];
            });
            var textArr = treeChildren.map((v) => {
                return v.label;
            });



            var response = {
                idArr: idArr,
                textArr: textArr
            };
        }

        this.props.onYes(response)

    }

    render(){
        const cascader = (
            <Cascader
                rootNativeProps={{'data-xx':'yy'}}
                onChange={this.props.onChange}
                data={this.props.data}
                cols={this.props.cols}
            />
        );

        return (
            <div>

                {/*此处的onChange  相当于ok*/}
                <PopupCascader
                    cascader={cascader}
                    value={this.state.defaultValue}
                    onDismiss={this.onDismiss}
                    onChange={this.compileData.bind(this)}
                    title={this.state.title}
                    className={this.props.className|| 'picker_self'}
                    dismissText={'取消'}
                    okText={"确定"}
                >
                    <div>
                        {this.props.children}
                    </div>
                </PopupCascader>
            </div>
        );
    }
}


export default Dome;



