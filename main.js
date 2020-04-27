var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

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
    
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  resizeObserver.observe(canvas);
}

var clearCanvas=function(){
    ctx.clearRect(0, 0, getCanvasWidth(), getCanvasHeight());
};

var drawBackground=function(){
  ctx.fillStyle="#000000";
  ctx.rect(0, 0, getCanvasWidth(), getCanvasHeight());
  ctx.fill();
};
var drawBackgroundCircle=function(){
  ctx.fillStyle="#FFFFFF";
  ctx.beginPath();
  ctx.arc(getXCenter(), getYCenter(), getRadius()+5, getRadiansStartCicle(),getRadiansEndCicle());
  ctx.fill();
};

var drawCircle=function(){
  ctx.beginPath();
  ctx.arc(getXCenter(), getYCenter(), getRadius(), getRadiansStartCicle(),getRadiansEndCicle());
  ctx.stroke();
}

var findCoordPontOnCircle =function(pointAngleInRadians){
  var x = Math.cos(pointAngleInRadians) * getRadius();
  var y = Math.sin(pointAngleInRadians) * getRadius();
  return {x:x,y:y};
}

var nbToRgbStyle=function(C){
  var offset =100;
  var maxSize=256-100;
  // var B = (C % maxSize)+offset;
  // var G = (((C-B)/maxSize) % maxSize)+offset;
  // var R = (((C-B)/maxSize**2) - G/maxSize)+offset;
  var R =((maxSize+C+ offset*1)%maxSize);
  var G =((maxSize+C+ offset*2)%maxSize);
  var B =((maxSize+C+ offset*3)%maxSize);
  var rgbStyle="rgb("+R+","+G+","+B+")";
  return rgbStyle;
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
    var pointAngleInRadians2=radianTable[(i*times)%numberOfPointOnCircle];
    var coord1=findCoordPontOnCircle(pointAngleInRadians1);
    var coord2=findCoordPontOnCircle(pointAngleInRadians2);
    ctx.beginPath();
    ctx.moveTo(coord1.x+getXCenter(), coord1.y+getYCenter());
    ctx.lineTo(coord2.x+getXCenter(), coord2.y+getYCenter());
    ctx.stroke();
  }

};
var numberOfPointOnCircle=400;
var timesTable=1;
var color=0;

var draw=function(timesTable,color){
  setTimeout(function(){
    timesTable++;
    color+=20;
    clearCanvas();
    drawBackground();
    drawBackgroundCircle();
    ctx.strokeStyle=nbToRgbStyle(color);
    drawCircle();
    drawLines(numberOfPointOnCircle,timesTable);
    draw(timesTable,color);
  },100);
}


draw(timesTable,color);
