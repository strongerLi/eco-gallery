import React, { Component } from 'react';

class ControllerUnit extends Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick (e) {
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else {
            this.props.center();
        }
        e.preventDefault();
        e.stopPropagation();
    }
    render() {
        let unitClassName = 'controller-unit';
        unitClassName += this.props.arrange.isCenter ? ' is-center' :'';
        unitClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

        return (
            <span className={unitClassName} onClick={this.handleClick}/>
        )
    }
}
export default ControllerUnit;