// JavaScript Document
var m;
var scl = 10;
var food;


function setup () {
	createCanvas(600, 600); 
	m = new Snake();
	frameRate(10);
	pickLocation();
	var canvas = createCanvas(600, 600);  
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

	if (m.eat(food)) {
		pickLocation();
	}
m.death();
m.update();
m.show();
	
fill(255, 0, 100);
rect(food.x, food.y, scl, scl);
	
}
	   function keyPressed() {
  if (keyCode === UP_ARROW) {
    m.dir(0, -1);
  } else if (keyCode === DOWN_ARROW) {
    m.dir(0, 1);
  } else if (keyCode === RIGHT_ARROW) {
    m.dir(1, 0);
  } else if (keyCode === LEFT_ARROW) {
    m.dir(-1, 0); 
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