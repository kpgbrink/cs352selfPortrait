/*
 * kenDoll v2: draw a Sierpinski kenDoll by drawing lots of dots,
 * where each is the average of the previous and a random vertex
 * For CS352, Calvin College Computer Science
 *
 * Harry Plantinga -- January 2011
 */

var kenDoll = {
  radius:	0.005,				// dot radius
}
var vertex = new Array();

$(document).ready(function () { kenDoll.init(); });

kenDoll.init = function () {  
  kenDoll.canvas  = $('#canvas1')[0];
  kenDoll.cx = kenDoll.canvas.getContext('2d');	// get the drawing canvas
    
  var midX = 251;
  var offSetX = 15;
  var offSetY = 170;
  kenDoll.eyes = {left: {centerX:midX-offSetX - 34, centerY: offSetY}, right : {centerX:midX+offSetX, centerY:offSetY}};
   
    
  kenDoll.letsGoPartyAudioElement = document.createElement('audio');
  kenDoll.letsGoPartyAudioElement.setAttribute('src', './letsGoParty.wav');
  
    
  kenDoll.cx.fillStyle = 'rgba(250,0,0,0.7)';


  // By default (0,0) is the upper left and canvas.width, canvas.height 
  // is the lower right. We'll add a matrix multiplication to the state
  // to change the coordinate system so that the central part of the canvas

  // bind functions to events, button clicks]
  $('#letsGoParty').bind('click', kenDoll.letsGoParty);
  $('#slider1').bind('change', kenDoll.slider);
 
  setInterval(kenDoll.draw, 10);
  $('#messages').prepend("Aren't I beautiful?");
    
  
  kenDoll.mouse = {x:0, y:0, canvasX:0, canvasY:0};
    
  $("body").mousemove(function(e) {
    kenDoll.mouse.x = e.pageX;
    kenDoll.mouse.y = e.pageY;
    // http://stackoverflow.com/a/18053642
    var rect = kenDoll.canvas.getBoundingClientRect();
    kenDoll.mouse.canvasX = e.pageX - rect.left;
    kenDoll.mouse.canvasY = e.pageY - rect.top;
  });
  
  kenDoll.lazerTimer = kenDoll.lazerTimerStart = 40;
  kenDoll.mouseClick = false;
  $(kenDoll.canvas).click(function(e) {
     kenDoll.mouseClick = true;
  });
}

kenDoll.drawEyes = function() {
    kenDoll.drawEye(kenDoll.eyes.right);
    kenDoll.drawEye(kenDoll.eyes.left);
    
    if (kenDoll.mouseClick) {
        kenDoll.lazerTimer = kenDoll.lazerTimerStart;
    }
    if (kenDoll.lazerTimer) {
        kenDoll.lazerTimer--;
    }
}

kenDoll.drawEye = function (eye) {
    // logic for eye position
    // get x and y offset from posotion
    var xPos = eye.centerX - ( - kenDoll.mouse.canvasX / 50);
    var yPos = eye.centerY - ( - kenDoll.mouse.canvasY / 90);
    
    kenDoll.cx.fillStyle = 'rgba(0,0,0,1)';
    kenDoll.cx.beginPath();
    kenDoll.cx.arc(xPos, yPos, 3.5, 0, Math.PI*2, true);
    kenDoll.cx.closePath();
    kenDoll.cx.fill();
    
    if (kenDoll.lazerTimer) {
        kenDoll.cx.strokeStyle = 'rgba(255,0,0,1)';
        kenDoll.cx.lineWidth=2;
        kenDoll.drawLazer({x:xPos,y:yPos}, {x:kenDoll.mouse.canvasX,y:kenDoll.mouse.canvasY});
        kenDoll.cx.strokeStyle = 'rgba(255,0,0,.5)';
        kenDoll.cx.lineWidth=10;
        kenDoll.drawLazer({x:xPos,y:yPos}, {x:kenDoll.mouse.canvasX,y:kenDoll.mouse.canvasY});
    }
}

kenDoll.drawLazer = function (pos1, pos2) {
    kenDoll.cx.beginPath();
    kenDoll.cx.moveTo(pos1.x, pos1.y);
    kenDoll.cx.lineTo(pos2.x, pos2.y);
    kenDoll.cx.stroke();
}

kenDoll.draw = function(ev) {
    kenDoll.erase();
    kenDoll.drawEyes();
    kenDoll.mouseClick = false;
}

kenDoll.letsGoParty = function(ev) {
    $('#messages').prepend("Let's go party... ");
    kenDoll.cx.fillText("Let's Go Party!", 10, 50);
    kenDoll.letsGoPartyAudioElement.play();
    console.log(kenDoll.letsGoPartyAudioElement);
}

// erase canvas and message box
kenDoll.erase = function(ev) {
    console.log('width', kenDoll.canvas.width);
  kenDoll.cx.clearRect(0,0,kenDoll.canvas.width, kenDoll.canvas.height);
}

// update the message below the slider with its setting
kenDoll.slider = function(ev) {
  $('#pointcount').text($('#slider1').val());
}
