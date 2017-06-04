require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
//原本的 react package 被拆分为 react 及 react-dom 两个 package。其中 react package 
//中包含 React.createElement、 .createClass、 .Component， .PropTypes， .Children 这些 API，
//而 react-dom package 中包含 ReactDOM.render、 .unmountComponentAtNode、 .findDOMNode。
var ReactDOM = require('react-dom');

//获取图片相关的数据
var imageDatas = require('../data/imageDatas.json');

//利用自执行函数，将图片信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr){
  for(var i = 0,j = imageDatasArr.length;i < j;i++){
    var singleImageData = imageDatasArr[i]

    singleImageData.imageURL = require('../images/' + singleImageData.fileName);

    imageDatasArr[i] = singleImageData;
  }

  return imageDatasArr;
})(imageDatas);

class ImgFigure extends React.Component{

/**
 * imgFigure点击处理函数
 */
handleClick = function(e){
  this.props.inverse();

  e.stopPropagation();
  e.preventDefault();
}

  render(){

    var styleObj = {};

    //如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }
    //console.log(styleObj);

    //如果图片的旋转骄傲都有值并且部位0，添加旋转角度
    if(this.props.arrange.rotate){
      (['MozT','msT','OT','WebkitT','t']).forEach(
        (value,index)=>styleObj[value+'ransform'] = 'rotate('+this.props.arrange.rotate+'deg)'
      );
    }

    var imgFigureClassName = "img-figure";
        imgFigureClassName += this.props.arrange.isInverse? ' is-inverse':'';

    return (
      <figure className={imgFigureClassName} style = {styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL}
          alt={this.props.data.title} className="image-detail"/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>{this.props.data.desc}</p>
          </div>
        </figcaption>
      </figure>

    )
  }
};

/*
获取区间内的一个随机值
 */
function getRangeRandom(low,high){
  return Math.ceil(Math.random() * (high - low) + low);
}

/**
 * 获取 0-30°之间的一个任意正负值
 */
function get30DegRandom(){
  return ((Math.random() > 0.5?'':'-') + Math.ceil(Math.random() * 30));
}

//let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {

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
inverse = function (index){
    return function(){
        var imgsArrangeArr = this.state.imgsArrangeArr;

        imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

        this.setState({
          imgsArrangeArr:imgsArrangeArr
        })
    }.bind(this);
};

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

  //首先居中 centerIndex 的图片
  imgsArrangeCenterArr[0].pos = centerPos;
  //Console.log("中间图片的坐标")
  
  //中间的图片图片不需要旋转
  imgsArrangeCenterArr[0].rotate = 0;

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
        rotate:get30DegRandom()
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
      console.log("调用rearrange"  + i);
      console.log(hPosRangeLeftSecX);
      console.log(hPosRangeRightSecX);

      imgsArrangeArr[i] ={
        pos:{
          top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
          left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
        },
        rotate:get30DegRandom()
      }
      
      console.log(getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1]));
  }

  if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
  }  

  imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
  console.log("调用rearrange" );
  console.log(imgsArrangeArr);
  this.setState({
    imgsArrangeArr:imgsArrangeArr
  });

};
//React在ES6的实现中去掉了getInitialState这个hook函数，规定state在constructor中实现，如下：
constructor(props) {
    super(props);
    this.state = {
    imgsArrangeArr:[
      /*{
        pos:{
          left:0,
          top:0
        }
        rotate:0//旋转角度
        isInverse:false//图片正反面
      }*/
    ]
  };
};
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
//组将加载以后，为每张图片计算其位置的范围
componentDidMount(){
    var stageDom = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = Math.ceil(stageW/2),
        halfStageH = Math.ceil(stageH/2);
    //console.log("componentDidMount");
    //console.log("stageW" + stageW);
    //console.log("stageH" + stageH);

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
    //console.log(imageDatas);
    imageDatas.forEach(function(value,index) {

      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos:{
            left:0,
            top:0
          },
          rotate:0,
          isInverse:false
        }
      }

      imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} 
                          arrange={this.state.imgsArrangeArr[index]}
                          inverse={this.inverse(index)}/>);
      //console.log("循环组合图片组件====" + index);
      //console.log("====" + this.state.imgsArrangeArr[index].pos.top);
      //console.log("====" + this.state.imgsArrangeArr[index].pos.left);
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
