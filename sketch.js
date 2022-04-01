var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameoverimg,restartimg
var diesound,checkpointsound,jumpsound
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var gameover,restart
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var message = "This is a message";


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  gameoverimg =loadImage("gameOver.png")
  restartimg = loadImage("restart.png")
  groundImage = loadImage("ground2.png");
  diesound = loadSound("die.mp3")
  jumpsound = loadSound("jump.mp3")
  checkpointsound = loadSound("checkpoint.mp3")
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  gameover=createSprite(width/2,height/2)
  restart=createSprite(width/2,height/2+50)
  gameover.addImage(gameoverimg)
  restart.addImage(restartimg)
  restart.scale=0.4
  gameover.scale=0.7
  gameover.visible=false
  restart.visible=false
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  //trex.debug = true
  trex.setCollider("circle",0,0,45);
  
  ground = createSprite(width/2,height-30,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(200,height-25,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  
  score = 0;
  
  //console.log(message);
}

function draw() {
  //console.log(message);

  background(180);
  //displaying score - string concatenation
  text("Score: "+ score, width-250,100);
  

  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -4 - score/100
    //scoring
    //frameRate - fps - 60fps - 30fps
    //score = score + Math.round(getFrameRate()/30);
    if(frameCount%2===0){
      score++
    }
    //assignment - assigns the value 
    //comparison - checks 
    if(score%100===0 && score>0){
      checkpointsound.play();
    }
  
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
   
    //jump when the space key is pressed
    if((keyDown("space") || touches.length>0) && trex.y >= height-60) {
        trex.velocityY = -13;
        jumpsound.play();
        touches=[]
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END; 
        diesound.play()
    }
  }
   else if (gameState === END) {
     ground.velocityX = 0;
     //diesound.play()
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);

     obstaclesGroup.setLifetimeEach(-1)
     cloudsGroup.setLifetimeEach(-1)
     trex.velocityY=0
     trex.changeAnimation("collided")
     gameover.visible=true
     restart.visible=true
   }


   if(mousePressedOver(restart)){
     restartGame();
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
  var decidedFrame;
  if(score<100){
   decidedFrame = 60;
  }
  else if(score>=100 && score <200){
    decidedFrame = 55;
  }
  else if(score>=200 && score<300){
    decidedFrame=50
  }
  else if(score>=300 && score<400){
    decidedFrame=45
  }
  else if(score>=400 && score<500){
    decidedFrame=40
  }
  else{
    decidedFrame=35
  }
 
  /*
  set the upper limit of obstacle velocity - just like bricks in brick breaker game
  */

 if (frameCount % decidedFrame === 0){
   var obstacle = createSprite(width+10,height-45,10,40);
   
   //Game adaptivity
   if(score<500){
    obstacle.velocityX = -6 - score/100;
   }
   else{
     obstacle.velocityX=-11;
   }
   console.log(obstacle.velocityX);
   console.log(score);

   //To see their collider
   //obstacle.debug = true;

    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(width+10,100,40,10);
    cloud.y = Math.round(random(10,height/2));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 210;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
  }
}


function restartGame(){
  gameState=PLAY
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  gameover.visible=false
  restart.visible=false
  trex.changeAnimation("running")
  score=0
}
