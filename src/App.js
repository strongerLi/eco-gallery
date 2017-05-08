import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import './styles/main.css';
import ImgFigure from './component/imgfigure';
import ControllerUnite from './component/controller-unit'

let imagesData = require('./data/imageDatas.json')
imagesData = (function (imageDataArr) {
  for (let i = 0; i < imageDataArr.length; i ++){
    let singleImageData = imageDataArr[i];
    singleImageData.imageUrl = require('./images/' + imageDataArr[i].fileName);
    imageDataArr[i] = singleImageData;
  }
  return imageDataArr;
})(imagesData);

function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low)
}
function get30DegRandom() {
  return (Math.random() > 0.5 ? "" : "-") + Math.ceil(Math.random()*30)
}


class App extends Component {
  constructor(props) {
    super(props);
    this.constant = {
      centerPos: {
        left: 0,
        top: 0
      },
      hPosRange: {
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: {
        topY: [0, 0],
        x: [0, 0]
      }
    };
    this.state = {
      imgArrangeArr: []
    };
    this.isInverse = this.isInverse.bind(this);
    this.isCenter = this.isCenter.bind(this)
  }
  //重新布局所有图片的位置
  rearrange (centerIndex) {
    let imgArrangeArr = this.state.imgArrangeArr,
        constant = this.constant,
        centerPos = constant.centerPos,
        hPosRange = constant.hPosRange,
        vPosRange = constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,
        imgArrangeTopArr = [],
        topImgNum = Math.floor(Math.random()*2),
        topImgSpliceIndex = 0,
        imgArrangeCenterArr = imgArrangeArr.splice(centerIndex, 1);
    //居中 centerindex 的图片
    imgArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    };


  //取出要布局到上侧的图片
    topImgSpliceIndex = Math.ceil(Math.random()*imgArrangeArr.length - topImgNum);

    imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex, topImgNum);
    imgArrangeTopArr.forEach(function (value, index) {
      imgArrangeTopArr[index] = {
        pos: {
          top:getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left:getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    });
  //  布局两侧的图片
    for(let i = 0,j = imgArrangeArr.length, k = j/2; i <j; i++){
      let hPosRangeLORX = null;

      if(i < k){
        hPosRangeLORX = hPosRangeLeftSecX
      }else{
        hPosRangeLORX = hPosRangeRightSecX
      }

      imgArrangeArr[i] = {
        pos: {
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1]),
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    }

    if(imgArrangeTopArr && imgArrangeTopArr[0]){
      imgArrangeArr.splice(topImgSpliceIndex, 0,imgArrangeTopArr[0])
    }
    imgArrangeArr.splice(centerIndex, 0, imgArrangeCenterArr[0])
    this.setState({
      imgArrangeArr: imgArrangeArr
    });
  }

  isInverse (index) {
    return function () {
      let imgArrangeArr = this.state.imgArrangeArr;
      imgArrangeArr[index].isInverse = !imgArrangeArr[index].isInverse;
      this.setState({
        imgArrangeArr:imgArrangeArr
      })
    }.bind(this)
  }

  isCenter (index) {
    return function () {
      this.rearrange(index)
    }.bind(this)
  }

  componentDidMount() {
    //拿到舞台的大小
    // console.log(this.state.imgArrangeArr);
    let stageDom = this.refs.stage,
        stageW = stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);
  //  拿到一个图片的大小
    let imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDom.scrollWidth,
        imgH = imgFigureDom.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);
    //生成坐标
    this.constant = {
      centerPos: {
        left: halfStageW - halfImgW,
        top: halfStageH - halfImgH
      },
      hPosRange: {
        leftSecX: [-halfImgW, halfStageW - halfImgW*3],
        rightSecX: [halfStageW + halfImgW, stageW - halfImgW],
        y: [-halfImgH, stageH - halfImgH]
      },
      vPosRange: {
        topY: [-halfImgH, halfStageH - halfImgH*3],
        x: [halfStageW - imgW, halfStageW]
      }
    };
    this.rearrange(0);
  }
  render() {
    const imgFigures = imagesData.map((data, index) => {
      if(!this.state.imgArrangeArr[index]){
        this.state.imgArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter:false
        }
      }
      return <ImgFigure
          data={data}
          key={index}
          ref={'imgFigure' + index}
          arrange={this.state.imgArrangeArr[index]}
          inverse={this.isInverse(index)}
          center={this.isCenter(index)}
      />
    });
    const controllerUnits = imagesData.map((data, index) =>
      <ControllerUnite
      data={data}
      key={index}
      arrange={this.state.imgArrangeArr[index]}
      inverse={this.isInverse(index)}
      center={this.isCenter(index)}
      />
    )
    return (
        <section className="stage" ref="stage">
          <section className="img-sec">
            {imgFigures}
          </section>
          <nav className="controller-nav">
            {controllerUnits}
          </nav>
        </section>
    );
  }
}

export default App;

