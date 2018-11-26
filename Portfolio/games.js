// JavaScript Document
/********* VARIABLES *********/

// We control which screen is active by settings / updating
// gameScreen variable. We display the correct screen according
// to the value of this variable.
// 
// 0: Initial Screen
// 1: Game Screen
// 2: Game-over Screen 

var gameScreen = 0;

// gameplay settings
var gravity = 0.3;
var airfriction = 0.00001;
var friction = 0.1;

// scoring
var score = 0;
var maxHealth = 100;
var health = 100;
var healthDecrease = 1;
var healthBarWidth = 60;

// ball settings
var ballX, ballY;
var ballSpeedVert = 0;
var ballSpeedHorizon = 0;
var ballSize = 20;
var ballColor;

// racket settings
var racketColor;
var racketWidth = 100;
var racketHeight = 10;

// wall settings
var wallSpeed = 5;
var wallInterval = 1000;
var lastAddTime = 0;
var minGapHeight = 200;
var maxGapHeight = 300;
var wallWidth = 80;
var wallColors;
var walls = [];

/********* SETUP BLOCK *********/

function setup() {
  createCanvas(500, 500);
	
  // set the initial coordinates of the ball
  ballX=width/4;
  ballY=height/5;
  smooth();

  ballColor = color(0);
  racketColor = color(0);
  wallColors = color(44, 62, 100)
}


/********* DRAW BLOCK *********/

function draw() { 
  // Display the contents of the current screen
  if (gameScreen == 0) { 
    initScreen();
  } else if (gameScreen == 1) { 
    gameplayScreen();
  } else if (gameScreen == 2) { 
    gameOverScreen();
  }
}


/********* SCREEN CONTENTS *********/

function initScreen() {
  background(236, 240, 241);
  textAlign(CENTER);
  fill(52, 73, 94);
  textSize(70);
  text("Flappy Ball", width/2, height/2);
  textSize(15); 
  text("Click to start", width/2, height-30); 
}
function gameplayScreen() {
  background(236, 240, 241);
  drawRacket();
  watchRacketBounce();
  drawBall();
  applyGravity();
  applyHorizontalSpeed();
  keepInScreen();
  drawHealthBar();
  printScore();
  wallAdder();
  wallHandler();
}
function gameOverScreen() {
  background(44, 62, 80);
  textAlign(CENTER);
  fill(236, 240, 241);
  textSize(12);
  text("Your Score", width/2, height/2 - 120);
  textSize(130);
  text(score, width/2, height/2);
  textSize(15);
  text("Click to Restart", width/2, height-30);
}


/********* INPUTS *********/

function mousePressed() {
  // if we are on the initial screen when clicked, start the game 
  if (gameScreen==0) { 
    startGame();
  }
  if (gameScreen==2) {
    restart();
  }
}


/********* OTHER FUNCTIONS *********/

// This method sets the necessery variables to start the game  
function startGame() {
  gameScreen=1;
}
function gameOver() {
  gameScreen=2;
}

function restart() {
  score = 0;
  health = maxHealth;
  ballX=width/4;
  ballY=height/5;
  lastAddTime = 0;
  walls = [];
  gameScreen = 1;
}

function drawBall() {
  fill(ballColor);
  ellipse(ballX, ballY, ballSize, ballSize);
}
			
function drawRacket() {
  fill(racketColor);
  rectMode(CENTER);
  rect(mouseX, mouseY, racketWidth, racketHeight, 5);
}

