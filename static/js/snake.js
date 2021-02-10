const ROWS = 30;
const COLS = 30;



let player;
let evilSnake;
let killing;

let head;
let tail;
let DIRECTION = "right";
let apple;
let playing;
let evilSnakePlaying;
let wasEvilSnakePlaying;
let score;
var SQUARE_WIDTH;
var SQUARE_HEIGHT;


let crunch;
let explosion;

function checkTouching(block1, block2) {
  if ((block1[0] == block2[0]) && (block1[1] == block2[1])) {
    return true;
  } else {
    return false;
  }
}

function Apple() {
  this.color = "rgb(255, 0, 0)";
  this.loc = [round(random(ROWS - 1)), round(random(COLS - 1))];
}

Apple.prototype.draw = function() {
  fill(this.color);
  rect(this.loc[0] * SQUARE_WIDTH, this.loc[1] * SQUARE_HEIGHT, SQUARE_WIDTH, SQUARE_HEIGHT)
}

Apple.prototype.move = function() {
  this.loc = [round(random(0, ROWS - 1)), round(random(0, COLS - 1))];

  //crunch.play();

  for (let i = 0; i < player.body.length; i++) {
    if (checkTouching(this.loc, player.body[i])) {
      this.move();
    }
  }
  for (let i = 0; i < evilSnake.body.length; i++) {
    if (checkTouching(this.loc, evilSnake.body[i])) {
      this.move();
    }
  }

}



function Snake(bodyColor, direction) {
  this.body = [
    [round(random(ROWS - 1)), round(random(COLS - 1))],
  ];
  this.body.push([this.body[0][0] + 1, this.body[0][1]])
  this.color = bodyColor;
  this.direction = direction;
  this.head = this.body[0];
  this.tail = this.body[this.body.length - 1];
}
Snake.prototype.draw = function() {
  fill(this.color);

  for (let i = 0; i < this.body.length; i++) {
    let x = this.body[i][0];
    let y = this.body[i][1];

    drawRect(x, y);


  }

}

Snake.prototype.grow = function() {
  if (checkTouching(this.head, apple.loc)) {
    apple.move();

  } else if (killing) {
    killing = false;
  } else {
    this.body.pop(); // Remove the tail of the snake
  }
}
Snake.prototype.evilSnakeGrow = function() {
  if (checkTouching(this.head, apple.loc)) {
    apple.move();

  } else {
    this.body.pop(); // Remove the tail of the snake
  }

}
Snake.prototype.move = function(apple) {


  if (this.direction === "right") {

    this.body.unshift([this.head[0] + 1, this.head[1]]); // Add a new head to the snake 1 block to the right of the snake's old head
  } else if (this.direction === "down") {
    this.body.unshift([this.head[0], this.head[1] + 1]); // Add a new head to the snake 1 block below the snake's old head

  } else if (this.direction === "up") {
    this.body.unshift([this.head[0], this.head[1] - 1]); // Add a new head to the snake 1 block above the snake's old head
  } else {
    this.body.unshift([this.head[0] - 1, this.head[1]]); // Add a new head to the snake 1 block to the left of the snake's old head
  }



  this.head = this.body[0]; // Assign the snake's new head to 'newHead'

  this.tail = this.body[this.body.length - 1]; // Set our tail to our new tail
}

Snake.prototype.runAI = function(apple) {
    let dX = this.head[0]*SQUARE_WIDTH - apple.loc[0] * SQUARE_WIDTH;
    let dY = this.head[1]*SQUARE_HEIGHT - apple.loc[1] * SQUARE_HEIGHT;
    let randint = random(0, 1);
    if (this.head[0] < 1) {
      console.log("left wall")
      if (this.direction==="left") {
        if (randint) {
          this.direction = "up";
        } else {
          this.direction = "down";
        }
        } else {
        this.direction = "right";
      }
    } else if (this.head[0] > ROWS - 2){
        console.log("right wall")

        if (this.direction==="right") {
          if (randint) {
            this.direction = "up";
          } else {
            this.direction = "down";
          }
        } else {
          this.direction = "left";
        }
      }
      else if (this.head[1] < 1) {
        console.log("top wall")

        if (this.direction==="up") {
          if (randint) {
            this.direction = "left";
          } else {
            this.direction = "right";
          }
        } else {
          this.direction = "down";
        }
    } else if (this.head[1] > COLS - 2) {
        console.log("bottom wall")

      if (this.direction=="down") {
        if (randint) {
          this.direction = "left";
        } else {
          this.direction = "right";
        }
      } else {
        this.direction = "up";
      }


      }
    else {
      console.log("something else");
        if ((dX<0)&&(this.direction!=="left")) {
          console.log("right");
          this.direction = "right";
        }
        if ((dX>0)&&(this.direction!=="right")) {
            console.log("left");

          this.direction = "left";
        }
        if ((dY<0) && (this.direction!=="up")) {
          console.log("down")
          this.direction = "down";
        } if ((dY>0)&&(this.direction!=="down")) {
          console.log("up")
          this.direction = "up";
        }
      }
  }

Snake.prototype.checkWallCollision = function() {
  if ((this.head[0] < 0) | (this.head[0] > ROWS - 1) | (this.head[1] < 0) | (this.head[1] > COLS - 1)) {
    return true;
  } else {
    return false;
  }

}

