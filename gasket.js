/*
 * kenDoll v2: draw a Sierpinski kenDoll by drawing lots of dots,
 * where each is the average of the previous and a random vertex
 * For CS352, Calvin College Computer Science
 *
 * Harry Plantinga -- January 2011
 */

var kenDoll = {};

function randNum(min, max) {
  return Math.random() * (max - min) + min;
}

// http://stackoverflow.com/a/22237671
function getRndColor() {
    var r = 255*Math.random()|0,
        g = 255*Math.random()|0,
        b = 255*Math.random()|0;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function getRndColorHex() {
    return Math.floor(Math.random()*16777215).toString(16);
}

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
  kenDoll.happiness = 10;
  $('#sliderHappiness').bind('change', kenDoll.slider);
 
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
  
  // set timers
  kenDoll.partyTimer = 0;
  kenDoll.partyTimerStart = 280;
  kenDoll.lazerTimer = 0;
  kenDoll.lazerTimerStart = 40;
  kenDoll.partyMessages = [];
  
  kenDoll.mouseClick = false;
  $(kenDoll.canvas).click(function(e) {
     kenDoll.mouseClick = true;
  });
}



kenDoll.draw = function(ev) {
    kenDoll.erase();
    kenDoll.drawHappiness();
    kenDoll.drawEyes();
    kenDoll.handleParty();
    kenDoll.mouseClick = false;
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

kenDoll.handleParty = function() {
    if (kenDoll.partyTimer) {
        kenDoll.partyTimer--;
        kenDoll.drawParty();
    } else {
        kenDoll.partyMessages = [];
    }
}

kenDoll.partyBackground = function () {
    console.log('background change');
    if (kenDoll.partyTimer % 50 == 0 ) {
        console.log('yeay');
        var color = getRndColorHex();
        $('#messages').prepend("Change the party color to " + color + "... ");
        $('body').css('background-color', '#' + color);
    }
}

kenDoll.drawParty = function() {
    // Party Background
    kenDoll.partyBackground();
    
    
    // Party messages
    if (kenDoll.partyMessages.length < 12) {
        kenDoll.cx.beginPath();
        kenDoll.partyMessages.push({pos: {x: randNum(-10, 400), y: randNum(-10, 400)}, speed: {x: randNum(-5,5), y: randNum(-5,5)}, size: randNum(1,10), sizeChange: randNum(0,4), color: getRndColor()});
    }
    
    for(partyMessage of kenDoll.partyMessages) {
        kenDoll.drawPartyMessage(partyMessage);
        partyMessage.size += partyMessage.sizeChange;
        partyMessage.pos.x += partyMessage.speed.x;
        partyMessage.pos.y += partyMessage.speed.y;
    }
}

kenDoll.drawPartyMessage = function (message) {
    kenDoll.cx.font = `${message.size}px Arial`;
    kenDoll.cx.fillStyle = message.color;
    //console.log(kenDoll.cx.fillStyle);
    kenDoll.cx.beginPath();
    kenDoll.cx.fillText("Let's go party", message.pos.x, message.pos.y);
    
}

kenDoll.letsGoParty = function(ev) {
    kenDoll.letsGoPartyAudioElement.play();
    if (!kenDoll.partyTimer) {
        $('#messages').prepend("Let's go party... ");
        kenDoll.partyTimer = kenDoll.partyTimerStart;
    }
}

// erase canvas and message box
kenDoll.erase = function(ev) {
    //console.log('width', kenDoll.canvas.width);
  kenDoll.cx.clearRect(0,0,kenDoll.canvas.width, kenDoll.canvas.height);
}

kenDoll.drawHappiness = function() {
    kenDoll.happiness = $('#sliderHappiness').val();
    var addAngle = (Math.PI/2) * ((5000-kenDoll.happiness) / 5000);
    // first draw a smiley
    kenDoll.cx.beginPath();
    kenDoll.cx.lineWidth = 8;
    kenDoll.cx.arc(kenDoll.canvas.width / 2 + 12, 190, // position
                   50, // radius
                   0 + addAngle, // start angle
                   Math.PI - addAngle); // end angle
    kenDoll.cx.stroke();
}

// Change ken's happiness.
kenDoll.slider = function(ev) {
  
  $('#pointcount').text(kenDoll.happiness);
}