function wallAdder() {
  if (millis()-lastAddTime > wallInterval) {
    var randHeight = round(random(minGapHeight, maxGapHeight));
    var randY = round(random(0, height-randHeight));
    // {gapWallX, gapWallY, gapWallWidth, gapWallHeight, scored}
    var randWall = [width, randY, wallWidth, randHeight, 0]; 
    walls.push(randWall);
    lastAddTime = millis();
  }
}
function wallHandler() {
  for (var i = 0; i < walls.length; i++) {
    wallRemover(i);
    wallMover(i);
    wallDrawer(i);
    watchWallCollision(i);
  }
}
function wallDrawer(index) {
  var wall = walls[index];
  // get gap wall settings 
  var gapWallX = wall[0];
  var gapWallY = wall[1];
  var gapWallWidth = wall[2];
  var gapWallHeight = wall[3];
  // draw actual walls
  rectMode(CORNER);
  noStroke();
  strokeCap(ROUND);
  fill(wallColors);
  rect(gapWallX, 0, gapWallWidth, gapWallY, 0, 0, 15, 15);
  rect(gapWallX, gapWallY+gapWallHeight, gapWallWidth, height-(gapWallY+gapWallHeight), 15, 15, 0, 0);
}

function wallMover(index) {
  var wall = walls[index];
  wall[0] -= wallSpeed;
}
function wallRemover(index) {
  var wall = walls[index];
  if (wall[0]+wall[2] <= 0) {
    walls.splice(index, 1);
  }
}

function watchWallCollision(index) {
  var wall = walls[index];
  // get gap wall settings 
  var gapWallX = wall[0];
  var gapWallY = wall[1];
  var gapWallWidth = wall[2];
  var gapWallHeight = wall[3];
  var wallScored = wall[4];
  var wallTopX = gapWallX;
  var wallTopY = 0;
  var wallTopWidth = gapWallWidth;
  var wallTopHeight = gapWallY;
  var wallBottomX = gapWallX;
  var wallBottomY = gapWallY+gapWallHeight;
  var wallBottomWidth = gapWallWidth;
  var wallBottomHeight = height-(gapWallY+gapWallHeight);

  if (
    (ballX+(ballSize/2)>wallTopX) &&
    (ballX-(ballSize/2)<wallTopX+wallTopWidth) &&
    (ballY+(ballSize/2)>wallTopY) &&
    (ballY-(ballSize/2)<wallTopY+wallTopHeight)
    ) {
    decreaseHealth();
  }
  if (
    (ballX+(ballSize/2)>wallBottomX) &&
    (ballX-(ballSize/2)<wallBottomX+wallBottomWidth) &&
    (ballY+(ballSize/2)>wallBottomY) &&
    (ballY-(ballSize/2)<wallBottomY+wallBottomHeight)
    ) {
    decreaseHealth();
  }

  if (ballX > gapWallX+(gapWallWidth/2) && wallScored==0) {
    wallScored=1;
    wall[4]=1;
    addScore();
  }
}

function drawHealthBar() {
  noStroke();
  fill(189, 195, 199);
  rectMode(CORNER);
  rect(ballX-(healthBarWidth/2), ballY - 30, healthBarWidth, 5);
  if (health > 60) {
    fill(46, 204, 113);
  } else if (health > 30) {
    fill(230, 126, 34);
  } else {
    fill(231, 76, 60);
  }
  rectMode(CORNER);
  rect(ballX-(healthBarWidth/2), ballY - 30, healthBarWidth*(health/maxHealth), 5);
}
			
function decreaseHealth() {
  health -= healthDecrease;
  if (health <= 0) {
    gameOver();
  }
}
function addScore() {
  score++;
}
function printScore() {
  textAlign(CENTER);
  fill(0);
  textSize(30); 
  text(score, height/2, 50);
}

