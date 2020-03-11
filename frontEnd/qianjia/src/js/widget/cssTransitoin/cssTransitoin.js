
import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './cssTransiton.scss'


class CssTransitoin extends Component{
    constructor(){
        super()
    }
    render(){
        return (
            <div>
                <ReactCSSTransitionGroup transitionName={this.props.transitionName}
                                         transitionEnterTimeout={this.props.transitionEnterTimeout}
                                         transitionLeaveTimeout={this.props.transitionLeaveTimeout}>
                        {this.props.children}
                </ReactCSSTransitionGroup>
            </div>
        )
    }
};

export default CssTransitoin;