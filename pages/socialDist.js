let sHeight = 400.0;
let sWidth = 800.0;
let size = 7.5;
let threshold = 12.5;
let gHeight = 150;
let bWidth = 100;
var start = false;
var refresh = false;
var days = 0;
var lines = [];
var probInfectRate = 100;
var infectPeriod = [100, 300];
var skip = 1;
var timer = 100;

function start_(){
  loop();
  pop_ = 0;
  lines = [];
  start = true;
  timer = 100;
  pop_ = new population(sSlider.value(), dSlider.value(), iSlider.value(), 0);
}

function updateS1(){
  t3.html("Not Distancing = " + sSlider.value())
}

function updateS2(){
  t4.html("Distancing = " + dSlider.value())
}

function updateS3(){
  t5.html("Infected = " + iSlider.value())
}

function setup() {
  title = createP("SIMULATION")
  title.style("position" , "absolute");
  title.style("font-size" , "30px");
  title.style("left" , "350px");


  let cnv = createCanvas(sWidth, sHeight + gHeight);
  cnv.position(50, 75, "relative");
  //cnv.style("padding", "50px")


  button = createButton("START");
  button.style("width", "50px");
  button.style("height", "25px");
  button.style("position" , "absolute");
  button.style("top" , "400px");
  button.style("left", "870px")
  button.style("background-color", "#5ACD6F");
  button.mousePressed(start_);
  button2 = createButton("STOP");
  button2.mousePressed(noLoop);
  button2.style("position" , "absolute");
  button2.style("width", "50px");
  button2.style("height", "25px");
  button2.style("top" , "400px");
  button2.style("left", "950px");
  button2.style("background-color", "#FF6868");



  sSlider = createSlider(0, 50, 20);
  sSlider.style("position" , "absolute");
  sSlider.style("top" , "150px");
  sSlider.style("left", "870px")
  sSlider.input(updateS1);
  t3 = createP("Not Distancing = " + sSlider.value());
  t3.style("position" , "absolute");
  t3.style("top" , "100px");
  t3.style("left", "870px")
  dSlider = createSlider(0, 50, 20);
  dSlider.style("position" , "absolute");
  dSlider.style("top" , "240px");
  dSlider.style("left", "870px")
  dSlider.input(updateS2);
  t4 = createP("Distancing = " + dSlider.value());
  t4.style("position" , "absolute");
  t4.style("top" , "190px");
  t4.style("left", "870px")
  iSlider = createSlider(0, 50, 5);
  iSlider.style("position" , "absolute");
  iSlider.style("top" , "330px");
  iSlider.style("left", "870px")
  iSlider.input(updateS3);
  t5 = createP("Infected = " + iSlider.value());
  t5.style("position" , "absolute");
  t5.style("top" , "280px");
  t5.style("left", "870px")

}

function draw() {
  background("white");
  strokeWeight(1);
  stroke(0);
  line(0, 0, sWidth, 0);
  line(0, 0, 0, sHeight);
  line(sWidth, 0, sWidth, sHeight);
  line(0, sHeight, sWidth, sHeight);




  //line(0,500,400,500);
  if(start){
    append(lines, pop_.draw());
    var width = sWidth - bWidth;
    var height = gHeight + sHeight
    var n = lines.length;

    for(var i = 0; i < lines.length; i++){
      stroke('red');
      rect((i*width)/n, height - lines[i][1], width/n, lines[i][1]);
      stroke('blue')
      rect((i*width)/n, height - lines[i][1] - lines[i][0], width/n, lines[i][0]);
      stroke('green')
      rect((i*width)/n, height - lines[i][1] - lines[i][0] - lines[i][2], width/n, lines[i][2]);
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
    text("Recovered: " + round(lines[lines.length-1][2]* pop_.pop.length/100, 0), sWidth - bWidth + 10, sHeight + gHeight - 80);
    stroke("blue");
    text("Susceptible: " + round(lines[lines.length-1][0] * pop_.pop.length/100, 0), sWidth - bWidth + 10, sHeight + gHeight - 50);
    stroke("red");
    text("Infected: " + round(lines[lines.length-1][1] * pop_.pop.length/100, 0), sWidth - bWidth + 10, sHeight + gHeight - 20);

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
    this.speed = 3;
    this.xSpeed = cos(this.dir);
    this.ySpeed = sin(this.dir);
    this.countdown = random(infectPeriod[0], infectPeriod[1]);
    this.distancing = distancing;
  }

  draw(){
    if(this.state == "s"){
      stroke(200);
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