function watchRacketBounce() {
  var overhead = mouseY - pmouseY;
  if ((ballX+(ballSize/2) > mouseX-(racketWidth/2)) && (ballX-(ballSize/2) < mouseX+(racketWidth/2))) {
    if (dist(ballX, ballY, ballX, mouseY)<=(ballSize/2)+abs(overhead)) {
      makeBounceBottom(mouseY);
      ballSpeedHorizon = (ballX - mouseX)/10;
      // racket moving up
      if (overhead<0) {
        ballY+=(overhead/2);
        ballSpeedVert+=(overhead/2);
      }
    }
  }
}
function applyGravity() {
  ballSpeedVert += gravity;
  ballY += ballSpeedVert;
  ballSpeedVert -= (ballSpeedVert * airfriction);
}
function applyHorizontalSpeed() {
  ballX += ballSpeedHorizon;
  ballSpeedHorizon -= (ballSpeedHorizon * airfriction);
}
// ball falls and hits the floor (or other surface) 
function makeBounceBottom(surface) {
  ballY = surface-(ballSize/2);
  ballSpeedVert*=-1;
  ballSpeedVert -= (ballSpeedVert * friction);
}
// ball rises and hits the ceiling (or other surface)
function makeBounceTop(surface) {
  ballY = surface+(ballSize/2);
  ballSpeedVert*=-1;
  ballSpeedVert -= (ballSpeedVert * friction);
}
// ball hits object from left side
function makeBounceLeft(surface) {
  ballX = surface+(ballSize/2);
  ballSpeedHorizon*=-1;
  ballSpeedHorizon -= (ballSpeedHorizon * friction);
}
// ball hits object from right side
function makeBounceRight(surface) {
  ballX = surface-(ballSize/2);
  ballSpeedHorizon*=-1;
  ballSpeedHorizon -= (ballSpeedHorizon * friction);
}
// keep ball in the screen
function keepInScreen() {
  // ball hits floor
  if (ballY+(ballSize/2) > height) { 
    makeBounceBottom(height);
  }
  // ball hits ceiling
  if (ballY-(ballSize/2) < 0) {
    makeBounceTop(0);
  }
  // ball hits left of the screen
  if (ballX-(ballSize/2) < 0) {
    makeBounceLeft(0);
  }
  // ball hits right of the screen
  if (ballX+(ballSize/2) > width) {
    makeBounceRight(width); 
  }
}



var s;
var scl = 10;
var food;

	   
function setup () {
	createCanvas(500, 500);
	s = new Snake();
	frameRate(10);
	pickLocation();
	 canvas.parent('sketch-holder');
}

function pickLocation() {
	var cols = floor(width/scl);
	var rows = floor(height/scl);
	 food = createVector(floor(random(cols)), floor(random(rows)));
	food.mult(scl);
}
	   


function draw () {
background(51);

	if (s.eat(food)) {
		pickLocation();
	}
s.death();
s.update();
s.show();
	
fill(255, 0, 100);
rect(food.x, food.y, scl, scl);
	
}
	   function keyPressed() {
  if (keyCode === UP_ARROW) {
    s.dir(0, -1);
  } else if (keyCode === DOWN_ARROW) {
    s.dir(0, 1);
  } else if (keyCode === RIGHT_ARROW) {
    s.dir(1, 0);
  } else if (keyCode === LEFT_ARROW) {
    s.dir(-1, 0);
  }
} 
	   
	   function Snake () {
		   this.x = 250;
		   this.y = 250;
		   this.xspeed = 1;
		   this.yspeed = 0;
		   this.total = 0;
		   this.tail = [];
		   
	this.eat = function(pos) {
    var d = dist(this.x, this.y, pos.x, pos.y);
    if (d < 1) {
      this.total++;
      return true;
    } else {
      return false;
    }
  }

  this.dir = function(x, y) {
    this.xspeed = x;
    this.yspeed = y;
  }

  this.death = function() {
    for (var i = 0; i < this.tail.length; i++) {
      var pos = this.tail[i];
      var d = dist(this.x, this.y, pos.x, pos.y);
      if (d < 1) {
        console.log('starting over');
        this.total = 0;
        this.tail = [];
      }
    } 
  }

  this.update = function() {
    for (var i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }
    if (this.total >= 1) {
      this.tail[this.total - 1] = createVector(this.x, this.y);
    }

    this.x = this.x + this.xspeed * scl;
    this.y = this.y + this.yspeed * scl;

    this.x = constrain(this.x, 0, width - scl);
    this.y = constrain(this.y, 0, height - scl);
  }

  this.show = function() {
    fill(255); 
    for (var i = 0; i < this.tail.length; i++) {
      rect(this.tail[i].x, this.tail[i].y, scl, scl);
    }
    rect(this.x, this.y, scl, scl);

  }
		   } 