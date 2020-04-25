let sHeight = 400.0;
let sWidth = 800.0;
let size = 7.5;
let threshold = 12.5;
let gHeight = 100;
let bWidth = 100;
var start = false;
var refresh = false;
var days = 0;
var lines = [];
var probInfectRate = 100;
var infectPeriod = [250, 450];
var skip = 1;
var timer = 100;
var distCounter = 0;

function start_(){
  loop();
  pop_ = 0;
  lines = [];
  start = true;
  timer = 100;
  distCounter = tSlider.value();
  pop_ = new population(sSlider.value(), dSlider.value(), iSlider.value(), 0);
}

function setup() {
  createCanvas(sWidth, sHeight + gHeight);

  t1 = createP("");
  button = createButton("Start Simulation");
  button.mousePressed(start_);
  button = createButton("Stop Simulation");
  button.mousePressed(noLoop);
  t2 = createP("");

  t3 = createP("Not Distancing");
  sSlider = createSlider(0, 50, 20);
  t4 = createP("Distancing");
  dSlider = createSlider(0, 50, 20);
  t5 = createP("Infected");
  iSlider = createSlider(0, 50, 5);
  t6 = createP("How Long Distance");
  tSlider = createSlider(0, 800, 200);

}

function draw() {
  background(220);
  strokeWeight(1);
  stroke(0);
  line(0, 0, sWidth, 0);
  line(0, 0, 0, sHeight + gHeight);
  line(sWidth, 0, sWidth, sHeight + gHeight);
  line(0, sHeight, sWidth, sHeight);
  line(0, sHeight + gHeight, sWidth, sHeight + gHeight);
  line(sWidth - bWidth, sHeight , sWidth - bWidth, sHeight + gHeight);



  //line(0,500,400,500);
  if(start){
    append(lines, pop_.draw());

    var width = sWidth - bWidth;
    var height = gHeight + sHeight
    var n = lines.length;

    for(var i = 0; i < lines.length; i+=1){
      stroke('red');
      rect((i*width)/n, height - lines[i][1], width/n, lines[i][1]);
      stroke('blue')
      rect((i*width)/n, height - lines[i][1] - lines[i][0], width/n, lines[i][0]);
      stroke('green')
      rect((i*width)/n, height - lines[i][1] - lines[i][0] - lines[i][2], width/n, lines[i][2]);
    }

    //print((lines.length - bWidth) % sWidth);
    if(lines.length % (sWidth - bWidth) == 0){
      skip ++;
    }

    if(lines[lines.length-1][1] == 0){
      timer --;
    }

    if(timer < 0){
      noLoop();
    }
    strokeWeight(1);
    textSize(12);
    stroke("green");
    text("Recovered: " + round(lines[lines.length-1][2]* pop_.pop.length/100, 0), sWidth - bWidth + 5, sHeight + 25);
    stroke("blue");
    text("Susceptible: " + round(lines[lines.length-1][0] * pop_.pop.length/100, 0), sWidth - bWidth + 5, sHeight + 55);
    stroke("red");
    text("Infected: " + round(lines[lines.length-1][1] * pop_.pop.length/100, 0), sWidth - bWidth + 5, sHeight + 85);

    pop_.update();
    days ++;
  }

}





//~~~~~~~~~~ DOT ~~~~~~~~~~~~~~~//

class dot {

  constructor(x, y, size, dir, state, distancing){
    this.x = x;
    this.y = y;
    this.size = size;
    this.state = state;
    this.dir = dir;
    this.speed = 2;
    this.xSpeed = cos(this.dir);
    this.ySpeed = sin(this.dir);
    this.countdown = random(infectPeriod[0], infectPeriod[1]);
    this.distancing = distancing;
    this.distCount = distCounter;
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
    strokeWeight(3);
    noFill();
    circle(this.x, this.y, this.size);
  }