Snake.prototype.checkBodyCollision = function(otherSnake) {
  for (let i = 0; i < otherSnake.body.length; i++) {
    if (checkTouching(this.head, otherSnake.body[i])) {

      return true;
    }
  }
}
Snake.prototype.checkSelfCollision = function() {
  for (let i = 1; i < this.body.length; i++) {
    if (checkTouching(this.head, this.body[i])) {

      return true;
    }
  }
}

Snake.prototype.checkDeath = function(otherSnake) {
  if (this.checkBodyCollision(otherSnake) | this.checkWallCollision() | this.checkSelfCollision()) {
    return true;
  } else {
    return false;
  }


}

Snake.prototype.checkEvilSnakeDeath = function(otherSnake) {
  if (this.checkBodyCollision(otherSnake) | this.checkWallCollision()) {
    return true;
  } else {
    return false;
  }
}


function reset() {
  playing = true;
  player = new Snake("rgb(0, 255, 0)", "right");
  evilSnake = new Snake("rgb(0, 0, 255)", "left");
  apple  = new Apple();
  score = player.body.length;

}

//crunch = loadSound('./assets/Chewing-popcorn-single-crunch-A-www.fesliyanstudios.com.mp3');
//explosion = loadSound('./assets/Explosion+3.mp3');


function setup() {
  playing = true;






  createCanvas(400, 400);
  frameRate(10);
  player = new Snake("rgb(0, 255, 0)", "right");
  evilSnake = new Snake("rgb(0, 0, 255)", "left");


  apple = new Apple();


  score = player.body.length;
  SQUARE_WIDTH = width / ROWS;
  SQUARE_HEIGHT = height / COLS;

}

function drawRect(x, y) {
    rect(SQUARE_WIDTH*x, SQUARE_HEIGHT*y, SQUARE_WIDTH, SQUARE_HEIGHT);
}
function drawGrid() {
  stroke('rgba(0, 0, 0, 0.3)');
  strokeWeight(0.5);
  for (let i = 0; i < ROWS; i++) {

    line(i * SQUARE_WIDTH, 0, i * SQUARE_WIDTH, height);

  }
  for (let j = 0; j < COLS; j++) {
    line(0, j * SQUARE_HEIGHT, width, j * SQUARE_HEIGHT);
  }
}


function draw() {





  function drawRect(x, y) {
    rect(SQUARE_WIDTH * x, SQUARE_HEIGHT * y, SQUARE_WIDTH, SQUARE_HEIGHT);
  }









  if (playing) {
    score = player.body.length;
    stroke(255);

    background(240);

    apple.draw();
    drawGrid();
    player.draw();
    player.grow(killing);
    player.move(apple);
    evilSnake.runAI(apple);

    if (evilSnakePlaying) {
      playing = !(player.checkEvilSnakeDeath(evilSnake));
      killing = false;

      if (wasEvilSnakePlaying) {
          evilSnake.draw();
          evilSnake.move(apple);
          evilSnake.grow();

      } else {
         playing = !player.checkWallCollision();




        setTimeout(function() {

          wasEvilSnakePlaying = true;
          playing = !(player.checkEvilSnakeDeath(evilSnake));

        }, 5000)
      }
    } else {
         killing = false;

          playing = !player.checkWallCollision();

      }

    //doMouseMoves();
    if (!evilSnake.checkEvilSnakeDeath(player)) {
        evilSnakePlaying = true;





    } else {
      textSize(30);
      text("BAM +1!", 150, 150);

      //explosion.setVolume(0.5);

      //explosion.play();

      if (!evilSnakePlaying) {
        killing = false;
      } else {
        killing = true;
      }
      evilSnakePlaying = false;
      wasEvilSnakePlaying = false;


    }

    fill(0);
    textSize(15);
    text(`Score: ${score}`, 20, 30);

  } else {
    //explosion.setVolume(1.0);
    //explosion.play();

    noLoop();
    noStroke();
    textSize(30);
    fill(0)
    stroke(255);
    text(`GAME OVER`, width / 2 - 100, height / 3);
    text(`Final Score: ${score}`, width / 2 - 100, 1.3 * height / 3);
    textSize(25);
    text('Press any key to retry', width / 2 - 100, 2 * height / 3);
  }



}




function mouseMoved() {
  doMouseMoves();
}

function doMouseMoves() {
  let dX = mouseX - player.head[0] * SQUARE_WIDTH;
  let dY = mouseY - player.head[1] * SQUARE_HEIGHT;
  let randint = random(0, 1);

  if (abs(dX) > abs(dY)) {
    if (dX > 0) {
      if (player.direction !== "left") {
        player.direction = "right";
      } else {
        player.direction = "down";
      }
    } else {
      if (player.direction !== "right") {
        player.direction = "left";
      } else {
        player.direction = "up";
      }

    }
  } else if (abs(dY) > abs(dX)) {
    if (dY > 0) {
      if (player.direction !== "up") {
        player.direction = "down";
      } else {
        player.direction = "left";
      }



    } else {
      if (player.direction !== "down") {
        player.direction = "up";
      } else {
        player.direction = "right";
      }



    }
  }

}



function keyPressed() {
  switch (keyCode) {
    case LEFT_ARROW:
      if (player.direction !== "right") {
        player.direction = "left";
      }
      break;
    case RIGHT_ARROW:
      if (player.direction !== "left") {
        player.direction = "right";
      }
      break;

    case DOWN_ARROW:
      if (player.direction !== "up") {
        player.direction = "down";
      }
      break;

    case UP_ARROW:
      if (player.direction !== "down") {
        player.direction = "up";
      }
      default:
        if (playing === false) {
          reset();
          loop();
          break;
        }


  }

}