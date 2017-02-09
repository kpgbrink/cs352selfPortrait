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
    
  var midX = 255;
  var offSetX = 15;
  kenDoll.eyes = {left: {x:midX-offSetX - 34, y: 171, offSet: {centerX:434,centerY:232,x:0,y:0}}, right : {x:midX+offSetX, y:171, offSet:{centerX:503,centerY:232,x:0,y:0}}};
   
    
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
    
  
  kenDoll.mouse = {x:0, y:0};
  $("body").mousemove(function(e) {
    kenDoll.mouse.x = e.pageX;
    kenDoll.mouse.y = e.pageY;
    console.log(kenDoll.mouse);
    
})
}

kenDoll.drawEyes = function() {
    kenDoll.cx.fillStyle = 'rgba(0,0,0,1)';
    kenDoll.drawEye(kenDoll.eyes.right);
    kenDoll.drawEye(kenDoll.eyes.left);
}

kenDoll.drawEye = function (eye) {
    // logic for eye position
    // get x and y offset from posotion
    var xOffset = eye.offSet.centerX - kenDoll.mouse.x;
    var yOffset = eye.offSet.centerY - kenDoll.mouse.y;
    var lowerOffset = 90;
    kenDoll.cx.beginPath();
    kenDoll.cx.arc(eye.x - xOffset/lowerOffset, eye.y - yOffset/lowerOffset, 3.5, 0, Math.PI*2, true);
    kenDoll.cx.closePath();
    kenDoll.cx.fill();
}

kenDoll.draw = function(ev) {
    kenDoll.erase();
    kenDoll.drawEyes();
    
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
