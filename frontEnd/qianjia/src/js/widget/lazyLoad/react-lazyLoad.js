import React, { Component, PropTypes } from 'react';
import LazyLoader from './lazyloader';


class ReactLazyLoader extends Component{
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


        LazyLoader(document.getElementById('reactLazyWrap'))
    };
    componentWillUnmount(){
        // 存储 start
        componentStore.clear(this);
        // 存储 end
    };

    render(){

        var that = this;
        return (
            <div id="reactLazyWrap" style={{height:'100%',width: '100%'}}>
                {this.props.children}
            </div>
        )
    }
};

export default ReactLazyLoader;