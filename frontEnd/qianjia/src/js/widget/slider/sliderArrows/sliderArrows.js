import React, { Component, PropTypes } from 'react';
import { Router, Route, Link ,hashHistory} from 'react-router';

class SliderArrows extends Component{
  constructor(props) {
    super(props);
  }

  handleArrowClick(option) {
    if (this.props.isPlay){
        this.props.turn(option);
    }
  }

  render() {
    return (
      <div className="slider-arrows-wrap">
        <span
          className="slider-arrow slider-arrow-left"
          onClick={this.handleArrowClick.bind(this, -1)}>
          &lt;
        </span>
        <span
          className="slider-arrow slider-arrow-right"
          onClick={this.handleArrowClick.bind(this, 1)}>
          &gt;
        </span>
      </div>
    );
  }
}
export default SliderArrows;