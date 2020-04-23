let sHeight = 400.0;
let sWidth = 400.0;
let size = 7.5;
let threshold = 12.5;
let gHeight = 100;
var days = 0;
var lines = [];
var probInfectRate = 40;
var infectPeriod = 175;
var skip = 1;

function setup() {
  createCanvas(sWidth, sHeight + gHeight);
  pop_ = new population(30,1,1);
}

function draw() {
  background(220);
  line(0,500,400,500);

  append(lines, pop_.draw());
  var counterTeST = 0;
  for(var i = 0; i < lines.length; i+=skip){
    counterTeST ++;
    strokeWeight(1);
    stroke('red');
    line(counterTeST, sHeight + gHeight, counterTeST, sHeight + gHeight - lines[i][1]);
    stroke('blue');
    line(counterTeST, sHeight + gHeight - lines[i][1], counterTeST, sHeight + lines[i][2]);
    stroke('green');
    line(counterTeST, sHeight, counterTeST, sHeight + lines[i][2]);
  }
  if(lines.length % sWidth == 0){
    skip ++;
  }
  pop_.update();
  days ++;

}


//~~~~~~~~~~ DOT ~~~~~~~~~~~~~~~//

class dot {

  constructor(x, y, size, dir, state){
    this.x = x;
    this.y = y;
    this.size = size;
    this.state = state;
    this.dir = dir;
    this.speed = 5;
    this.xSpeed = cos(this.dir);
    this.ySpeed = sin(this.dir);
    this.countdown = infectPeriod;

  }

  draw(){
    if(this.state == "s"){
      stroke(255);
    }
    else if(this.state == "i"){
      stroke('red');
    }
    else{
      stroke(0);
    }
    strokeWeight(4);
    noFill();
    circle(this.x, this.y, this.size);
  }

  update(){
    var rad = this.size;

    this.x += this.xSpeed * this.speed;
    this.y += this.ySpeed * this.speed;

    if (this.x + rad > sWidth){
      this.x = sWidth - (rad + 1);
      this.xSpeed *= -1;
    }
    if(this.x - rad < 0){
      this.x = 0 + (rad + 1)
      this.xSpeed *= -1;
    }
    if (this.y + rad > sHeight){
      this.y = sHeight - (rad + 1);
      this.ySpeed *= - 1;
    }
    if(this.y - rad < 0){
      this.y = 0 + (rad + 1);
      this.ySpeed *= - 1;
    }
    if(this.state == "i"){
      this.countdown -- ;
    }
    if(this.countdown == 0){
      this.state = "r";
    }
  }

  getX(){
    return this.x;
  }

  getY(){
    return this.y;
  }

  setX(x){
    this.x = x;
  }

  setY(y){
    this.y = y;
  }

  getXSpeed(){
    return this.xSpeed;
  }

  getYSpeed(){
    return this.ySpeed;
  }

  setXSpeed(x){
    this.xSpeed = x;
  }

  setYSpeed(y){
    this.ySpeed = y;
  }
}


//~~~~~~~~~~ POP ~~~~~~~~~~~~~~~//


class population {

  constructor(succ, infect, rem){

    this.pop = [];

    for(var i = 0; i < succ; i++){
      append(this.pop, new dot(random(0, sWidth), random(0, sHeight), size, random(0, 2*PI), "s"));
    }
    for(var j = 0; j < infect; j++){
      append(this.pop, new dot(random(0, sWidth), random(0, sHeight), size, random(0, 2*PI), "i"));
    }
    for(var k = 0; k < rem; k++){
      append(this.pop, new dot(random(0, sWidth), random(0, sHeight), size, random(0, 2*PI), "r"));
    }

  }

  draw(){
    var succ = 0;
    var infect = 0;
    var rem = 0;
    for(var i = 0; i < this.pop.length; i++){
      this.pop[i].draw();
      if(this.pop[i].state == "s"){
        succ++;
      }
      if(this.pop[i].state == "i"){
        infect++;
      }
      if(this.pop[i].state == "r"){
        rem++;
      }
    }
    succ = (succ/this.pop.length) * 100;
    infect = (infect/this.pop.length) * 100;
    rem = (rem/this.pop.length) * 100;

    return [succ, infect, rem];

  }

  update(){
    for(var i = 0; i < this.pop.length; i++){
      this.pop[i].update();

      for(var j = i+1; j < this.pop.length; j++){

        var distance = dist(this.pop[i].getX(), this.pop[i].getY(),this.pop[j].getX(), this.pop[j].getY());

        if(distance <= threshold){
          this.collide(i, j);
        }
      }
    }
  }

  collide(i, j){
    var tempX = this.pop[i].getXSpeed();
    this.pop[i].setXSpeed(this.pop[j].getXSpeed());
    this.pop[j].setXSpeed(tempX);

    var tempY = this.pop[i].getYSpeed();
    this.pop[i].setYSpeed(this.pop[j].getYSpeed());
    this.pop[j].setYSpeed(tempY);

    this.pop[i].setX(this.pop[i].getX() + (this.pop[i].getX() - this.pop[j].getX())/abs(this.pop[i].getX() - this.pop[j].getX()) * 0.5);

    this.pop[i].setY(this.pop[i].getY() + (this.pop[i].getY() - this.pop[j].getY())/abs(this.pop[i].getY() - this.pop[j].getY()) * 0.5);

    if(this.pop[i].state == "i" || this.pop[j].state == "i"){
      //if one of them touches the other
      //there's a chance it will infect
      var rand = random(0, 100);
      if(rand < probInfectRate){
        this.infect(i, j);
      }
    }
  }

  infect(i, j){
    if(this.pop[i].state == "s"){
      this.pop[i].state = "i";
    }
    if(this.pop[j].state == "s"){
      this.pop[j].state = "i";
    }
  }

}
