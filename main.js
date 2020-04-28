var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width  = (screen & screen.width)?screen.width:window.innerWidth;
canvas.height = (screen & screen.height)?screen.height:window.innerHeight;

var getCanvasWidth=function(){
  return canvas.width;
}
var getCanvasHeight=function(){
  return canvas.height;
}

var getXCenter=function(){
  return (getCanvasWidth()/2);
}
var getYCenter=function(){
  return (getCanvasHeight()/2);
}

var getRadius =function(){
  return Math.min(getCanvasWidth(),getCanvasHeight())/2-20;
}

var getRadiansStartCicle=function(){
  return 0;
}
var getRadiansEndCicle=function(){
  return 2 * Math.PI;
}
var getRadiansFullCicle=function(){
  return 2 * Math.PI;
}

if(ResizeObserver) {
  var resizeObserver = new ResizeObserver(function(entries) {

    canvas.width  = (screen & screen.width)?screen.width:window.innerWidth;
    canvas.height = (screen & screen.height)?screen.height:window.innerHeight;
  });

  resizeObserver.observe(document.body);
}

var clearCanvas=function(){
    ctx.clearRect(0, 0, getCanvasWidth(), getCanvasHeight());
};

var drawBackground=function(){
  ctx.fillStyle="#000000";
  ctx.rect(0, 0, getCanvasWidth(), getCanvasHeight());
  ctx.fill();
};
var drawBackgroundCircle=function(color,x,y,radius,radiansStart,radiansEnd){
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.arc(x,y,radius,radiansStart,radiansEnd);
  ctx.fill();
};

var drawCircle=function(x,y,radius,radiansStart,radiansEnd){
  ctx.beginPath();
  ctx.arc(x,y,radius,radiansStart,radiansEnd);
  ctx.stroke();
}

var findCoordPontOnCircle =function(pointAngleInRadians){
  var x = Math.cos(pointAngleInRadians) * getRadius();
  var y = Math.sin(pointAngleInRadians) * getRadius();
  return {x:x,y:y};
}

var nbToHslStyle=function(C){
  var maxSize=350;
  var H =(C%maxSize);
  var S =100;
  var L =40;

  var hslStyle="hsl("+H+","+S+"%,"+L+"%)";
  return hslStyle;
}



var drawLines=function(numberOfPointOnCircle,times){
  var baseRadian=getRadiansFullCicle()/numberOfPointOnCircle;
  var radianTable=[];
  for(var i=0;i<numberOfPointOnCircle;i++){
    var pointAngleInRadians=baseRadian*i;
    radianTable.push(pointAngleInRadians);
  }



  for(var i=0;i<numberOfPointOnCircle;i++){
    var pointAngleInRadians1= radianTable[i];
    var pointAngleInRadians2=radianTable[Math.floor((i*times))%numberOfPointOnCircle];
    var coord1=findCoordPontOnCircle(pointAngleInRadians1);
    var coord2=findCoordPontOnCircle(pointAngleInRadians2);
    ctx.beginPath();
    ctx.moveTo(coord1.x+getXCenter(), coord1.y+getYCenter());
    ctx.lineTo(coord2.x+getXCenter(), coord2.y+getYCenter());
    ctx.stroke();
  }

};


var numberOfPointOnCircle=250;
var timesTable=1;
var color=0;
var colorToAdd=1;
var speed=30;
var draw=function(timesTable,color){
  setTimeout(function(){
      timesTable+=0.01;
      color=color+colorToAdd;
      timesTable=Math.round((timesTable + Number.EPSILON) * 100) / 100;
      clearCanvas();
      drawBackground();
      ctx.strokeStyle=nbToHslStyle(color);
      drawBackgroundCircle("#FFFFFF",getXCenter(), getYCenter(), getRadius()+5, getRadiansStartCicle(),getRadiansEndCicle());
      drawCircle(getXCenter(), getYCenter(), getRadius(), getRadiansStartCicle(),getRadiansEndCicle());
      drawLines(numberOfPointOnCircle,timesTable);
      requestAnimationFrame(draw.bind(this,timesTable,color));
  },1000/speed);
}


draw(timesTable,color);