  update(){
    var rad = this.size;

    if (!this.distancing) {
    this.x += this.xSpeed * this.speed;
    this.y += this.ySpeed * this.speed;
    }

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

    //infection period
    if(this.state == "i"){
      this.countdown -- ;
    }
    //if it's been infected for the whole period, it goes to removed
    if(this.countdown <= 0){
      this.state = "r";
    }

    if(this.distancing){
      this.distCount --;
    }
    if(this.distCount <= 0){
      this.distancing = false;
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

  constructor(succ, distancing, infect, rem){

    this.pop = [];

    for(var i = 0; i < succ; i++){
      append(this.pop, new dot(random(0, sWidth), random(0, sHeight), size, random(0, 2*PI), "s", false));
    }
    for(var h = 0; h < distancing; h++){
      append(this.pop, new dot(random(0, sWidth), random(0, sHeight), size, random(0, 2*PI), "s", true));
    }
    for(var j = 0; j < infect; j++){
      append(this.pop, new dot(random(0, sWidth), random(0, sHeight), size, random(0, 2*PI), "i", false));
    }
    for(var k = 0; k < rem; k++){
      append(this.pop, new dot(random(0, sWidth), random(0, sHeight), size, random(0, 2*PI), "r", false));
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

      //collision detection
      for(var j = i+1; j < this.pop.length; j++){

        var distance = dist(this.pop[i].getX(), this.pop[i].getY(),this.pop[j].getX(), this.pop[j].getY());

        if(distance <= threshold){
          this.collide(i, j);
        }
      }
    }
  }

  collide(i, j){
    //for social distancers --> mass is NOT equal
          //because they don't move
      //treat equation as if mass of 2 --> infinity
      //both vx and vy of the moving object should flip
    if(this.pop[i].distancing){
      this.pop[j].setXSpeed(-this.pop[j].getXSpeed());
      this.pop[j].setYSpeed(-this.pop[j].getYSpeed());
    }
    else if(this.pop[i].distancing){
      this.pop[i].setXSpeed(-this.pop[i].getXSpeed());
      this.pop[i].setYSpeed(-this.pop[i].getYSpeed());
    }
    else{
      //uses the elastic collision equation (conserving energy)
        //since mass is equal
        //vfx1 = vix2
        //vfx2 = vix1
        //vfy1 = viy2
        //vfy2 = viy1
      //this swaps the velocities
      var tempX = this.pop[i].getXSpeed();
      this.pop[i].setXSpeed(this.pop[j].getXSpeed());
      this.pop[j].setXSpeed(tempX);
      var tempY = this.pop[i].getYSpeed();
      this.pop[i].setYSpeed(this.pop[j].getYSpeed());
      this.pop[j].setYSpeed(tempY);
    }

    //this just prevents clusters by nudging the balls away by .5 in each direction
    this.pop[i].setX(this.pop[i].getX() + (this.pop[i].getX() - this.pop[j].getX())/abs(this.pop[i].getX() - this.pop[j].getX()) * 0.5);
    this.pop[i].setY(this.pop[i].getY() + (this.pop[i].getY() - this.pop[j].getY())/abs(this.pop[i].getY() - this.pop[j].getY()) * 0.5);

    this.pop[j].setX(this.pop[j].getX() + (this.pop[j].getX() - this.pop[i].getX())/abs(this.pop[j].getX() - this.pop[i].getX()) * 0.5);
    this.pop[j].setY(this.pop[j].getY() + (this.pop[j].getY() - this.pop[i].getY())/abs(this.pop[j].getY() - this.pop[i].getY()) * 0.5);

    //checks if either is contaigous
    if(this.pop[i].state == "i" || this.pop[j].state == "i"){
      //if one of them touches the other
      //there's a chance it will infect
      var rand = random(0, 100);
      if(rand < probInfectRate){
        this.infect(i, j);
      }
    }
  }

  //chnges the state from sucsceptable to infected
  infect(i, j){
    if(this.pop[i].state == "s"){
      this.pop[i].state = "i";
    }
    if(this.pop[j].state == "s"){
      this.pop[j].state = "i";
    }
  }

}
