require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
//原本的 react package 被拆分为 react 及 react-dom 两个 package。其中 react package 
//中包含 React.createElement、 .createClass、 .Component， .PropTypes， .Children 这些 API，
//而 react-dom package 中包含 ReactDOM.render、 .unmountComponentAtNode、 .findDOMNode。
import ReactDOM from 'react-dom';

import ImgFigure from './ImgFigure';
import ControllerUnits from './controllerUnits';
import { getRangeRandom, get30DegRandom } from './function';

//获取图片相关数据
let imageDatas = require('../data/imageDatas.json');

//利用自执行函数，将图片信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr){
  for(var i = 0,j = imageDatasArr.length;i < j;i++){
    var singleImageData = imageDatasArr[i]

    singleImageData.imageURL = require('../images/' + singleImageData.fileName);

    imageDatasArr[i] = singleImageData;
  }

  return imageDatasArr;
})(imageDatas);


//let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {

  //React在ES6的实现中去掉了getInitialState这个hook函数，规定state在constructor中实现，如下：
 // 存储图片排布的可取值范围，设置为常量
  constructor(props) {
    super(props);
    this.Constant = {
      centerPos: {
        left: 0,
        top: 0
      },
      hPosRange: {   // 左右两部分的取值范围
        leftSecX: [0,0],
        rightSecX: [0,0],
        y: [0,0]
      },
      vPosRange: {   // 上部分的取值范围
        x: [0,0],
        topY: [0,0]
      }
    };

    // 初始化state，图片的left\top位置
    this.state = {
      imgsArrangeArr: [
        // {
        //   pos:{
        //     left: 0,
        //     top: 0
        //   },
        //   rotate: 0,   // 图片的旋转角度
        //   isInverse: false   // 设置图片是否翻转的状态
        //   isCenter: false   // 默认图片不居中
        // }
      ]
    }
  }
/*
getInitialState(){
  return {
    imgsArrangeArr:[
      {
        pos:{
          left:0,
          top:0
        }
        
      }
    ]
  };
};
*/

Constant = {
  centerPos:{
    left:0,
    right:0
  },
  hPosRange:{//水平方向取值范围
    leftSecX:[0,0],
    rightSecX:[0,0],
    y:[0,0]

  },
  vPosRange:{ //垂直方向取值范围
    x:[0,0],
    topY:[0,0]
  }

};

/**
 * 翻转图片
 * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
 * @return {Function} 这是一个闭包函数，其内return一个真正待贝执行的函数
 */
  inverse (index) {
    
    return function(){
      console.log("翻转图片");
      console.log(index);
      let imgsArrangeArr = this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;  // 翻转取反
      
      this.setState({
        imgsArrangeArr: imgsArrangeArr  // 触发视图的重新渲染
      });

    }.bind(this);
  }

  /*
   * 当非居中的图片被点击时，利用rearrange函数，居中对应index的图片
   * @param index，需要被居中的图片信息数组中的index值
   * @return {function} (return一个闭包函数)
   */
  center (index) {
    
    return function () {
      console.log("当非居中的图片被点击时，利用rearrange函数，居中对应index的图片");
      console.log(index);
      this.rearrange(index)
    }
  }

/*
重新布局所有图片
@param centerIndex 指定居中排布的图片
 */
rearrange = function(centerIndex){

  var imgsArrangeArr = this.state.imgsArrangeArr,
  Constant = this.Constant,
  centerPos = Constant.centerPos,
  hPosRange = Constant.hPosRange,
  vPosRange = Constant.vPosRange,
  hPosRangeLeftSecX = hPosRange.leftSecX,
  hPosRangeRightSecX = hPosRange.rightSecX,
  hPosRangeY = hPosRange.y,
  vPosRangeTopY = vPosRange.topY,
  vPosRangeX = vPosRange.x,

  imgsArrangeTopArr = [],
  topImgNum = Math.ceil(Math.random() * 2),

  topImgSpliceIndex = 0,

  imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

  // 居中centerIndex的图片的位置，不需要旋转
  imgsArrangeCenterArr[0] = {
    pos: centerPos,
    rotate: 0,
    isCenter: true
  }

  //取出要布局上侧的图片的状态信息
  topImgSpliceIndex =  Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
  imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

  //布局位于上册的图片
  imgsArrangeTopArr.forEach(function(value,index){
      imgsArrangeTopArr[index]= {
        pos:{
          top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
          left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
        },
        rotate:get30DegRandom(),
        isCenter: false
      }
  });

  //布局左右两侧的图片
  for(var i = 0,j = imgsArrangeArr.length,k = j /2;i < j;i++){
      var hPosRangeLORX = null;

      //前半部分布局左边，右半部份布局右边
      if(i < k){
          hPosRangeLORX = hPosRangeLeftSecX;
      }else{
          hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i] ={
        pos:{
          top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
          left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
        },
        rotate:get30DegRandom(),
        isCenter: false
      }
      
  }

  if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
  }  

  imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
  this.setState({
    imgsArrangeArr:imgsArrangeArr
  });

};

//组将加载以后，为每张图片计算其位置的范围
componentDidMount(){
    var stageDom = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = Math.ceil(stageW/2),
        halfStageH = Math.ceil(stageH/2);

    //拿到一个imageFigure的大小
    var imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDom.scrollWidth,
        imgH = imgFigureDom.scrollHeight,
        halfImgW = Math.ceil(imgW/2),
        halfImgH = Math.ceil(imgH/2);

    //计算中心图片的位置点
    this.Constant.centerPos = {
      left:halfStageW - halfImgW,
      top:halfStageH - halfImgW
    }
    //计算左侧，右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  };
  

  render(){

    var controllerUnits = [];
    var imgFigures = [];
    imageDatas.forEach(function(value,index) {

      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos:{
            left:0,
            top:0
          },
          rotate:0,
          isInverse:false,
          isCenter: false
        }
      }

      imgFigures.push(
        <ImgFigure 
            key={index}
            data={value} 
            ref={'imgFigure' + index} 
            arrange={this.state.imgsArrangeArr[index]}
            inverse={this.inverse(index)}
            center={this.center(index).bind(this)}
            />
      );

      controllerUnits.push(
        <ControllerUnits
          key={index}
          arrange={this.state.imgsArrangeArr[index]}
          inverse={this.inverse(index)}
          center={this.center(index).bind(this)}
        />
      )
    }.bind(this));

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

AppComponent.defaultProps = {
};

export default AppComponent;
