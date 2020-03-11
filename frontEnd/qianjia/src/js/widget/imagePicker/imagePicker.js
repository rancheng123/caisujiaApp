import './imagePicker.scss'

import React, { Component, PropTypes } from 'react';
import { ImagePicker } from 'antd-mobile';



class ImagePickerExample extends React.Component {

    componentWillMount(){
        this.state={

        }
    };

    componentDidMount(){
        // 存储 start
        componentStore.set(this);
        // 存储 end
    };
    componentWillUnmount(){
        // 清除 start
        componentStore.clear(this);
        // 清除 end
    };

    onChange(files, type, index){
        this.props.onChange && this.props.onChange(files, type, index);
    }
    render() {
        const { files } = this.props;

        return (
            <div>
                <ImagePicker
                    prefixCls="am-image-picker"
                    files={files}
                    onChange={this.onChange.bind(this)}
                    onImageClick={(index, fs) => {
                        console.log(index, fs)
                    }}
                    selectable={files.length < 5}
                />
            </div>
        );
    }
}

export default ImagePickerExample;