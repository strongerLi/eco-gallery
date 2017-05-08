import React, { Component } from 'react';

class ImgFigure extends Component {
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
        var  styleObj = {};
        if(this.props.arrange.pos){
            styleObj = this.props.arrange.pos;
        }
        if(this.props.arrange.rotate){
            styleObj['transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
        }
        let imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

        if(this.props.arrange.isCenter){
            styleObj.zIndex = 20
        }

        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                <img
                    src={this.props.data.imageUrl}
                    alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">
                        {this.props.data.title}
                    </h2>
                    <div className="img-back">
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>
        )
    }
}
export default ImgFigure;