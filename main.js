var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;

var ratio = window.devicePixelRatio || 1;
var width = (screen & screen.width) ? screen.width : window.innerWidth;
var height = (screen & screen.height) ? screen.height : window.innerHeight;

canvas.setAttribute('height', ratio * height);
canvas.setAttribute('width', ratio * width);

canvas.style.height = height + 'px';
canvas.style.width = width + 'px';

ctx.scale(ratio, ratio);


var getCanvasWidth = function() {
  return width;
}
var getCanvasHeight = function() {
  return height;
}

var getXCenter = function() {
  return (getCanvasWidth() / 2);
}
var getYCenter = function() {
  return (getCanvasHeight() / 2);
}

var getRadius = function() {
  return Math.min(getCanvasWidth(), getCanvasHeight()) / 2 - 20;
}

var getRadiansStartCicle = function() {
  return 0;
}
var getRadiansEndCicle = function() {
  return 2 * Math.PI;
}
var getRadiansFullCicle = function() {
  return 2 * Math.PI;
}

try{
  if (ResizeObserver) {
    var resizeObserver = new ResizeObserver(function(entries) {

      ratio = window.devicePixelRatio || 1;
      width = (screen & screen.width) ? screen.width : window.innerWidth;
      height = (screen & screen.height) ? screen.height : window.innerHeight;

      canvas.setAttribute('height', ratio * height);
      canvas.setAttribute('width', ratio * width);

      canvas.style.height = height + 'px';
      canvas.style.width = width + 'px';

      ctx.scale(ratio, ratio);
    });

    resizeObserver.observe(document.body);
  }
}catch(err){
  console.log(err);
}

var clearCanvas = function() {
  ctx.clearRect(0, 0, getCanvasWidth(), getCanvasHeight());
};

var drawBackground = function() {
  ctx.fillStyle = "#000000";
  ctx.rect(0, 0, getCanvasWidth(), getCanvasHeight());
  ctx.fill();
};
var drawBackgroundCircle = function(color, x, y, radius, radiansStart, radiansEnd) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, radiansStart, radiansEnd);
  ctx.fill();
};

var drawCircle = function(x, y, radius, radiansStart, radiansEnd) {
  ctx.beginPath();
  ctx.arc(x, y, radius, radiansStart, radiansEnd);
  ctx.stroke();
}

var findCoordPontOnCircle = function(pointAngleInRadians) {
  var x = Math.cos(pointAngleInRadians) * getRadius();
  var y = Math.sin(pointAngleInRadians) * getRadius();
  return {
    x: x,
    y: y
  };
}

var nbToHslStyle = function(C, S, L) {
  var maxSize = 350;
  var H = (C % maxSize);
  var hslStyle = "hsl(" + H + "," + S + "%," + L + "%)";
  return hslStyle;
}



var drawLines = function(numberOfPointOnCircle, times) {
  var baseRadian = getRadiansFullCicle() / numberOfPointOnCircle;
  var radianTable = [];
  for (var i = 0; i < numberOfPointOnCircle; i++) {
    var pointAngleInRadians = baseRadian * i;
    radianTable.push(pointAngleInRadians);
  }



  for (var i = 0; i < numberOfPointOnCircle; i++) {
    var pointAngleInRadians1 = radianTable[i];
    var pointAngleInRadians2 = radianTable[Math.floor((i * times)) % numberOfPointOnCircle];
    var coord1 = findCoordPontOnCircle(pointAngleInRadians1);
    var coord2 = findCoordPontOnCircle(pointAngleInRadians2);
    ctx.beginPath();
    ctx.moveTo(coord1.x + getXCenter(), coord1.y + getYCenter());
    ctx.lineTo(coord2.x + getXCenter(), coord2.y + getYCenter());
    ctx.stroke();
  }

};

var elem=document.querySelector(".open-container")
elem.addEventListener("click",function(){
  document.querySelector(".grid-container").classList.add('open');
});

var elem=document.querySelector(".close-container")
elem.addEventListener("click",function(){
  document.querySelector(".grid-container").classList.remove('open');
});

var refs={}

var refs = new Proxy(refs, {
  set: function (target, key, value) {
      target[key] = value;
      requestAnimationFrame(function(){
        element=document.querySelector('[data-tw-bind='+key+']');
        if(document.activeElement!==element){
          element.value=value;
        }
      })
      return true;
  }
});

refs.numberOfPointOnCircle=250;
refs.timesTable=1;
refs.hue=0;
refs.hueToAdd=3;
refs.saturation=100;
refs.light=40;
refs.speed=1;
refs.framerate=60;
refs.lineWidth=1.5;
refs.timesTableStep=0.4;

var inputsElement=document.querySelectorAll('[data-tw-bind]');
for (var i = 0; i < inputsElement.length; i++) {
  inputElement=inputsElement[i];
  inputElement.addEventListener('input', function(event){
    objectNameToModify=event.target.getAttribute('data-tw-bind');
    refs[objectNameToModify]=Number(event.target.value);
  } , true);
}

var draw = function(deltaTime) {
    refs.timesTable += refs.timesTableStep*(deltaTime/1000);
    refs.hue = refs.hue + refs.hueToAdd*(deltaTime/1000);
    clearCanvas();
    drawBackground();
    ctx.lineWidth=refs.lineWidth;
    ctx.strokeStyle = nbToHslStyle(refs.hue, refs.saturation, refs.light);
    //drawBackgroundCircle("#FFFFFF",getXCenter(), getYCenter(), getRadius()+5, getRadiansStartCicle(),getRadiansEndCicle());
    drawCircle(getXCenter(), getYCenter(), getRadius(), getRadiansStartCicle(), getRadiansEndCicle());
    drawLines(refs.numberOfPointOnCircle, Math.round((refs.timesTable + Number.EPSILON) * 100) / 100);
}

function Loop(handler) {

  let elapsedTime = 0;
  let lastUpdate = null;

  var update = function update() {

    var currentUpdate = performance.now();

    if (lastUpdate !== null) {

      // define elapsed time since last update
      elapsedTime += currentUpdate - lastUpdate;

      // call user's update handler matching timeframe, speed and fixing browser time handling
      while (elapsedTime >= 1000 / refs.framerate / refs.speed) {

        // define elapsed time since last user's update handler matching timeframe and speed
        elapsedTime -= 1000 / refs.framerate / refs.speed;

        handler(1000 / refs.framerate);
      }
    }
    // call user's update handler on each available frame
    requestAnimationFrame(this.update.bind(this));
    lastUpdate = currentUpdate;
  }

    this.update = update;
}


// var drawFunction=draw.bind(this, timesTable, hue, light, saturation);
var loop=new Loop(draw)
loop.update();
